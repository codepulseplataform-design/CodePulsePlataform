import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from prisma import Prisma



#Aqui voy a poner la seguridad mau por si la vez esto es seguridad y funciones Helpers

SECRET_KEY = os.environ.get("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("CRÍTICO: No se encontró la variable SECRET_KEY en el entorno.")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
 

#Mi algoritmo Hash y el tiempo de expiración del Token
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

#Función para encriptar una contraseña Esta cosita es para el register
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

#Función para verificar si la contraseña del login coincide con la de la BD 
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Genera el token que le devolvemos al usuario
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



# ---------------------------------------
# Conexion a Prisma BD esta cosita es para cuando hagamos el register y login
# ---------------------------------------

async def get_prisma():
    prisma = Prisma()
    await prisma.connect()
    try:
        yield prisma
    finally:
        if prisma.is_connected():
            await prisma.disconnect()

# ------------------------------------------------
# Esquemas de entrada
#_------------------------------------------------

# 1. El molde para cuando alguien se registra en Code Pulse
class UserRegister(BaseModel):
    nombres: str
    apellido1: str
    apellido2: Optional[str] = None  
    nombre_usuario: str
    correo: EmailStr                 
    password: str
    avatar_url: Optional[str] = None
    avatar_style: Optional[str] = "avataaars"
    avatar_config: Optional[dict] = None

class UserLogin(BaseModel):
    correo: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    correo: EmailStr

class ResetPasswordRequest(BaseModel):
    correo: EmailStr
    new_password: str