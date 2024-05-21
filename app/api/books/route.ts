import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return Response.json(
      { data: null, message: 'Method not allowed' },
      { status: 405 },
    );
  }

  try {
    const data: { bookIds: string[] } = await req.json();
    const bookIds = data.bookIds;

    if (bookIds.length == 0) {
      return Response.json(
        { data: [], message: 'Required parameter was not provided' },
        { status: 200 },
      );
    }

    const books = await prisma?.book.findMany({
      where: { id: { in: bookIds } },
      select: {
        id: true,
        type: true,
        price: true,
        authorId: true,
        author: true,
        title: true,
      },
    });

    const result = !books ? [] : (books as BookSimplified[]);

    return Response.json({ data: result, message: 'Ok' }, { status: 200 });
  } catch (e) {
    console.error('DatabaseError:', e);

    return Response.json(
      { data: null, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
