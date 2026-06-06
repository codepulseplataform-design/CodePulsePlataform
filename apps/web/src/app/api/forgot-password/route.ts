import { NextResponse } from 'next/server';
import { PrismaClient } from '@codepulse/database';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const user = await prisma.usuarios.findUnique({
      where: { correo: data.correo }
    });

    if (!user) {
      return NextResponse.json({ success: true, message: "Si el correo está registrado, se enviará un enlace de recuperación." });
    }

    return NextResponse.json({
      success: true,
      message: `Simulación: Se enviaron instrucciones a ${data.correo}.`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ detail: "Error del servidor." }, { status: 500 });
  }
}
