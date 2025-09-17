
import {NextRequest, NextResponse} from 'next/server';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '@/lib/firebase';

export async function GET(
  req: NextRequest,
  {params}: {params: {shortId: string}}
) {
  const {shortId} = params;

  if (!shortId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const linkDocRef = doc(db, 'links', shortId);
    const docSnap = await getDoc(linkDocRef);

    if (docSnap.exists()) {
      const {longUrl} = docSnap.data();
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
