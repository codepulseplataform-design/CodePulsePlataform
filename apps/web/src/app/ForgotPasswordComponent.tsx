'use client';

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, Check, Eye, EyeOff, Info } from 'lucide-react';
import { UserProfile } from './LoginComponent';

interface ForgotPasswordComponentProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  setAlert: (alert: { type: 'success' | 'error' | 'info'; message: string } | null) => void; // Disparar alertas
}

export default function ForgotPasswordComponent({
  onSuccess,
  onNavigateToLogin,
  setAlert
}: ForgotPasswordComponentProps) {
  // Pasos de recuperación: 1 (Ingreso Correo), 2 (Código de Verificación), 3 (Nueva Contraseña)
  const [forgotStep, setForgotStep] = useState<number>(1);


  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  const [isSending, setIsSending] = useState(false);


  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  // Paso 1: Validar correo y enviar código (aun no envia codigo)
  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail) {
      setAlert({ type: 'error', message: 'Por favor, introduce tu correo electrónico.' });
      return;
    }

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: forgotEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.detail || 'Ocurrió un error.' });
        return;
      }

      // El correo está (presumiblemente) registrado. Simulamos el envío de código.
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setIsSending(true);
      setAlert({ type: 'info', message: 'Enviando código de verificación...' });

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: forgotEmail,
          subject: 'Recuperación de contraseña - CodePulse',
          title: 'Recuperar Contraseña',
          message: 'Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para completar el proceso:',
          code: code
        })
      });
      const result = await response.json();
      if (result.success) {
        if (result.simulated) {
          setAlert({
            type: 'info',
            message: `Código enviado (Modo Simulación). Código: ${code}`
          });
        } else {
          setAlert({
            type: 'success',
            message: `Hemos enviado un correo electrónico con el código de verificación.`
          });
        }
        setForgotStep(2);
      } else {
        setAlert({
          type: 'error',
          message: `Error al enviar el correo: ${result.error || 'Inténtalo de nuevo'}. (Código simulado: ${code})`
        });
        setForgotStep(2);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error de conexión con el servidor.' });
    } finally {
      setIsSending(false);
    }
  };

  // Paso 2: Verificar el código ingresado por el usuario
  const handleForgotStep2 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotCode) {
      setAlert({ type: 'error', message: 'Por favor, introduce el código de verificación.' });
      return;
    }

    // Comprobar si el código coincide
    if (forgotCode === generatedCode) {
      setAlert({ type: 'success', message: 'Código verificado con éxito. Establece tu nueva contraseña.' });

      setForgotStep(3);
    } else {
      setAlert({ type: 'error', message: 'El código de verificación es incorrecto. Inténtalo de nuevo.' });
    }
  };

  // Paso 3: Guardar la nueva contraseña llamando al backend
  const handleForgotStep3 = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPassword || !forgotConfirmPassword) {
      setAlert({ type: 'error', message: 'Por favor, completa ambos campos de contraseña.' });
      return;
    }

    if (forgotPassword.length < 6) {
      setAlert({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    // Validación de coincidencia
    if (forgotPassword !== forgotConfirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden. Por favor, verifícalas.' });
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: forgotEmail,
          new_password: forgotPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.detail || 'Ocurrió un error al actualizar la contraseña.' });
        return;
      }

      setAlert({ type: 'success', message: 'Contraseña restablecida con éxito. Redirigiéndote al inicio de sesión...' });

      // Finalizar y regresar al Login
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error de conexión con el servidor.' });
    }
  };

  return (
    <>
      <h2 className="form-title" style={{ fontSize: '1.8rem' }}>RECUPERAR CONTRASEÑA</h2>

      {/* Indicador de pasos del flujo de recuperación */}
      <div className="stepper-container">
        <div className="stepper-line-bg" />
        <div
          className="stepper-line-progress"
          style={{ width: forgotStep === 1 ? '0%' : forgotStep === 2 ? '50%' : '100%' }}
        />

        <div className={`step-node ${forgotStep >= 1 ? (forgotStep > 1 ? 'completed' : 'active') : ''}`}>
          {forgotStep > 1 ? <Check size={14} /> : '1'}
        </div>
        <div className={`step-node ${forgotStep >= 2 ? (forgotStep > 2 ? 'completed' : 'active') : ''}`}>
          {forgotStep > 2 ? <Check size={14} /> : '2'}
        </div>
        <div className={`step-node ${forgotStep >= 3 ? 'active' : ''}`}>
          3
        </div>
      </div>

      {/* PASO 1: SOLICITAR CORREO ELECTRÓNICO */}
      {forgotStep === 1 && (
        <form onSubmit={handleForgotStep1}>
          <p style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Introduce tu dirección de correo electrónico registrada. Te enviaremos un código de verificación para restablecer tu contraseña.
          </p>

          <div className="form-group">
            <label className="form-label">CORREO ELECTRÓNICO *</label>
            <input
              type="email"
              className="form-input"
              placeholder="ejemplo@correo.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isSending}>
            {isSending ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'} <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onNavigateToLogin}
            className="btn-secondary"
          >
            <ArrowLeft size={16} /> VOLVER AL LOGIN
          </button>
        </form>
      )}

      {/* PASO 2: INTRODUCIR CÓDIGO DE VERIFICACIÓN */}
      {forgotStep === 2 && (
        <form onSubmit={handleForgotStep2}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#a066ff' }}>
            <Mail size={48} style={{ animation: 'pulse 2s infinite' }} />
          </div>

          <p style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem', textAlign: 'center' }}>
            Hemos enviado un código a <strong style={{ color: '#ffffff' }}>{forgotEmail}</strong>.
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
              value={forgotCode}
              onChange={(e) => setForgotCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            VERIFICAR CÓDIGO <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              setForgotStep(1);
              setAlert(null);
            }}
            className="btn-secondary"
          >
            <ArrowLeft size={16} /> CAMBIAR CORREO
          </button>
        </form>
      )}

      {/* PASO 3: ESTABLECER NUEVA CONTRASEÑA */}
      {forgotStep === 3 && (
        <form onSubmit={handleForgotStep3}>
          <p style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Crea una nueva contraseña segura para tu cuenta.
          </p>

          <div className="form-group">
            <label className="form-label">NUEVA CONTRASEÑA *</label>
            <div className="password-wrapper">
              <input
                type={showForgotNewPassword ? "text" : "password"}
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={forgotPassword}
                onChange={(e) => setForgotPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                aria-label={showForgotNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showForgotNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CONFIRMAR NUEVA CONTRASEÑA *</label>
            <div className="password-wrapper">
              <input
                type={showForgotConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Repite tu contraseña"
                value={forgotConfirmPassword}
                onChange={(e) => setForgotConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                aria-label={showForgotConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showForgotConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            RESTABLECER CONTRASEÑA <Check size={16} />
          </button>
        </form>
      )}
    </>
  );
}
