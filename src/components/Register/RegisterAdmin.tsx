"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { User, Mail, Lock, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import axios from "axios";

const areaMap: { [key: string]: number } = {
  "Estomatología": 11,
  "Fisioterapia": 2,
  "Enfermería": 3,
  "Nutrición": 4,
};

function RegisterAdmin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    carrera: "Estomatología",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { nombre, telefono, email, password, carrera } = formData;

    if (!nombre || !telefono || !email || !password) {
      toast.error("¡Necesitas llenar todos los campos!");
      return;
    }

    const requestData = {
      nombre,
      telefono,
      correo: email,
      password,
      area: areaMap[carrera] || 1, // Convertimos carrera a área ID
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/administrador/createAdmin` , requestData);
      toast.success("¡Registro exitoso!");
      router.push("/LoginAdmin");
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) && error.response?.data?.errors?.[0]?.msg 
        ? error.response.data.errors[0].msg 
        : "Error al registrar.";
      toast.error(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="font-[sans-serif] min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full p-6 m-4 shadow-lg rounded-md">
        {/* Formulario */}
        <div className="md:max-w-md w-full px-6 py-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-12 flex items-center justify-between">
              <h3 className="text-gray-800 text-3xl font-extrabold text-center w-full">
                Registro
              </h3>
              <Image src="/udeaLogo2.jpg" alt="Logo" width={80} height={80} className="ml-auto" />
            </div>

            {/* Nombre */}
            <label className="block mb-2 text-gray-800">Nombre completo:</label>
            <div className="relative mb-6">
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border-b px-2 py-3 text-lg outline-none"
                placeholder="Nombre completo"
              />
              <User className="absolute right-2 top-3 text-gray-500" />
            </div>

            {/* Teléfono */}
            <label className="block mb-2 text-gray-800">Teléfono:</label>
            <div className="relative mb-6">
              <input
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border-b px-2 py-3 text-lg outline-none"
                placeholder="Teléfono (10 dígitos)"
              />
              <Phone className="absolute right-2 top-3 text-gray-500" />
            </div>

            {/* Correo */}
            <label className="block mb-2 text-gray-800">Correo electrónico:</label>
            <div className="relative mb-6">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b px-2 py-3 text-lg outline-none"
                placeholder="Correo"
              />
              <Mail className="absolute right-2 top-3 text-gray-500" />
            </div>

            {/* Contraseña */}
            <label className="block mb-2 text-gray-800">Contraseña:</label>
            <div className="relative mb-6">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b px-2 py-3 text-lg outline-none"
                placeholder="Contraseña"
              />
              <Lock className="absolute right-2 top-3 text-gray-500" />
            </div>

            {/* Área */}
            <label className="block mb-2 text-gray-800">Área:</label>
            <div className="relative mb-6">
              <select
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg bg-white"
              >
                <option value="Estomatología">Estomatología</option>
                <option value="Fisioterapia">Fisioterapia</option>
                <option value="Enfermería">Enfermería</option>
                <option value="Nutrición">Nutrición</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-8 py-3 rounded-xl text-white bg-[#0048ac] hover:bg-[#03003f] transition-all"
            >
              Registrarse
            </button>
          </form>
        </div>

        {/* Imagen */}
        <div className="md:h-full rounded-xl lg:p-12 p-8 relative w-full h-[400px]">
          <Image
            src="/UdeaLogin.jpg"
            alt="login-image"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default RegisterAdmin;
