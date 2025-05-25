"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Phone, Mail, Lock, Save, Trash2, Edit } from "lucide-react";
import { toast } from "nextjs-toast-notify";

const EditarUsuario: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);

  const [admin, setAdmin] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    telefono: "",
  });

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "nombre":
        return !value.trim() ? "El nombre es obligatorio." : "";
      case "telefono":
        if (!value.trim()) return "El teléfono es obligatorio.";
        if (value.length !== 10 || !/^\d+$/.test(value))
          return "El teléfono debe tener exactamente 10 dígitos numéricos.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });

    // Validar el campo cuando cambia
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      nombre: validateField("nombre", admin.nombre),
      telefono: validateField("telefono", admin.telefono),
    };

    setErrors(newErrors);
    return !newErrors.nombre && !newErrors.telefono;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor, rellena los campos del formulario.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/administrador/updateAdminByEmail/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: admin.nombre,
            telefono: admin.telefono,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al actualizar administrador"
        );
      }

      toast.success("Administrador actualizado correctamente");
      router.push("/SuperAdmin/users");
    } catch (error) {
      console.error("Error al actualizar", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar administrador"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!email) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/administrador/getAdminByEmail/${email}`
        );

        if (!response.ok) {
          throw new Error(
            "No se pudo obtener la información del administrador"
          );
        }

        const data = await response.json();
        console.log("Datos obtenidos del backend:", data);

        if (data) {
          setAdmin({
            nombre: data.nombre || "",
            telefono: data.telefono || "",
            correo: data.correo || "",
            password: data.password || "********",
          });
        } else {
          console.error("No se encontró el administrador");
          toast.error("No se encontró la información del administrador");
        }
      } catch (error) {
        console.error("Error al obtener administrador", error);
        toast.error("Error al cargar los datos del administrador");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [email]);

  if (loading && !admin.nombre && !admin.telefono) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 min-h-screen p-5">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Ícono de usuario */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          <div className="group relative">
            <div className="w-80 h-80 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-500" size={120} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Edit className="text-white mb-2" size={40} />
              <span className="text-white text-sm font-semibold">
                Editar perfil
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-gray-800 text-2xl font-bold">Editar usuario</h1>
          </div>

          {/* Nombre */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre
            </label>
            <div className="flex items-center">
              <User className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                name="nombre"
                value={admin.nombre}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-blue-500`}
              />
            </div>
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1 ml-7">{errors.nombre}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Teléfono
            </label>
            <div className="flex items-center">
              <Phone className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                name="telefono"
                value={admin.telefono}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.telefono ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-blue-500`}
              />
            </div>
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1 ml-7">
                {errors.telefono}
              </p>
            )}
          </div>

          {/* Correo */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Correo electrónico
            </label>
            <div className="flex items-center">
              <Mail className="text-gray-500 mr-2" size={20} />
              <input
                type="email"
                value={admin.correo}
                disabled
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <div className="flex items-center">
              <Lock className="text-gray-500 mr-2" size={20} />
              <input
                type="password"
                value={admin.password}
                disabled
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push("/SuperAdmin/users")}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base"
              disabled={loading}
            >
              <Trash2 className="mr-2" size={20} />
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              className={`flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <Save className="mr-2" size={20} />
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarUsuario;
