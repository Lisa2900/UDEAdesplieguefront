import React, { useState } from "react";
import ModalDesign from "./ModalDesign";
import { X, Save, Lock } from "lucide-react";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { nombreSemestre: string; fkIdArea: number }) => void;  // ✅ Cambiado
  fkIdArea: number;
}

const AgregaSemestres: React.FC<AddModalProps> = ({ isOpen, onClose, onAdd, fkIdArea }) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim() !== "") {
      onAdd({ nombreSemestre: newItem, fkIdArea });  // ✅ Enviar ambos valores
      setNewItem("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalDesign title="Agregar Semestre" onClose={onClose}>
      <div className="relative w-full">
      <span className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-400">
          <Lock size={20} />
        </span>
        <p className="text-center">Nombre del Semestre</p>
        <input
          type="text"
          placeholder="Nombre Semestre..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full p-2 pr-10 border rounded-md"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 mr-10 rounded-lg hover:bg-gray-500 flex items-center">
          <X size={20} className="mr-2" /> Cancelar
        </button>
        <button onClick={handleAdd} className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-400 flex items-center">
          <Save size={20} className="mr-2" /> Agregar
        </button>
      </div>
    </ModalDesign>
  );
};

export default AgregaSemestres;