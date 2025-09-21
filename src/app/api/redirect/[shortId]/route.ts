
import {NextRequest, NextResponse} from 'next/server';
import { ensureAdminDb } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  {params}: {params: {shortId: string}}
) {
  const {shortId} = params;

  if (!shortId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const db = ensureAdminDb();
    const linkDocRef = db.collection('links').doc(shortId);
    const docSnap = await linkDocRef.get();

    if (docSnap.exists) {
      const {longUrl} = docSnap.data()!;
      return NextResponse.redirect(longUrl);
    } else {
      // Not found, redirect to home page
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
