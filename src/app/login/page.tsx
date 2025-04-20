"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "../(components)/Login/ForgotPassword";
import { SitemarkIcon } from "../(components)/Login/CostumIcon";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { Moon, Sun } from "lucide-react";
import { setIsDarkMode } from "@/state/index";
import Swal from "sweetalert2";
import { useLoginUsuarioMutation } from "@/state/api";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loginUsuario, { isLoading, isError, error }] =
    useLoginUsuarioMutation();

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // ✋ Previene que el formulario recargue la página al enviar
    event.preventDefault();

    // ✅ Validamos los inputs con una función aparte
    if (!validateInputs()) return;

    // 🧺 Obtenemos los datos del formulario usando FormData
    const data = new FormData(event.currentTarget);

    // Convertir los datos de FormData a un objeto JSON
    const formDataObject = {};
    data.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Ahora tienes un objeto de JavaScript, lo puedes enviar como JSON
    const { nombre_usuario, contrasena } = formDataObject;

    try {
      // 📡 Llamamos a la función que se conecta con el backend
      const result = await loginUsuario({ nombre_usuario, contrasena });
      if (result.error) {
        console.log(result.error);
      }
      // ✅ Si el backend responde que el login es correcto...
      if ("data" in result) {
        router.push("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Credenciales incorrectas",
          text: "Verifica tu usuario y contraseña.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Entendido",
        });
      }
    } catch (error) {
      // ⚠️ Si ocurre un error inesperado (como fallo de conexión)
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Ocurrió un error inesperado. Intenta de nuevo.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      });
    }
  };

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
      setPasswordErrorMessage(
        "La contraseña debe tener al menos 6 caracteres."
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };
  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <div className="relative min-h-screen flex items-center justify-center bg-[url('/login_background.jpg')] bg-cover bg-center bg-no-repeat text-black dark:bg-gray-900 dark:text-white transition-colors">
        {/* Botón modo oscuro */}
        <div
          className="absolute inset-0 z-0 bg-white/40"
          style={{
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.5)"
              : "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(5px)",
          }}
        />

        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 bg-black rounded-full p-2 transition-colors duration-300 hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="text-yellow-400" size={24} />
          ) : (
            <Moon className="text-blue-500" size={24} />
          )}
        </button>

        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          <div className="relative z-10 w-full max-w-md px-4">
            <Card
              variant="outlined"
              className="bg-white dark:bg-gray-700 border border-gray-700 dark:border-gray-700 p-8 rounded-lg shadow-md"
            >
              <SitemarkIcon />
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  width: "100%",
                  fontSize: "clamp(2rem, 10vw, 2.15rem)",
                  color: isDarkMode ? "dark" : "white",
                }}
              >
                Ingresar
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: 2,
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="email" className="dark:text-white">
                    Usuario
                  </FormLabel>
                  <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email" // Aquí sigue siendo el mismo id
                    name="nombre_usuario" // Cambié el nombre a "nombre_usuario"
                    placeholder="Nombre de usuario"
                    autoComplete="off" // Deshabilitar autocompletado si no lo deseas
                    required
                    fullWidth
                    variant="outlined"
                    color={emailError ? "error" : "primary"}
                    InputProps={{
                      sx: {
                        backgroundColor: isDarkMode ? "#9ba5b3" : "white",
                        color: isDarkMode ? "white" : "black",
                      },
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="password" className="dark:text-white">
                    Contraseña
                  </FormLabel>
                  <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? "error" : "primary"}
                    InputProps={{
                      sx: {
                        backgroundColor: isDarkMode ? "#9ba5b3" : "white",
                        color: isDarkMode ? "white" : "black",
                      },
                    }}
                  />
                </FormControl>

                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label={
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Recuerdame
                    </span>
                  }
                />

                <ForgotPassword open={open} handleClose={handleClose} />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Ingresar
                </Button>

                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{
                    alignSelf: "center",
                    color: "dark",
                  }}
                >
                  Olvidaste tu contraseña?
                </Link>
              </Box>
            </Card>
          </div>
        </SignInContainer>
      </div>
    </div>
  );
}
