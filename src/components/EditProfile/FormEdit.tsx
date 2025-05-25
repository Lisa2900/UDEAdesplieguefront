"use client";
import { CircleX, Mail, Pencil, Phone, Save } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import { AlumnoEdit } from "@/types";
import { updateALumn } from "@/services/Alumn/EditAlumn";
import { toast } from "nextjs-toast-notify";

const initialValues  : AlumnoEdit= {
  nombre: "",
  telefono: "",
  correo: "",
};

export default function FormEdit() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });


  const handleForm = async (data : AlumnoEdit )=>{
        
        const response =  await updateALumn(data)
        
        if(response.ok){
            toast.success(response.message);
        }
        else{
            toast.error(response.message);
        }
  }

  return (
    <form className="space-y-6"
       noValidate
       onSubmit={handleSubmit(handleForm)}
    >
      <div className="space-y-2">
        <label className="text-sm text-black font-semibold">Nombre: </label>
        <div className="relative">
          <input
            type="text"
            id="nombre"
            placeholder="Nombre"
            className="w-full p-2 bg-[#f0f0f0] border border-[#d1d5db] text-black rounded-md pr-10"
            {...register("nombre", {
              required: "El nombre es  obligatorio",
            })}
          />
          {errors.nombre && (
            <ErrorMessage>{errors.nombre.message}</ErrorMessage>
          )}
          <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#343a40]" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-black font-semibold">Teléfono: </label>
        <div className="relative">
          <input
            type="tel"
            id="telefono"
            placeholder="Teléfono"
            className="w-full p-2 bg-[#f0f0f0] border border-[#d1d5db] text-black rounded-md pr-10"
            {...register("telefono", {
              required: "El número de teléfono es obligatorio",
              pattern: {
                value: /^[0-9]{10}$/, //  teléfono de 10 dígitos
                message: "Ingresa un número de teléfono válido de 10 dígitos",
              },
            })}
          />

          {errors.telefono && (
            <ErrorMessage>{errors.telefono.message}</ErrorMessage>
          )}

          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#343a40]" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-black font-semibold">
          Correo electrónico:{" "}
        </label>
        <div className="relative">
          <input
            id="correo"
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 bg-[#f0f0f0] border border-[#d1d5db] text-black rounded-md pr-10"
            {...register("correo", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //  validar correos
                message: "Ingresa un correo electrónico válido",
              },
            })}
          />

          {errors.correo && (
            <ErrorMessage>{errors.correo.message}</ErrorMessage>
          )}

          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#343a40]" />
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-white shadow-xl bg-[#0048ac] hover:bg-red-700">
          Cancelar
          <CircleX className="h-4 w-4 text-white" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg shadow-xl hover:bg-gray-300">
          Guardar
          <Save className="h-4 w-4 text-[#0048ac]" />
        </button>
      </div>
    </form>
  );
}
