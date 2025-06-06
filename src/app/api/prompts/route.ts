import {NextResponse} from 'next/server';
import {db} from '@/lib/firebase';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/lib/auth';
import {v4 as uuidv4} from 'uuid';
import {CollectionReference, Query} from 'firebase-admin/firestore';
import type { Prompt } from '@/lib/prompt-schema';
import { validatePrompt } from '@/lib/prompt-schema';

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 12; // Number of items per page


export async function GET(request: Request) {
  // Return empty array if Firebase is not initialized (build time)
  if (!db) {
    console.warn('Firebase is not initialized - running in build mode, returning empty array');
    return NextResponse.json(
      { items: [], total: 0, page: 1, totalPages: 0 },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'latest';

    let query: CollectionReference | Query = db.collection('prompts');

    // Apply filters
    // We'll fetch all documents and filter in memory for search
    // This allows us to search across multiple fields
    let performInMemorySearch = false;
    let searchLower = '';
    
    if (search) {
      performInMemorySearch = true;
      searchLower = search.toLowerCase();
    }

    if (tag) {
      // Handle both array and string formats for tags
      // First, get all documents where tags is an array and contains the tag (case-insensitive)
      const tagLower = tag.toLowerCase();

      // We need to handle both formats, so we'll fetch all documents and filter in memory
      // This is a workaround for Firestore's limitations with mixed data types
      // In a production app, you'd want to standardize your data format
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    // Fetch all matching documents based on the current query
    // NOTE: This approach works for small to medium collections but is not efficient for very large collections
    const allMatchingDocs = await query.get();

    // Apply in-memory filtering for both search and tags
    let filteredDocs = allMatchingDocs.docs;
    
    // Filter by tag if needed
    if (tag) {
      const tagLower = tag.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => {
        const data = doc.data();
        // Handle array format
        if (Array.isArray(data.tags)) {
          return data.tags.some(t => t.toLowerCase() === tagLower);
        }
        // Handle string format
        else if (typeof data.tags === 'string') {
          return data.tags
              .split(',')
              .map(t => t.trim().toLowerCase())
              .includes(tagLower);
        }
        return false;
      });
    }
    
    // Apply search filter if needed
    if (performInMemorySearch) {
      filteredDocs = filteredDocs.filter(doc => {
        const data = doc.data();
        // Search across multiple fields
        const titleMatch = data.title?.toLowerCase().includes(searchLower) || false;
        const contentMatch = data.content?.toLowerCase().includes(searchLower) || false;
        const descriptionMatch = data.description?.toLowerCase().includes(searchLower) || false;
        const categoryMatch = data.category?.toLowerCase().includes(searchLower) || false;
        
        // Search in tags
        let tagsMatch = false;
        if (Array.isArray(data.tags)) {
          tagsMatch = data.tags.some(t => t.toLowerCase().includes(searchLower));
        } else if (typeof data.tags === 'string') {
          tagsMatch = data.tags.toLowerCase().includes(searchLower);
        }
        
        // Return true if any field matches
        return titleMatch || contentMatch || descriptionMatch || categoryMatch || tagsMatch;
      });
    }

    const total = filteredDocs.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    
    // Convert to array for manual sorting and pagination
    let items = filteredDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prompt[];
    
    // Apply sorting in memory
    switch (sortBy) {
      case 'popular':
        items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'latest':
      default:
        items.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }
    
    // Apply pagination manually
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return NextResponse.json(
      {
        items: paginatedItems,
        total,
        page,
        totalPages,
        itemsPerPage: ITEMS_PER_PAGE
      },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(request: Request) {
  // Return 503 Service Unavailable if Firebase is not initialized
  if (!db) {
    console.warn('Firebase is not initialized - running in build mode');
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();

    if (!validatePrompt(data)) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const promptId = uuidv4(); // Generate prompt ID upfront
    let userId: string;
    let authorName: string;
    let isAnonymous: boolean;
    let anonymousSessionId: string | null = null;
    let userDetails: any;
    const now = new Date();
    const timestamp = {
        seconds: Math.floor(now.getTime() / 1000),
        nanoseconds: (now.getTime() % 1000) * 1000000
    };

    if (session?.user?.email) {
      // Authenticated user
      userId = session.user.email;
      authorName = data.author || session.user.name || session.user.email;
      isAnonymous = false;
      userDetails = {
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
      };
    } else {
      // Anonymous user
      anonymousSessionId = uuidv4();
      userId = anonymousSessionId; // Store anonymousSessionId as user_id for the prompt
      authorName = 'Anonymous User';
      isAnonymous = true;
      userDetails = {
        email: null,
        name: 'Anonymous User',
        image: null,
      };
    }

    const promptData = {
      id: promptId,
      title: data.title,
      content: data.content,
      description: data.description || '',
      useCases: data.useCases || [],
      category: data.category || 'General',
      tags: data.tags || [],
      author: authorName,
      user_id: userId,
      user_details: userDetails,
      isAnonymous: isAnonymous,
      likes: 0,
      copies: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Create document in Firestore with the explicit ID
    await db.collection('prompts').doc(promptId).set(promptData);

    const responsePayload: any = { ...promptData };
    if (isAnonymous && anonymousSessionId) {
      responsePayload.anonymousSessionId = anonymousSessionId;
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}