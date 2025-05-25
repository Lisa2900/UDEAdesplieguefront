"use client";

//import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { toast } from "nextjs-toast-notify";
import "react-toastify/dist/ReactToastify.css";

// 🛡️ Validación con Yup
const schema = yup.object().shape({
  correo: yup
    .string()
    .email("Ingresa un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
  password: yup
    .string()
    .min(6, "Debe tener al menos 6 caracteres")
    .max(20, "Máximo 20 caracteres")
    .required("La contraseña es obligatoria"),
});

function AdminLogin() {
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: yupResolver(schema) });

  interface FormData {
    correo: string;
    password: string;
  }
  // 🚫 Redirige si ya hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = localStorage.getItem("userData");
      const role = userData ? JSON.parse(userData).role : null;

      toast.info("Primero debes cerrar sesión antes de continuar", {
        duration: 3500,
        position: "top-center",
      });

      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "superadmin") {
          window.location.href = "/SuperAdmin";
        } else {
          window.location.href = "/";
        }
      }, 1500);
    }
  }, []);

  const onSubmitAdmin = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const loginEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/administrador/login`;

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: data.correo,
          password: data.password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.cookieLogin && responseData.usuario) {
          const role = responseData.usuario.rol;

          // 1. Guardar token y datos en localStorage
          localStorage.setItem("authToken", responseData.cookieLogin);
          localStorage.setItem(
            "userData",
            JSON.stringify({
              email: responseData.usuario.correo,
              name: responseData.usuario.nombre,
              role: role,
            })
          );

          // 2. Mostrar toast de éxito
          toast.success("¡Inicio de sesión exitoso!", {
            duration: 3000,
            progress: true,
            position: "top-center",
          });

          // 3. Redirigir según el rol
          // Después de guardar el token y los datos del usuario en localStorage
          setTimeout(() => {
            if (role === "admin") {
              window.location.href = "/admin"; // Redirección a /admin
            } else if (role === "superadmin") {
              window.location.href = "/SuperAdmin"; // Redirección a /SuperAdmin
            } else {
              window.location.href = "/"; // Redirección a página de inicio si no tiene rol específico
            }
          }, 1000); // Asegurarse de que todo esté listo antes de redirigir
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } else {
        const errorData = await response.text();
        throw new Error(
          errorData || "Credenciales incorrectas. Intenta de nuevo."
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error de conexión. Intenta de nuevo más tarde.",
        {
          duration: 4000,
          progress: true,
          position: "top-center",
        }
      );

      setError("correo", {
        type: "manual",
        message: "Credenciales incorrectas",
      });
      setError("password", {
        type: "manual",
        message: "Credenciales incorrectas",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="font-[sans-serif] min-h-screen flex items-center justify-center "
    >
      <div className="grid md:grid-cols-2 items-center gap-0 max-w-6xl w-full mx-auto my-8 mt-[-180px] overflow-hidden rounded-2xl shadow-2xl bg-white">
        {/* Formulario */}
        <div className="w-full px-8 py-10 md:px-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/udeaLogo2.jpg"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-lg shadow-md"
              />
              <h3 className="text-gray-800 text-3xl font-bold">
                Bienvenido Admin
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitAdmin)} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                Inicio de sesión
              </h2>
              <p className="text-gray-500">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium block">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  {...register("correo")}
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-50 border ${
                    errors.correo
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="ejemplo@udea.edu.co"
                />
              </div>
              {errors.correo && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.correo.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-gray-700 font-medium block">
                  Contraseña
                </label>
                {/* <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  ¿Olvidaste tu contraseña?
                </Link> */}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-12 py-3 text-gray-800 bg-gray-50 border ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-blue-500"
                  } rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Botón de acceso */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </motion.button>
          </form>
        </div>

        {/* Carrusel de imágenes */}
        <div className="hidden md:block h-full bg-gradient-to-br from-blue-800 to-indigo-900 rounded-l-none rounded-r-2xl">
          <div className="h-full flex flex-col justify-center p-8">
            <div className="text-white mb-8 px-4">
              <h2 className="text-3xl font-bold mb-3">
                UDEA Biblioteca Virtual
              </h2>
              <p className="text-blue-100 text-lg">
                Accede a tu portal académico y gestiona tus estudios de manera
                eficiente.
              </p>
            </div>

            <Swiper
              modules={[Pagination, Autoplay, EffectFade]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              effect="fade"
              className="w-full h-[300px] rounded-xl overflow-hidden shadow-2xl"
            >
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/home.jpg"
                    fill
                    alt="Campus universitario"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/UdeaPrincipal.jpg"
                    fill
                    alt="Biblioteca"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <Image
                    src="/UdeaLogin.jpg"
                    fill
                    alt="Laboratorios"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminLogin;
