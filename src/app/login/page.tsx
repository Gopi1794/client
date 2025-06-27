"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setIsDarkMode } from "@/state/index";
import { useLoginUsuarioMutation } from "@/state/api";
import Swal from "sweetalert2";
import { GuardSpinner } from "react-spinners-kit";
import ForgotPassword from "../(components)/Login/ForgotPassword";
import { SitemarkIcon } from "../(components)/Login/CostumIcon";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const router = useRouter();
  const [loginUsuario] = useLoginUsuarioMutation();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleDarkMode = () => dispatch(setIsDarkMode(!isDarkMode));

  const validateInputs = () => {
    const nombre_usuario = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!nombre_usuario.value || nombre_usuario.value.trim() === "") {
      setEmailError(true);
      setEmailErrorMessage("Por favor, introduce un nombre de usuario válido");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const nombre_usuario = (data.get("nombre_usuario") as string) || "";
    const contrasena = (data.get("password") as string) || "";

    try {
      setIsLoading(true);
      const result = await loginUsuario({
        nombre_usuario,
        contrasena,
      }).unwrap();
      console.log("Login exitoso:", result);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Verifica tu usuario y contraseña.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="text-center">
          <GuardSpinner size={60} color="#3b82f6" loading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-gray-500"
      }`}
    >
      {/* Fondo con efecto glassmorphism */}
      <div className="absolute inset-0 bg-[url('/login_background.jpg')] bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-20" />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-black/30" />

      {/* Botón modo oscuro */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-300 z-10 ${
          isDarkMode
            ? "bg-gray-700 hover:bg-gray-600 text-yellow-300"
            : "bg-white hover:bg-gray-100 text-blue-600 shadow-md"
        }`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      {/* Tarjeta de login */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div
          className={`p-8 rounded-2xl shadow-xl transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex justify-center mb-6"></div>
          <SitemarkIcon />
          <h1
            className={`text-3xl font-bold text-center mb-8 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Iniciar Sesión
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Usuario */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Usuario
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <User size={18} />
                </div>
                <input
                  id="email"
                  name="nombre_usuario"
                  type="text"
                  autoComplete="username"
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    emailError
                      ? "border-red-500 focus:ring-red-500"
                      : isDarkMode
                      ? "border-gray-700 focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                  } focus:ring-2 focus:outline-none transition-all duration-200`}
                  placeholder="Nombre de usuario"
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailErrorMessage}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Contraseña
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500"
                      : isDarkMode
                      ? "border-gray-700 focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900"
                  } focus:ring-2 focus:outline-none transition-all duration-200`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">
                  {passwordErrorMessage}
                </p>
              )}
            </div>

            {/* Opciones adicionales */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className={`rounded ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600"
                      : "bg-white border-gray-300 text-blue-500 focus:ring-blue-500"
                  }`}
                />
                <span
                  className={`ml-2 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Recuérdame
                </span>
              </label>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className={`text-sm font-medium ${
                  isDarkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-500"
                }`}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modal de recuperación de contraseña */}
      <ForgotPassword open={open} handleClose={() => setOpen(false)} />
    </div>
  );
}
