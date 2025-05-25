import React, { useState } from "react";
import ModalDesign from "./ModalDesign";
import { Lock, X, Save  } from "lucide-react";
interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: string) => void;
}

const AddMatricula: React.FC<AddModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim() !== "") {
      onAdd(newItem);
      setNewItem(""); // Limpiar el input después de agregar
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalDesign title="Agregar Matricula" onClose={onClose}>
      <div className="relative w-full">
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Lock size={20} />
        </span>
        <p className="text-center">Nombre</p>
        <input
          type="text"
          placeholder="Matricula"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full p-2 pr-10 border rounded-md"
        />
      </div>
      <div className="flex justify-center mt-4">
  {/* Botón Cancelar con ícono */}
  <button
    onClick={onClose}
    className="bg-gray-400 text-white px-4 py-2 mr-10 rounded-lg hover:bg-gray-500 relative flex items-center"
  >
    <span className="mr-2">
      <X size={20} />
    </span>
    Cancelar
  </button>

  {/* Botón Agregar con ícono */}
  <button
    onClick={handleAdd}
    className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-400 relative flex items-center"
  >
    <span className="mr-2">
      <Save size={20} />
    </span>
    Agregar
  </button>
</div>


    </ModalDesign>
  );
};

export default AddMatricula;
