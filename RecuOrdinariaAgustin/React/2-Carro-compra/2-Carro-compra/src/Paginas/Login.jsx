import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../estilos/login.css';


const Login = () => {

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [errores, setErrores] = useState({}); // Ej.1: guardamos aquí los mensajes de error

  //////////////////////////////////////
  // Función para gestionar los cambios en los campos del formulario
  //////////////////////////////////////
  const gestionarCambio = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

  };

  //////////////////////////////////////
  // Función de validación
  //////////////////////////////////////
const validar = () => {

  const fallos = []; // ej.1: aquí acumulamos cada requisito incumplido
  const { password } = form;

  if (isSignUp) {
    // ---- Validación de REGISTRO (crear cuenta) ----
    if (password.length < 12) {
      fallos.push("12 caracteres");
    }

    const mayusculas = password.match(/[A-Z]/g) || [];
    if (mayusculas.length < 2) {
      fallos.push("2 letras mayúscula");
    }

    const numeros = password.match(/[0-9]/g) || [];
    if (numeros.length < 2) {
      fallos.push("2 números");
    }

    const tieneEspecial = /[{}\-?+]/.test(password);
    if (!tieneEspecial) {
      fallos.push("1 carácter especial ( { } - ? + )");
    }
  } else {
    // ---- Validación de INICIO DE SESIÓN ----
    if (password.length < 8) {
      fallos.push("8 caracteres");
    }
  }

  if (fallos.length > 0) {
    // Todos los mensajes agrupados en un único texto
    setErrores({ password: "La contraseña debe tener " + fallos.join(" y ") });
    return false;
  }

  setErrores({}); // sin errores: limpiamos
  return true;

};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isSignUp) {
        result = await signUp(form.email, form.password);

        if (!result.error) {

          setIsSignUp(false);

          setForm({
            email: '',
            password: '',
          });

        }
      }

      else {
        result = await signIn(form.email, form.password);

        if (!result.error) {
          navigate('/');
        }
      }

      if (result.error) {
        setErrores({
          ...errores,
          submit: result.error.message,
        });
      }
    } catch (err) {

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>{isSignUp ? 'Registrarse' : 'Iniciar Sesión'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={gestionarCambio}
              required
              placeholder="tu@email.com"
            />

          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={gestionarCambio}
              required
              placeholder="••••••••"

            />

          </div>
          {/* Ej.1: mensaje de error agrupado de la contraseña */}
          {errores.password && (
            <p className="error-message">{errores.password}</p>
          )}

          {/* Error devuelto por Supabase (credenciales incorrectas, etc.) */}
          {errores.submit && (
            <p className="error-message">{errores.submit}</p>
          )}
          

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Cargando...' : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
            }}
            className="toggle-button"
          >

            {isSignUp
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;