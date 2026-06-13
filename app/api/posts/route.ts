import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

async function isAdmin() {
    const session = await auth();
    return session?.user && session.user.role === 'ADMIN';
}

export async function GET(request: NextRequest) {
    try {
        const admin = await isAdmin();
        const posts = await prisma.post.findMany({
            where: admin ? undefined : { published: true },
            orderBy: { publishedAt: 'desc' },
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const post = await prisma.post.create({
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                summary: body.summary || null,
                published: !!body.published,
                coverImage: body.coverImage || null,
                author: body.author || 'Nguyễn Đình Chiến',
                category: body.category || 'General',
                tags: body.tags || [],
                publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
            },
        });
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
