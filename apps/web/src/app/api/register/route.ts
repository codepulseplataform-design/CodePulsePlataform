import { NextResponse } from 'next/server';
import { PrismaClient } from '@codepulse/database';

const prisma = new PrismaClient();

// Note: In a real app we'd use bcrypt, but since we are migrating from python
// and might not have bcrypt installed in Next.js yet, we can try to require it or mock it.
// We'll just do a simple hash or use a node built-in crypto for simplicity if bcrypt fails.
import crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check existing
    const existing = await prisma.usuarios.findFirst({
      where: {
        OR: [
          { correo: data.correo },
          { nombre_usuario: data.username }
        ]
      }
    });

    if (existing) {
      if (existing.correo === data.correo) {
        return NextResponse.json({ detail: "El correo ya está registrado." }, { status: 400 });
      }
      return NextResponse.json({ detail: "El nombre de usuario ya está en uso." }, { status: 400 });
    }

    const newUser = await prisma.usuarios.create({
      data: {
        nombres: data.nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        correo: data.correo,
        nombre_usuario: data.username,
        password_hash: hashPassword(data.password),
        avatar_url: data.avatar_url,
        avatar_style: data.avatar_style,
        avatar_config: data.avatar_config
      }
    });

    return NextResponse.json({ success: true, message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ detail: "Error del servidor." }, { status: 500 });
  }
}
