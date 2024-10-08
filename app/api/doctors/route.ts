import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../libs/prisma'; // Adjust the path if needed

// Handle POST request to create a new doctor
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Prisma client:', prisma);
    console.log('Doctor model:', prisma.doctor);
    const {
      name,
      email,
      specialty,
      experience,
      fees,
      education,
      address1,
      address2,
      aboutMe,
      image,
      userId
    } = body;

    // Validate required fields
    if (!name || !email || !userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Name, email, and userId are required' }), 
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }), 
        { status: 404 }
      );
    }
    const feesString = String(fees);

    // Check if the email is already in use
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (existingDoctor) {
      return new NextResponse(
        JSON.stringify({ error: 'Doctor with this email already exists' }), 
        { status: 400 }
      );
    }

    // Create the new doctor entry
    const newDoctor = await prisma.doctor.create({
      data: {
        name,
        email,
        specialty,
        experience,
        fees: feesString, // Use the string representation of fees
        education,
        address1,
        address2,
        aboutMe,
        image,
        userId,
      },
    });

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating doctor:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error creating doctor', details: error.message }), 
      { status: 500 }
    );
  }
}

// Handle GET request to retrieve doctors
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single doctor by ID
      const doctor = await prisma.doctor.findUnique({
        where: { id },
      });

      if (!doctor) {
        return new NextResponse(
          JSON.stringify({ error: 'Doctor not found' }), 
          { status: 404 }
        );
      }

      return NextResponse.json(doctor);
    } else {
      // Fetch all doctors
      const doctors = await prisma.doctor.findMany();
      return NextResponse.json(doctors);
    }
  } catch (error: any) {
    console.error('Error fetching doctors:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching doctors', details: error.message }), 
      { status: 500 }
    );
  }
}
