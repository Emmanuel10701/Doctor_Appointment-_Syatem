import prisma from '../../../libs/prisma';
import { NextResponse } from 'next/server';

// Define the type for the appointment data
interface AppointmentData {
  patientName: string;
  doctorId: string; // Changed from doctorName to doctorId
  specialty: string;
  date: string; // Use string for ISO date format
  time: string;
  fee: number;
}

// POST request: Book a new appointment
export async function POST(request: Request) {
  try {
    const body: AppointmentData = await request.json(); // Use the defined type here
    const { patientName, doctorId, specialty, date, time, fee } = body;

    // Check for missing fields
    if (!patientName || !doctorId || !specialty || !date || !time || !fee) {
      return new NextResponse(
        JSON.stringify({ message: 'Missing Fields' }),
        { status: 400 }
      );
    }

    // Create new appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        doctorId, // Use doctorId instead of doctorName
        specialty,
        date: new Date(date), // Ensure the date is in the correct format
        time,
        fee,
      },
    });

    return new NextResponse(JSON.stringify(appointment), { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

// GET request: Retrieve appointments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientName = searchParams.get('patientName');
    const doctorId = searchParams.get('doctorId'); // Changed from doctorName to doctorId

    // Build query conditions
    const conditions: any = {}; // Use a type that can accept any structure
    if (patientName) {
      conditions.patientName = patientName;
    }
    if (doctorId) {
      conditions.doctorId = doctorId; // Use doctorId for filtering
    }

    // Fetch appointments based on conditions
    const appointments = await prisma.appointment.findMany({
      where: conditions,
      include: {
        doctor: true, // Include related doctor details
      },
      orderBy: {
        createdAt: 'desc', // Optional: Order by createdAt or any other field
      },
    });

    return new NextResponse(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
