'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Dices, 
  Eye, 
  EyeOff, 
  Info 
} from 'lucide-react';
import { UserProfile } from './LoginComponent';

// Constantes para el creador de Avatares (Dicebear)
const HAIR_OPTIONS = [
  { value: 'shortFlat', label: 'Corto Liso' },
  { value: 'shortRound', label: 'Corto Redondo' },
  { value: 'shortWaved', label: 'Corto Ondulado' },
  { value: 'shortCurly', label: 'Corto Rizado' },
  { value: 'theCaesar', label: 'César' },
  { value: 'dreads01', label: 'Dreadlocks 1' },
  { value: 'dreads02', label: 'Dreadlocks 2' },
  { value: 'bob', label: 'Bob' },
  { value: 'bun', label: 'Chongo' },
  { value: 'curly', label: 'Largo Rizado' },
  { value: 'curvy', label: 'Ondulado' },
  { value: 'fro', label: 'Afro' },
  { value: 'froBand', label: 'Afro con Banda' },
  { value: 'miaWallace', label: 'Mia Wallace' },
  { value: 'shavedSides', label: 'Rapado Lados' },
  { value: 'straight01', label: 'Liso Largo 1' },
  { value: 'straight02', label: 'Liso Largo 2' },
  { value: 'straightAndStrand', label: 'Liso con Mechón' },
  { value: 'bigHair', label: 'Pelo Grande' },
  { value: 'shaggy', label: 'Despeinado' },
  { value: 'hat', label: 'Gorra' },
  { value: 'winterHat1', label: 'Gorro Invierno 1' },
  { value: 'winterHat02', label: 'Gorro Invierno 2' },
  { value: 'turban', label: 'Turbante' },
  { value: 'hijab', label: 'Hiyab' }
];

const HAIR_COLORS = [
  { value: '2c1b18', label: 'Negro', hex: '#2c1b18' },
  { value: '4a312c', label: 'Castaño Oscuro', hex: '#4a312c' },
  { value: '724133', label: 'Castaño', hex: '#724133' },
  { value: 'a55728', label: 'Pelirrojo Oscuro', hex: '#a55728' },
  { value: 'c93305', label: 'Rojo', hex: '#c93305' },
  { value: 'b58143', label: 'Rubio', hex: '#b58143' },
  { value: 'd6b370', label: 'Rubio Dorado', hex: '#d6b370' },
  { value: 'ecdcbf', label: 'Rubio Claro', hex: '#ecdcbf' },
  { value: 'f59797', label: 'Rosa Pastel', hex: '#f59797' },
  { value: 'e8e1e1', label: 'Platinado', hex: '#e8e1e1' }
];

const EYE_OPTIONS = [
  { value: 'default', label: 'Normal' },
  { value: 'happy', label: 'Feliz' },
  { value: 'wink', label: 'Guiño' },
  { value: 'side', label: 'Mirada Lateral' },
  { value: 'squint', label: 'Entrecerrados' },
  { value: 'surprised', label: 'Sorprendido' },
  { value: 'closed', label: 'Cerrados' },
  { value: 'cry', label: 'Llorando' },
  { value: 'eyeRoll', label: 'Ojos Giratorios' },
  { value: 'hearts', label: 'Enamorado' },
  { value: 'winkWacky', label: 'Guiño Loco' },
  { value: 'xDizzy', label: 'Mareado' }
];

const MOUTH_OPTIONS = [
  { value: 'smile', label: 'Sonrisa' },
  { value: 'default', label: 'Normal' },
  { value: 'serious', label: 'Serio' },
  { value: 'sad', label: 'Triste' },
  { value: 'concerned', label: 'Preocupado' },
  { value: 'disbelief', label: 'Incrédulo' },
  { value: 'eating', label: 'Comiendo' },
  { value: 'grimace', label: 'Mueca' },
  { value: 'screamOpen', label: 'Grito' },
  { value: 'tongue', label: 'Lengua' },
  { value: 'twinkle', label: 'Destello' }
];

const SKIN_COLORS = [
  { value: 'ffdbb4', label: 'Pálido', hex: '#ffdbb4' },
  { value: 'edb98a', label: 'Claro', hex: '#edb98a' },
  { value: 'f8d25c', label: 'Amarillo', hex: '#f8d25c' },
  { value: 'fd9841', label: 'Naranja', hex: '#fd9841' },
  { value: 'd08b5b', label: 'Bronceado', hex: '#d08b5b' },
  { value: 'ae5d29', label: 'Castaño', hex: '#ae5d29' },
  { value: '614335', label: 'Oscuro', hex: '#614335' }
];

const CLOTHING_OPTIONS = [
  { value: 'hoodie', label: 'Sudadera con Gorro' },
  { value: 'graphicShirt', label: 'Playera Gráfica' },
  { value: 'blazerAndShirt', label: 'Saco y Camisa' },
  { value: 'blazerAndSweater', label: 'Saco y Suéter' },
  { value: 'collarAndSweater', label: 'Cuello y Suéter' },
  { value: 'overall', label: 'Overol' },
  { value: 'shirtCrewNeck', label: 'Playera Cuello Redondo' },
  { value: 'shirtScoopNeck', label: 'Playera Escotada' },
  { value: 'shirtVNeck', label: 'Playera Cuello V' }
];

const CLOTHES_COLORS = [
  { value: '262e33', label: 'Negro Grisáceo', hex: '#262e33' },
  { value: '5199e4', label: 'Azul', hex: '#5199e4' },
  { value: '25557c', label: 'Azul Marino', hex: '#25557c' },
  { value: '65c9ff', label: 'Celeste', hex: '#65c9ff' },
  { value: 'ff5c5c', label: 'Rojo', hex: '#ff5c5c' },
  { value: 'ffdeb5', label: 'Melocotón', hex: '#ffdeb5' },
  { value: 'ffafb9', label: 'Rosa', hex: '#ffafb9' },
  { value: 'ffffb1', label: 'Amarillo', hex: '#ffffb1' },
  { value: 'ff488e', label: 'Fucsia', hex: '#ff488e' },
  { value: 'a7ffc4', label: 'Menta', hex: '#a7ffc4' },
  { value: 'e6e6e6', label: 'Gris Claro', hex: '#e6e6e6' },
  { value: '929598', label: 'Gris Oscuro', hex: '#929598' },
  { value: '3c4f5c', label: 'Gris Pizarra', hex: '#3c4f5c' },
  { value: 'ffffff', label: 'Blanco', hex: '#ffffff' }
];

const ACCESSORIES_OPTIONS = [
  { value: 'none', label: 'Ninguno' },
  { value: 'kurt', label: 'Lentes Kurt' },
  { value: 'round', label: 'Lentes Redondos' },
  { value: 'sunglasses', label: 'Lentes de Sol' },
  { value: 'wayfarers', label: 'Wayfarers' },
  { value: 'eyepatch', label: 'Parche en Ojo' },
  { value: 'prescription01', label: 'Lentes Médicos 1' },
  { value: 'prescription02', label: 'Lentes Médicos 2' }
];

const EYEBROWS_OPTIONS = [
  { value: 'default', label: 'Normal' },
  { value: 'defaultNatural', label: 'Natural' },
  { value: 'angry', label: 'Enojado' },
  { value: 'angryNatural', label: 'Enojado Natural' },
  { value: 'flatNatural', label: 'Plano Natural' },
  { value: 'frownNatural', label: 'Fruncido Natural' },
  { value: 'raisedExcited', label: 'Sorprendido' },
  { value: 'raisedExcitedNatural', label: 'Sorprendido Natural' },
  { value: 'sadConcerned', label: 'Triste' },
  { value: 'sadConcernedNatural', label: 'Triste Natural' },
  { value: 'unibrowNatural', label: 'Unicejo' },
  { value: 'upDown', label: 'Arriba/Abajo' },
  { value: 'upDownNatural', label: 'Arriba/Abajo Natural' }
];

const FACIAL_HAIR_OPTIONS = [
  { value: 'none', label: 'Ninguno' },
  { value: 'beardLight', label: 'Barba Ligera' },
  { value: 'beardMedium', label: 'Barba Media' },
  { value: 'beardMajestic', label: 'Barba Poblada' },
  { value: 'moustacheFancy', label: 'Bigote Elegante' },
  { value: 'moustacheMagnum', label: 'Bigote Magnum' }
];

const CLOTHING_GRAPHIC_OPTIONS = [
  { value: 'pizza', label: 'Pizza' },
  { value: 'bat', label: 'Murciélago' },
  { value: 'bear', label: 'Oso' },
  { value: 'cumbia', label: 'Cumbia' },
  { value: 'deer', label: 'Ciervo' },
  { value: 'diamond', label: 'Diamante' },
  { value: 'hola', label: 'Hola' },
  { value: 'resist', label: 'Resistencia' },
  { value: 'skull', label: 'Calavera' },
  { value: 'skullOutline', label: 'Calavera Contorno' }
];

// Propiedades recibidas por el componente de registro
interface RegisterComponentProps {
  onSuccess: () => void; // Limpieza al finalizar con éxito
  onNavigateToLogin: () => void; // Volver al inicio de sesión
  setAlert: (alert: { type: 'success' | 'error' | 'info'; message: string } | null) => void; // Mostrar alertas
}

export default function RegisterComponent({
  onSuccess,
  onNavigateToLogin,
  setAlert
}: RegisterComponentProps) {
  // Pasos de registro: 1 (Datos Personales), 2 (Verificación de Correo), 3 (Avatar e Username)
  const [registerStep, setRegisterStep] = useState<number>(1);

  // Estados del Formulario de Registro
  const [regNombre, setRegNombre] = useState('');
  const [regApellido1, setRegApellido1] = useState('');
  const [regApellido2, setRegApellido2] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regAvatarSeed, setRegAvatarSeed] = useState('codepulse');
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Estados para verificación de correo en el registro
  const [registerCode, setRegisterCode] = useState('');
  const [generatedRegisterCode, setGeneratedRegisterCode] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Estados para mostrar/ocultar contraseñas
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Estados del creador de Avatar (Dicebear)
  const [avatarTop, setAvatarTop] = useState('shortFlat');
  const [avatarHairColor, setAvatarHairColor] = useState('2c1b18');
  const [avatarEyes, setAvatarEyes] = useState('default');
  const [avatarMouth, setAvatarMouth] = useState('smile');
  const [avatarSkinColor, setAvatarSkinColor] = useState('edb98a');
  const [avatarClothing, setAvatarClothing] = useState('hoodie');
  const [avatarClothesColor, setAvatarClothesColor] = useState('3c4f5c');
  const [avatarAccessories, setAvatarAccessories] = useState('none');
  const [avatarEyebrows, setAvatarEyebrows] = useState('default');
  const [avatarFacialHair, setAvatarFacialHair] = useState('none');
  const [avatarFacialHairColor, setAvatarFacialHairColor] = useState('2c1b18');
  const [avatarClothingGraphic, setAvatarClothingGraphic] = useState('pizza');
  const [avatarHatColor, setAvatarHatColor] = useState('262e33');
  const [customizerTab, setCustomizerTab] = useState<'pelo' | 'rostro' | 'ropa'>('pelo');

  // Efecto visual de cargando en el preview del avatar cuando cambia algún parámetro
  useEffect(() => {
    setAvatarLoading(true);
  }, [
    regAvatarSeed,
    avatarTop,
    avatarHairColor,
    avatarEyes,
    avatarMouth,
    avatarSkinColor,
    avatarClothing,
    avatarClothesColor,
    avatarAccessories,
    avatarEyebrows,
    avatarFacialHair,
    avatarFacialHairColor,
    avatarClothingGraphic,
    avatarHatColor
  ]);

  // Genera un avatar completamente aleatorio
  const randomizeCustomizer = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setRegAvatarSeed(randomSeed);
    
    const randomHair = HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)].value;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomEyes = EYE_OPTIONS[Math.floor(Math.random() * EYE_OPTIONS.length)].value;
    const randomMouth = MOUTH_OPTIONS[Math.floor(Math.random() * MOUTH_OPTIONS.length)].value;
    const randomSkinColor = SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)].value;
    const randomClothing = CLOTHING_OPTIONS[Math.floor(Math.random() * CLOTHING_OPTIONS.length)].value;
    const randomClothesColor = CLOTHES_COLORS[Math.floor(Math.random() * CLOTHES_COLORS.length)].value;
    const randomAccessories = ACCESSORIES_OPTIONS[Math.floor(Math.random() * ACCESSORIES_OPTIONS.length)].value;
    const randomEyebrows = EYEBROWS_OPTIONS[Math.floor(Math.random() * EYEBROWS_OPTIONS.length)].value;
    const randomFacialHair = FACIAL_HAIR_OPTIONS[Math.floor(Math.random() * FACIAL_HAIR_OPTIONS.length)].value;
    const randomFacialHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomClothingGraphic = CLOTHING_GRAPHIC_OPTIONS[Math.floor(Math.random() * CLOTHING_GRAPHIC_OPTIONS.length)].value;
    const randomHatColor = CLOTHES_COLORS[Math.floor(Math.random() * CLOTHES_COLORS.length)].value;

    setAvatarTop(randomHair);
    setAvatarHairColor(randomHairColor);
    setAvatarEyes(randomEyes);
    setAvatarMouth(randomMouth);
    setAvatarSkinColor(randomSkinColor);
    setAvatarClothing(randomClothing);
    setAvatarClothesColor(randomClothesColor);
    setAvatarAccessories(randomAccessories);
    setAvatarEyebrows(randomEyebrows);
    setAvatarFacialHair(randomFacialHair);
    setAvatarFacialHairColor(randomFacialHairColor);
    setAvatarClothingGraphic(randomClothingGraphic);
    setAvatarHatColor(randomHatColor);
  };

  // Manejo del Paso 1: Validación de Datos Personales
  const handleRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regNombre || !regApellido1 || !regCorreo || !regPassword || !regConfirmPassword) {
      setAlert({ type: 'error', message: 'Por favor, completa todos los campos requeridos.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regCorreo)) {
      setAlert({ type: 'error', message: 'Introduce una dirección de correo electrónico válida.' });
      return;
    }

    if (regPassword.length < 6) {
      setAlert({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden. Por favor, verifícalas.' });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedRegisterCode(code);
    setIsSending(true);
    setAlert({ type: 'info', message: 'Enviando código de verificación...' });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: regCorreo,
          subject: 'Verifica tu correo electrónico - CodePulse',
          title: 'Verificación de Correo',
          message: `¡Hola ${regNombre}! Gracias por registrarte en CodePulse Platform. Para completar tu registro, ingresa el siguiente código de verificación:`,
          code: code
        })
      });
      const result = await response.json();
      if (result.success) {
        if (result.simulated) {
          setAlert({
            type: 'info',
            message: `Código de verificación enviado (Simulado). Código: ${code}`
          });
        } else {
          setAlert({
            type: 'success',
            message: `Código de verificación enviado a tu correo electrónico.`
          });
        }
        setRegisterStep(2);
      } else {
        setAlert({
          type: 'error',
          message: `Error al enviar el correo: ${result.error || 'Inténtalo de nuevo'}. (Código simulado: ${code})`
        });
        setRegisterStep(2);
      }
    } catch (err: any) {
      console.error("Error sending register verification email:", err);
      setAlert({
        type: 'error',
        message: `No se pudo conectar con el servidor de correo. (Código simulado: ${code})`
      });
      setRegisterStep(2);
    } finally {
      setIsSending(false);
    }
  };

  // Paso 2: Verificar el código de registro ingresado por el usuario
  const handleRegisterStep2 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerCode) {
      setAlert({ type: 'error', message: 'Por favor, introduce el código de verificación.' });
      return;
    }

    if (registerCode === generatedRegisterCode) {
      setAlert({ type: 'success', message: 'Código verificado con éxito. Personaliza tu perfil.' });
      setRegisterStep(3);
    } else {
      setAlert({ type: 'error', message: 'El código de verificación es incorrecto. Inténtalo de nuevo.' });
    }
  };

  // Paso 2: Omitir verificación (Fallback)
  const handleRegisterStep2Skip = () => {
    setAlert({ type: 'info', message: 'Simulación: Correo verificado con éxito.' });
    setTimeout(() => {
      setRegisterStep(3);
      setAlert(null);
    }, 800);
  };

  // Paso 3: Finalizar el registro (Crear Avatar y Nombre de usuario)
  const handleRegisterStep3Finalize = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regUsername) {
      setAlert({ type: 'error', message: 'Por favor, introduce un nombre de usuario.' });
      return;
    }

    setAlert({ type: 'info', message: 'Creando cuenta...' });

    // Serialización de opciones de avatar para construir la URL de api.dicebear.com
    let serializedAvatarOptions = `seed=${encodeURIComponent(regAvatarSeed)}&top=${avatarTop}&hairColor=${avatarHairColor}&eyes=${avatarEyes}&mouth=${avatarMouth}&skinColor=${avatarSkinColor}&clothing=${avatarClothing}&clothesColor=${avatarClothesColor}`;
    
    if (avatarAccessories !== 'none') {
      serializedAvatarOptions += `&accessories=${avatarAccessories}&accessoriesProbability=100`;
    } else {
      serializedAvatarOptions += `&accessoriesProbability=0`;
    }
    
    serializedAvatarOptions += `&eyebrows=${avatarEyebrows}`;
    
    if (avatarFacialHair !== 'none') {
      serializedAvatarOptions += `&facialHair=${avatarFacialHair}&facialHairProbability=100&facialHairColor=${avatarFacialHairColor}`;
    } else {
      serializedAvatarOptions += `&facialHairProbability=0`;
    }
    
    serializedAvatarOptions += `&clothingGraphic=${avatarClothingGraphic}&hatColor=${avatarHatColor}`;

    const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?${serializedAvatarOptions}`;
    const avatarConfig = {
      seed: regAvatarSeed,
      top: avatarTop,
      hairColor: avatarHairColor,
      eyes: avatarEyes,
      mouth: avatarMouth,
      skinColor: avatarSkinColor,
      clothing: avatarClothing,
      clothesColor: avatarClothesColor,
      accessories: avatarAccessories,
      eyebrows: avatarEyebrows,
      facialHair: avatarFacialHair,
      facialHairColor: avatarFacialHairColor,
      clothingGraphic: avatarClothingGraphic,
      hatColor: avatarHatColor
    };

    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: regNombre,
          apellido1: regApellido1,
          apellido2: regApellido2 || undefined,
          correo: regCorreo,
          password: regPassword,
          username: regUsername,
          avatar_url: avatarUrl,
          avatar_style: 'avataaars',
          avatar_config: avatarConfig
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.detail || 'Error al registrar usuario.' });
        return;
      }

      setAlert({ type: 'success', message: '¡Registro finalizado con éxito! Redirigiéndote al inicio de sesión...' });

      // Finalización
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error de conexión con el servidor.' });
    }
  };

  // Construye la URL para visualizar la vista previa del avatar en tiempo real
  const getPreviewUrl = () => {
    let url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(regAvatarSeed)}`;
    url += `&top=${avatarTop}`;
    url += `&hairColor=${avatarHairColor}`;
    url += `&eyes=${avatarEyes}`;
    url += `&mouth=${avatarMouth}`;
    url += `&skinColor=${avatarSkinColor}`;
    url += `&clothing=${avatarClothing}`;
    url += `&clothesColor=${avatarClothesColor}`;
    if (avatarAccessories !== 'none') {
      url += `&accessories=${avatarAccessories}&accessoriesProbability=100`;
    } else {
      url += `&accessoriesProbability=0`;
    }
    url += `&eyebrows=${avatarEyebrows}`;
    if (avatarFacialHair !== 'none') {
      url += `&facialHair=${avatarFacialHair}&facialHairProbability=100&facialHairColor=${avatarFacialHairColor}`;
    } else {
      url += `&facialHairProbability=0`;
    }
    url += `&clothingGraphic=${avatarClothingGraphic}`;
    url += `&hatColor=${avatarHatColor}`;
    return url;
  };

  return (
    <>
      <h2 className="form-title">REGÍSTRATE</h2>

      {/* Indicador de Pasos (Stepper) */}
      <div className="stepper-container">
        <div className="stepper-line-bg" />
        <div 
          className="stepper-line-progress" 
          style={{ width: registerStep === 1 ? '0%' : registerStep === 2 ? '50%' : '100%' }} 
        />
        
        <div className={`step-node ${registerStep >= 1 ? (registerStep > 1 ? 'completed' : 'active') : ''}`}>
          {registerStep > 1 ? <Check size={14} /> : '1'}
        </div>
        <div className={`step-node ${registerStep >= 2 ? (registerStep > 2 ? 'completed' : 'active') : ''}`}>
          {registerStep > 2 ? <Check size={14} /> : '2'}
        </div>
        <div className={`step-node ${registerStep >= 3 ? 'active' : ''}`}>
          3
        </div>
      </div>

      {/* PASO 1: DATOS PERSONALES */}
      {registerStep === 1 && (
        <form onSubmit={handleRegisterStep1}>
          <div className="form-group">
            <label className="form-label">Nombre(s) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej. Juan Carlos"
              value={regNombre}
              onChange={(e) => setRegNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">Primer Apellido *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej. Pérez"
                value={regApellido1}
                onChange={(e) => setRegApellido1(e.target.value)}
                required
              />
            </div>
            <div className="form-group half-width">
              <label className="form-label">Segundo Apellido (Opcional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej. Gómez"
                value={regApellido2}
                onChange={(e) => setRegApellido2(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              className="form-input"
              placeholder="correo@ejemplo.com"
              value={regCorreo}
              onChange={(e) => setRegCorreo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña *</label>
            <div className="password-wrapper">
              <input
                type={showRegPassword ? "text" : "password"}
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowRegPassword(!showRegPassword)}
                aria-label={showRegPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Contraseña *</label>
            <div className="password-wrapper">
              <input
                type={showRegConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Repite tu contraseña"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                aria-label={showRegConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showRegConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isSending}>
            {isSending ? 'ENVIANDO...' : 'CONTINUAR'} <ArrowRight size={16} />
          </button>

          <div className="signup-prompt" style={{ marginBottom: 0 }}>
            ¿Ya tienes cuenta?{' '}
            <span className="signup-link" onClick={onNavigateToLogin}>
              Inicia sesión.
            </span>
          </div>
        </form>
      )}

      {/* PASO 2: VERIFICACIÓN DE CORREO */}
      {registerStep === 2 && (
        <form onSubmit={handleRegisterStep2}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#a066ff' }}>
            <Mail size={48} style={{ animation: 'pulse 2s infinite' }} />
          </div>
          
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff', textAlign: 'center' }}>
            Verifica tu correo electrónico
          </h3>
          
          <p style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem', textAlign: 'center' }}>
            Hemos enviado un código de verificación a la dirección <strong style={{ color: '#ffffff' }}>{regCorreo}</strong>.
            Ingrésalo abajo para continuar.
          </p>

          <div className="form-group">
            <label className="form-label">CÓDIGO DE VERIFICACIÓN (6 DÍGITOS) *</label>
            <input
              type="text"
              maxLength={6}
              className="form-input"
              placeholder="Ej. 123456"
              style={{ textAlign: 'center', letterSpacing: '0.25em', fontSize: '1.2rem', fontWeight: 'bold' }}
              value={registerCode}
              onChange={(e) => setRegisterCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            VERIFICAR CÓDIGO <ArrowRight size={16} />
          </button>

          <button 
            type="button" 
            onClick={handleRegisterStep2Skip} 
            className="btn-secondary"
            style={{ borderColor: '#6b7280', color: '#9ca3af' }}
          >
            OMITIR Y CONTINUAR (SIMULACIÓN)
          </button>

          <button 
            type="button"
            onClick={() => setRegisterStep(1)} 
            className="btn-secondary"
          >
            <ArrowLeft size={16} /> VOLVER AL PASO 1
          </button>
        </form>
      )}

      {/* PASO 3: USERNAME Y AVATAR */}
      {registerStep === 3 && (
        <form onSubmit={handleRegisterStep3Finalize}>
          <div className="form-group">
            <label className="form-label">Nombre de Usuario (Username) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej. dev_omega"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              required
            />
          </div>

          <div className="avatar-creator-container">
            <label className="form-label" style={{ alignSelf: 'flex-start', marginBottom: 0 }}>
              CREA TU AVATAR
            </label>

            <div className="avatar-preview-circle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={getPreviewUrl()} 
                alt="Avatar Preview" 
                onLoad={() => setAvatarLoading(false)}
              />
              {avatarLoading && (
                <div className="avatar-preview-loading">
                  <div className="spinner" />
                </div>
              )}
            </div>

            <div className="avatar-customizer">
              {/* Tabs para las distintas secciones de personalización */}
              <div className="customizer-tabs">
                <button
                  type="button"
                  className={`customizer-tab-btn ${customizerTab === 'pelo' ? 'active' : ''}`}
                  onClick={() => setCustomizerTab('pelo')}
                >
                  Cabello
                </button>
                <button
                  type="button"
                  className={`customizer-tab-btn ${customizerTab === 'rostro' ? 'active' : ''}`}
                  onClick={() => setCustomizerTab('rostro')}
                >
                  Rostro
                </button>
                <button
                  type="button"
                  className={`customizer-tab-btn ${customizerTab === 'ropa' ? 'active' : ''}`}
                  onClick={() => setCustomizerTab('ropa')}
                >
                  Estilo
                </button>
              </div>

              {/* Contenido de la pestaña Cabello */}
              {customizerTab === 'pelo' && (
                <div className="tab-content anim-fadeIn">
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Estilo de Cabello</label>
                    <select
                      className="form-input"
                      value={avatarTop}
                      onChange={(e) => setAvatarTop(e.target.value)}
                    >
                      {HAIR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Color de Cabello</label>
                    <div className="color-picker-grid">
                      {HAIR_COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          className={`color-circle-btn ${avatarHairColor === color.value ? 'active' : ''}`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setAvatarHairColor(color.value)}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Vello Facial (Barba/Bigote)</label>
                    <select
                      className="form-input"
                      value={avatarFacialHair}
                      onChange={(e) => setAvatarFacialHair(e.target.value)}
                    >
                      {FACIAL_HAIR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {avatarFacialHair !== 'none' && (
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label">Color de Vello Facial</label>
                      <div className="color-picker-grid">
                        {HAIR_COLORS.map(color => (
                          <button
                            key={color.value}
                            type="button"
                            className={`color-circle-btn ${avatarFacialHairColor === color.value ? 'active' : ''}`}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setAvatarFacialHairColor(color.value)}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contenido de la pestaña Rostro */}
              {customizerTab === 'rostro' && (
                <div className="tab-content anim-fadeIn">
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Ojos / Expresión</label>
                    <select
                      className="form-input"
                      value={avatarEyes}
                      onChange={(e) => setAvatarEyes(e.target.value)}
                    >
                      {EYE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Cejas</label>
                    <select
                      className="form-input"
                      value={avatarEyebrows}
                      onChange={(e) => setAvatarEyebrows(e.target.value)}
                    >
                      {EYEBROWS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Boca</label>
                    <select
                      className="form-input"
                      value={avatarMouth}
                      onChange={(e) => setAvatarMouth(e.target.value)}
                    >
                      {MOUTH_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label">Tono de Piel</label>
                    <div className="color-picker-grid">
                      {SKIN_COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          className={`color-circle-btn ${avatarSkinColor === color.value ? 'active' : ''}`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setAvatarSkinColor(color.value)}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contenido de la pestaña Ropa / Accesorios */}
              {customizerTab === 'ropa' && (
                <div className="tab-content anim-fadeIn">
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Vestimenta</label>
                    <select
                      className="form-input"
                      value={avatarClothing}
                      onChange={(e) => setAvatarClothing(e.target.value)}
                    >
                      {CLOTHING_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {avatarClothing === 'graphicShirt' && (
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Estampado de Ropa</label>
                      <select
                        className="form-input"
                        value={avatarClothingGraphic}
                        onChange={(e) => setAvatarClothingGraphic(e.target.value)}
                      >
                        {CLOTHING_GRAPHIC_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Accesorios / Lentes</label>
                    <select
                      className="form-input"
                      value={avatarAccessories}
                      onChange={(e) => setAvatarAccessories(e.target.value)}
                    >
                      {ACCESSORIES_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Color de Ropa</label>
                    <div className="color-picker-grid">
                      {CLOTHES_COLORS.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          className={`color-circle-btn ${avatarClothesColor === color.value ? 'active' : ''}`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setAvatarClothesColor(color.value)}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>

                  {['hat', 'winterHat1', 'winterHat02', 'turban', 'hijab'].includes(avatarTop) && (
                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                      <label className="form-label">Color de Sombrero/Gorro</label>
                      <div className="color-picker-grid">
                        {CLOTHES_COLORS.map(color => (
                          <button
                            key={color.value}
                            type="button"
                            className={`color-circle-btn ${avatarHatColor === color.value ? 'active' : ''}`}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setAvatarHatColor(color.value)}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modificación de la semilla base del avatar o randomizado */}
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.7rem', color: '#8b7ca0', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                    Semilla Base
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    style={{ padding: '0.6rem 0.85rem', fontSize: '0.8rem', width: '100%' }}
                    placeholder="Semilla base"
                    value={regAvatarSeed}
                    onChange={(e) => setRegAvatarSeed(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn-randomize"
                  style={{ height: '38px', width: '44px', marginTop: '1.1rem' }}
                  onClick={randomizeCustomizer}
                  title="Aleatorio Completo"
                >
                  <Dices size={18} />
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            FINALIZAR REGISTRO <Sparkles size={16} />
          </button>

          <button 
            type="button"
            onClick={() => setRegisterStep(2)} 
            className="btn-secondary"
          >
            <ArrowLeft size={16} /> VOLVER AL PASO 2
          </button>
        </form>
      )}
    </>
  );
}
