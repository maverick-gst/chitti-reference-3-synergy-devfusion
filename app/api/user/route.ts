import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import prismadb from '@/lib/prismadb';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
        const body = await req.json();
        const { email, name } = body;

        if (!email || !name) {
            return new NextResponse("Email and name are required", { status: 400 });
        }

        const user = await prismadb.prisma_mongo.user.create({
            data: {
                email,
                name,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log('[USER_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const searchParams = req.nextUrl.searchParams;
        const search = searchParams.get('search') || '';

        const users = await prismadb.prisma_mongo.user.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.log('[USERS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
