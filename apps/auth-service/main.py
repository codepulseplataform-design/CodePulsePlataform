from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional, Dict, Any

from auth import Usuario, get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_db

app = FastAPI(title="Auth Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRegister(BaseModel):
    nombre: str
    apellido1: str
    apellido2: Optional[str] = None
    correo: EmailStr
    password: str
    username: str
    avatar_url: Optional[str] = None
    avatar_style: Optional[str] = "avataaars"
    avatar_config: Optional[Dict[str, Any]] = None

class UserLogin(BaseModel):
    correo: EmailStr
    password: str

class ForgotPassword(BaseModel):
    correo: EmailStr

class ResetPassword(BaseModel):
    correo: EmailStr
    new_password: str

@app.get("/health")
def health():
    return {"status": "UP", "service": "Auth Service"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(Usuario).filter((Usuario.correo == user_data.correo) | (Usuario.nombre_usuario == user_data.username)).first()
    if existing_user:
        if existing_user.correo == user_data.correo:
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")
        else:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso.")

    new_user = Usuario(
        nombres=user_data.nombre,
        apellido1=user_data.apellido1,
        apellido2=user_data.apellido2,
        correo=user_data.correo,
        nombre_usuario=user_data.username,
        password_hash=get_password_hash(user_data.password),
        avatar_url=user_data.avatar_url,
        avatar_style=user_data.avatar_style,
        avatar_config=user_data.avatar_config
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"success": True, "message": "Usuario registrado exitosamente."}

@app.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo == login_data.correo).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.correo, "username": user.nombre_usuario, "role": user.rol}, 
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
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo == data.correo).first()
    if not user:
        return {"success": True, "message": "Si el correo está registrado, se enviará un enlace de recuperación."}
        
    return {
        "success": True,
        "message": f"Simulación: Se enviaron instrucciones de recuperación a {data.correo}."
    }

@app.post("/reset-password")
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo == data.correo).first()
    if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado.")
        
    user.password_hash = get_password_hash(data.new_password)
    db.commit()
    
    return {"success": True, "message": "Contraseña actualizada exitosamente."}
