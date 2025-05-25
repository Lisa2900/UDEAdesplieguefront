"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "nextjs-toast-notify";
import { User, Save, Trash2 } from "lucide-react";

const AddUser: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<{ id: number; nombreArea: string }[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    carrera: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    carrera: "",
  });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/area`);
        const data = await response.json();
        setAreas(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, carrera: data[0].nombreArea }));
        }
      } catch (error) {
        console.error("Error al cargar áreas:", error);
        toast.error("Error al cargar las áreas.");
      }
    };

    fetchAreas();
  }, []);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "nombre":
        return !value.trim() ? "El nombre es obligatorio." : "";
      case "telefono":
        if (!value.trim()) return "El teléfono es obligatorio.";
        if (value.length !== 10 || !/^\d+$/.test(value))
          return "El teléfono debe tener exactamente 10 dígitos numéricos.";
        return "";
      case "email":
        if (!value.trim()) return "El correo es obligatorio.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "El correo no es válido.";
        return "";
      case "password":
        if (!value.trim()) return "La contraseña es obligatoria.";
        if (value.length < 6)
          return "La contraseña debe tener al menos 6 caracteres.";
        return "";
      case "carrera":
        return !value.trim() ? "La carrera es obligatoria." : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar el campo cuando cambia
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validar todos los campos
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData];
      const errorMessage = validateField(key, value);
      newErrors[key as keyof typeof errors] = errorMessage;
      if (errorMessage) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todo el formulario antes de enviar
    if (!validateForm()) {
      toast.error(
        "Por favor, rellena los campos del formulario correctamente."
      );
      return;
    }

    const { nombre, telefono, email, password, carrera } = formData;
    const areaSeleccionada = areas.find((area) => area.nombreArea === carrera);
    const areaId = areaSeleccionada ? areaSeleccionada.id : null;

    const requestData = {
      nombre,
      telefono,
      correo: email,
      password,
      area: areaId,
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/administrador/createAdmin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const errorMsg =
          data?.errors?.[0]?.msg || data?.msg || "Error al registrar.";
        toast.error(errorMsg);
        return;
      }

      toast.success("¡Registro exitoso!");
      router.push("/SuperAdmin/users");
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error de conexión al registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen p-5">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Ícono de usuario */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          <div className="group relative">
            <div className="w-80 h-80 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="text-gray-500" size={120} />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-gray-800 text-2xl font-bold">
              Agregar nuevo usuario
            </h1>
          </div>

          {/* Nombre */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del usuario"
              className={`w-full p-2 border ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-blue-500`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Área */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Área
            </label>
            <select
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.carrera ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-blue-500`}
            >
              {areas.map((area) => (
                <option key={area.id} value={area.nombreArea}>
                  {area.nombreArea}
                </option>
              ))}
            </select>
            {errors.carrera && (
              <p className="text-red-500 text-sm mt-1">{errors.carrera}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Número telefónico"
              className={`w-full p-2 border ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-blue-500`}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className={`w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className={`w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:border-blue-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base"
              onClick={() => router.push("/SuperAdmin/users")}
              disabled={loading}
            >
              <Trash2 className="mr-2" size={20} />
              Cancelar
            </button>

            <button
              type="submit"
              className={`flex items-center bg-blue-500 text-white px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              <Save className="mr-2" size={20} />
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
