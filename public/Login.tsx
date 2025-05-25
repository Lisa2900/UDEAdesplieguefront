"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { IdCard, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

// 🛡️ Validación con Yup
const schema = yup.object().shape({
  matricula: yup.string().matches(/^\d+$/, "Solo números").length(8, "Debe tener 8 dígitos").required("La matrícula es obligatoria"),
  password: yup.string().min(6, "Debe tener al menos 6 caracteres").max(20, "Máximo 20 caracteres").matches(/^[a-zA-Z0-9]+$/, "Solo letras y números").required("La contraseña es obligatoria"),
});

function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  interface FormData {
    matricula: string;
    password: string;
  }

  const onSubmit = (data: FormData) => {
    console.log("Datos válidos:", data);
    router.push("/pageArea");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="font-[sans-serif] min-h-screen flex items-center justify-center bg-white">
      <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-6 m-4 shadow-lg rounded-md">
        
        {/* Formulario */}
        <div className="md:max-w-md w-full px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-12 flex items-center justify-between">
              <h3 className="text-gray-800 text-3xl font-extrabold text-center w-full">Inicio de sesión</h3>
              <Image src="/udeaLogo2.jpg" alt="Logo" width={80} height={80} className="ml-auto" />
            </div>

            {/* Matrícula */}
            <div>
              <label className="text-gray-800 text-base block mb-2">Matrícula:</label>
              <div className="relative flex items-center">
                <input {...register("matricula")} type="text" className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Ingresa tu matrícula" />
                <IdCard className="absolute right-2 text-gray-500" size={24} />
              </div>
              {errors.matricula && <p className="text-red-500 text-sm">{errors.matricula.message}</p>}
            </div>

            {/* Contraseña */}
            <div className="mt-8">
              <label className="text-gray-800 text-base block mb-2">Contraseña:</label>
              <div className="relative flex items-center">
                <input {...register("password")} type="password" className="w-full pr-8 text-gray-800 text-lg border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Ingresa tu contraseña" />
                <Lock className="absolute right-2 text-gray-500" size={24} />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Opciones adicionales */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">Recuérdame</label>
              </div>
              <div>
                <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            {/* Botón de acceso */}
            <div className="mt-12 flex justify-center">
              <button type="submit" className="w-full shadow-xl py-3 px-4 text-lg tracking-wide rounded-xl text-white bg-[#0048ac] hover:bg-[#03003f] focus:outline-none transition-all duration-300 transform hover:scale-105">Iniciar sesión</button>
            </div>

            <p className="text-sm mt-4 text-gray-800 text-center">
              ¿No tienes cuenta?
              <Link href="/registro" className="text-blue-600 font-semibold hover:underline ml-1">Regístrate aquí</Link>
            </p>
          </form>
        </div>

        {/* Carrusel de imágenes */}
        <div className="md:h-full bg-[#000842] rounded-xl lg:p-12 p-8">
          <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true }} autoplay={{ delay: 3000 }} className="w-full h-full">
            <SwiperSlide>
              <Image src="/home.jpg" width={400} height={400} alt="Imagen 1" className="w-full h-full object-contain" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/home.jpg" width={400} height={400} alt="Imagen 2" className="w-full h-full object-contain" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/home.jpg" width={400} height={400} alt="Imagen 3" className="w-full h-full object-contain" />
            </SwiperSlide>
          </Swiper> 
        </div>

      </div>
    </motion.div>
  );
}

export default LoginPage;
