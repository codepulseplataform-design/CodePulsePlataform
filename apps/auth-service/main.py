from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from prisma import Prisma

from auth import (
    UserRegister, 
    UserLogin, 
    ForgotPasswordRequest, 
    ResetPasswordRequest,
    get_password_hash, 
    verify_password, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES, 
    get_prisma
)

app = FastAPI(title="Auth Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "UP", "service": "Auth Service"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, prisma: Prisma = Depends(get_prisma)):
    # Verificamos si el usuario ya existe por correo o nombre de usuario
    existing_user = await prisma.usuarios.find_first(
        where={
            "OR": [
                {"correo": user_data.correo},
                {"nombre_usuario": user_data.nombre_usuario}
            ]
        }
    )
    
    if existing_user:
        if existing_user.correo == user_data.correo:
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")
        else:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso.")

    new_user = await prisma.usuarios.create(
        data={
            "nombres": user_data.nombres,
            "apellido1": user_data.apellido1,
            "apellido2": user_data.apellido2,
            "correo": user_data.correo,
            "nombre_usuario": user_data.nombre_usuario,
            "password_hash": get_password_hash(user_data.password),
            "avatar_url": user_data.avatar_url,
            "avatar_style": user_data.avatar_style,
            # We can only pass dict if Prisma JSON field accepts it, usually it does or we can use json.dumps
            # If prisma accepts dict directly for Json field:
            "avatar_config": user_data.avatar_config
        }
    )
    
    return {"success": True, "message": "Usuario registrado exitosamente."}

@app.post("/login")
async def login(login_data: UserLogin, prisma: Prisma = Depends(get_prisma)):
    user = await prisma.usuarios.find_unique(
        where={
            "correo": login_data.correo
        }
    )
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id), 
            "email": user.correo, 
            "username": user.nombre_usuario, 
            "role": user.rol
        }, 
        expires_delta=access_token_expires
    )
    
    return {
        "success": True,
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "nombre": user.nombres,
            "correo": user.correo,
            "username": user.nombre_usuario,
            "avatar_url": user.avatar_url
        }
    }

@app.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, prisma: Prisma = Depends(get_prisma)):
    user = await prisma.usuarios.find_unique(
        where={
            "correo": data.correo
        }
    )
    if not user:
        return {"success": True, "message": "Si el correo está registrado, se enviará un enlace de recuperación."}
        
    return {
        "success": True,
        "message": f"Simulación: Se enviaron instrucciones de recuperación a {data.correo}."
    }

@app.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, prisma: Prisma = Depends(get_prisma)):
    user = await prisma.usuarios.find_unique(
        where={
            "correo": data.correo
        }
    )
    if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado.")
        
    await prisma.usuarios.update(
        where={
            "id": user.id
        },
        data={
            "password_hash": get_password_hash(data.new_password)
        }
    )
    
    return {"success": True, "message": "Contraseña actualizada exitosamente."}

