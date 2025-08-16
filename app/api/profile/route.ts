
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return NextResponse.json(user, { status: 200 });
}

export async function PUT(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  console.log('Updating profile with data:', data);
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      birthDate: new Date(data.birthDate),
      birthTime: data.birthTime,
    },
  });
  console.log('Updated user:', user);
  return NextResponse.json(user, { status: 200 });
}
