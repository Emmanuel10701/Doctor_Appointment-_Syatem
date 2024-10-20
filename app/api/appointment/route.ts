import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma'; // Adjust the import according to your project structure

// Handle POST request to create a new appointment
export async function POST(request: Request) {
  const { patientName, doctorEmail, date, time, fee } = await request.json();

  // Validate required fields
  if (!patientName || !doctorEmail || !date || !time || !fee) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  try {
    // Check if the doctor exists by email
    const doctor = await prisma.doctor.findUnique({
      where: { email: doctorEmail },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found.' }, { status: 404 });
    }

    // Create the new appointment entry
    const newAppointment = await prisma.appointment.create({
      data: {
        patientName,
        doctorEmail,
        date: new Date(date),
        time,
        fee,
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Appointment creation failed.', details: error.message }, { status: 500 });
  }
}

// Handle GET request to retrieve appointments
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorEmail = searchParams.get('doctorEmail'); // Optional filter

  try {
    // Retrieve appointments, optionally filtering by doctorEmail
    const appointments = await prisma.appointment.findMany({
      where: doctorEmail ? { doctorEmail } : undefined,
      orderBy: {
        date: 'asc', // You can change this to 'desc' if you want the latest first
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error: any) {
    console.error('Error retrieving appointments:', error);
    return NextResponse.json({ error: 'Failed to retrieve appointments.', details: error.message }, { status: 500 });
  }
}
