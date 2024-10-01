import prisma from '../../../../libs/prisma';
import { NextResponse } from 'next/server';

// GET request: Retrieve a single appointment by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing Appointment ID' }),
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return new NextResponse(
        JSON.stringify({ message: 'Appointment not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(appointment), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// PUT request: Update an appointment by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updatedData = await request.json();

    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing Appointment ID' }),
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...updatedData,
        date: updatedData.date ? new Date(updatedData.date) : undefined,
      },
    });

    return new NextResponse(JSON.stringify(appointment), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete an appointment by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing Appointment ID' }),
        { status: 400 }
      );
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return new NextResponse(JSON.stringify({ message: 'Appointment deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
