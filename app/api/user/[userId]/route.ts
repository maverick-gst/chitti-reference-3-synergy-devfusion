import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const user = await prismadb.prisma_mongo.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: authUserId } = await auth();
    const body = await req.json();

    const { email, name } = body;

    if (!authUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const user = await prismadb.prisma_mongo.user.update({
      where: {
        id: params.userId,
      },
      data: {
        email,
        name,
      }
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: authUserId } = await auth();

    if (!authUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const user = await prismadb.prisma_mongo.user.delete({
      where: {
        id: params.userId,
      }
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
