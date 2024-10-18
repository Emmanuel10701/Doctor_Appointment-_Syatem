import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma';

// POST request: Create a new appointment
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { patientName, doctorName, specialty, date, time, fee } = body;

  // Check for missing fields
  if (!patientName || !doctorName || !specialty || !date || !time || !fee) {
    return new NextResponse(
      JSON.stringify({ message: 'Missing Fields' }),
      { status: 400 }
    );
  }

  try {
    // Create a new appointment without doctor relation
    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        doctorName, // Store doctor name directly
        specialty,
        date: new Date(date),
        time,
        fee,
      },
    });

    return new NextResponse(JSON.stringify(appointment), { status: 201 });
  } catch (error:any) {
    console.error('Error during POST:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', details: error.message }),
      { status: 500 }
    );
  }
}

// GET request: Retrieve all appointments
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch appointments.',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// GET request: Retrieve a single appointment by ID
export async function GET_ONE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: String(id) },
    });

    if (!appointment) {
      return new NextResponse(
        JSON.stringify({ message: 'Appointment not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// PUT request: Update an appointment by ID
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();
  const { patientName, doctorName, specialty, date, time, fee } = body; // Use doctorName

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: String(id) },
      data: {
        patientName,
        doctorName, // Use doctorName directly
        specialty,
        date: new Date(date), // Ensure date is in the correct format
        time,
        fee,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete an appointment by ID
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
    await prisma.appointment.delete({
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
