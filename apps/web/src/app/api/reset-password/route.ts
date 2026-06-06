import { NextResponse } from 'next/server';
import { PrismaClient } from '@codepulse/database';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const user = await prisma.usuarios.findUnique({
      where: { correo: data.correo }
    });

    if (!user) {
      return NextResponse.json({ detail: "Usuario no encontrado." }, { status: 400 });
    }

    await prisma.usuarios.update({
      where: { correo: data.correo },
      data: { password_hash: hashPassword(data.new_password) }
    });

    return NextResponse.json({ success: true, message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ detail: "Error del servidor." }, { status: 500 });
  }
}
