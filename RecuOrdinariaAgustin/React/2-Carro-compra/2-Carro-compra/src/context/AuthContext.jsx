import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Swal from 'sweetalert2'                              // Ej.2: ventanas emergentes
import { toast } from 'react-toastify'                      // Ej.2: notificaciones toast
import LocalStorageServicio from '../servicios/storage/storage.js' // Ej.3: persistencia
// Crear un contexto de autenticación con un objeto vacío como valor inicial
// Este contexto permitirá compartir el estado de autenticación en toda la aplicación
const AuthContext = createContext({})


// ---- Ej.2: fecha en formato largo en español -> "26 de Mayo" ----
const formatearFechaLarga = (fecha) => {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]}`
}

const formatearFechaCompleta = (fecha) => {
  const dd = String(fecha.getDate()).padStart(2, "0")
  const mm = String(fecha.getMonth() + 1).padStart(2, "0")
  const yyyy = fecha.getFullYear()
  const hh = String(fecha.getHours()).padStart(2, "0")
  const min = String(fecha.getMinutes()).padStart(2, "0")
  const ss = String(fecha.getSeconds()).padStart(2, "0")
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`
}

// Hook personalizado para acceder fácilmente al contexto de autenticación
// Desde cualquier componente podremos usar: const { user, signIn, etc } = useAuth()
export const useAuth = () => useContext(AuthContext)

// Proveedor de autenticación que envolverá nuestra aplicación
// Recibe children (componentes hijos) como prop
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el usuario actual
  const [user, setUser] = useState(null)

  // Estado para indicar si estamos cargando la información de autenticación
  const [loading, setLoading] = useState(true)

  // Estado para almacenar la sesión completa (contiene metadata adicional además del usuario)
  const [session, setSession] = useState(null)

  // Efecto que se ejecuta una vez al montar el componente
  useEffect(() => {
    // 1. Verificar si hay una sesión activa al cargar la aplicación
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)           // Guardar la sesión completa
      setUser(session?.user ?? null) // Guardar el usuario o null si no hay sesión
      setLoading(false)             // Indicar que la carga inicial ha terminado
    })

    // 2. Suscribirse a cambios en el estado de autenticación
    // Esto escuchará eventos como: SIGNED_IN, SIGNED_OUT, USER_UPDATED, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false) // Asegurarse de que loading sea false después de cualquier cambio
    })

    // 3. Cleanup: cancelar la suscripción cuando el componente se desmonte
    return () => subscription.unsubscribe()
  }, []) // Array de dependencias vacío = se ejecuta solo al montar

// Función para iniciar sesión con email y contraseña
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Solo notificamos si el login ha sido correcto
  if (!error) {
    // Ej.3: recuperamos el ÚLTIMO acceso ANTES de sobreescribirlo
    const ultimoAcceso = LocalStorageServicio.get("administrador")

    // Ej.3: construimos la línea del último acceso
    let mensajeAcceso
    if (ultimoAcceso) {
      mensajeAcceso = `¡Hola! Tu último acceso fue: ${ultimoAcceso}`
    } else {
      mensajeAcceso = "¡Hola! Es tu primer acceso."
    }

    // Ej.2: fecha de hoy en formato largo
    const hoy = formatearFechaLarga(new Date())

    // Ej.2: ventana SweetAlert2 con saludo + fecha + último acceso (Ej.3)
    Swal.fire({
      title: "Hola, bienvenido de nuevo",
      text: `Hoy ${hoy}. ${mensajeAcceso}`,
      icon: "success",
    })

    // Ej.2: además, notificación tipo toast
    toast.success(`Hola, bienvenido de nuevo, hoy ${hoy}`)

    // Ej.3: guardamos AHORA el nuevo timestamp para la próxima vez
    const fechaCompleta = formatearFechaCompleta(new Date())
    LocalStorageServicio.set("administrador", fechaCompleta)
  }

  return { data, error } // Retornar datos y posible error para manejo en el componente
}

  // Función para registrar un nuevo usuario
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Nota: Se podrían agregar opciones adicionales aquí como:
      // options: { emailRedirectTo: 'https://ejemplo.com/welcome' }
    })

    
    return { data, error }
  }

// Función para cerrar sesión
const signOut = async () => {

  // Ej.2: mensaje de despedida con la fecha actual
  const hoy = formatearFechaLarga(new Date())

  Swal.fire({
    title: "Adiós",
    text: `Adiós, hasta pronto, hoy ${hoy}`,
    icon: "info",
  })

  toast.info(`Adiós, hasta pronto, hoy ${hoy}`)

  await supabase.auth.signOut()

  return true
}
  const value = {
    user,      
    session,  
    loading,   
    signIn,    
    signUp,    
    signOut,   
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
