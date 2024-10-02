import prisma from '../../../../libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Handle GET, PUT, and DELETE requests for a single user
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    // Fetch a single user by ID
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete a user by ID
export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    await prisma.user.delete({
      where: { id: String(id) },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
