"use client";
import { useState } from "react";
import Image from "next/image";
import EditModal from "../Modals/ProfileModal";
import FormEdit from "./FormEdit";

export default function EditProfile() {
  const [activeModal, setActiveModal] = useState<"editP" | null>(null);

  //const openModal = (modal: "editP") => setActiveModal(modal);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen p-6 flex bg-[#f0f0f0] items-center justify-center">
      <div className="w-full max-w-4xl rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna Izquierda - Perfil Actual */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <Image
                src="/udeaLogo2.jpg"
                alt="Perfil de usuario"
                width={220}
                height={220}
                className="rounded-full border border-gray-500"
              />
             
            </div>

            <div className="w-full space-y-4 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-[#b3b3b3] w-24">Nombre:</span>
                <span className="text-[#b3b3b3]">Jesús</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#b3b3b3]  w-24">Teléfono:</span>
                <span className="text-[#b3b3b3]">666-666-66-66</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#b3b3b3]  w-24">Correo:</span>
                <span className="text-[#b3b3b3]">example@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#b3b3b3]  w-24">Matrícula:</span>
                <span className="text-[#b3b3b3]">12345678</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#b3b3b3]  w-24">Carrera:</span>
                <span className="text-[#b3b3b3]">Estomatología</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Formulario de Edición */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-black text-center">
              Editar perfil
            </h1>
                <FormEdit/>   {/*formulario de edicion*/}
          </div>
        </div>
      </div>
      <EditModal isOpen={activeModal === "editP"} onClose={closeModal} />
    </div>
  );
}
