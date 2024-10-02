import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma';

// Get a single patient by ID
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'ID is required' }),
      { status: 400 }
    );
  }

  const patient = await prisma.patient.findUnique({
    where: { id: String(id) },
  });

  if (!patient) {
    return new NextResponse(
      JSON.stringify({ error: 'Patient not found' }),
      { status: 404 }
    );
  }

  return NextResponse.json(patient);
}

// Update a patient by ID
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const { name, email, phone, birthDate, gender, address, aboutMe, image } = await req.json();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'ID is required' }),
      { status: 400 }
    );
  }

  const updatedPatient = await prisma.patient.update({
    where: { id: String(id) },
    data: {
      name,
      email,
      phone: phone || null,
      birthDate: new Date(birthDate),
      gender,
      address,
      aboutMe,
      image,
    },
  });

  return NextResponse.json(updatedPatient);
}

// Delete a patient by ID
export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'ID is required' }),
      { status: 400 }
    );
  }

  await prisma.patient.delete({
    where: { id: String(id) },
  });

  return new NextResponse(null, { status: 204 });
}
