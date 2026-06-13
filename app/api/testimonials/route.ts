import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const where = published === 'true' ? { published: true } : {};

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.authorName || !body.content) {
      return NextResponse.json(
        { error: 'Author name and content are required.' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        authorName: body.authorName,
        authorTitle: body.authorTitle || '',
        content: body.content,
        avatar: body.avatar || null,
        order: Number(body.order || 0),
        published: body.published !== undefined ? body.published : true,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
