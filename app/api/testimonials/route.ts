import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ],
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
        const session = await auth();
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        if (!session?.user || session.user.email !== adminEmail) {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

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