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

    if (!user || user.password_hash !== hashPassword(data.password)) {
      return NextResponse.json({ detail: "Credenciales inválidas" }, { status: 401 });
    }

    // Mock token for now to keep frontend working
    const token = Buffer.from(JSON.stringify({ sub: user.id, email: user.correo })).toString('base64');

    return NextResponse.json({
      success: true,
      access_token: token,
      user: {
        id: user.id,
        nombre: user.nombres,
        correo: user.correo,
        username: user.nombre_usuario,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ detail: "Error del servidor." }, { status: 500 });
  }
}
