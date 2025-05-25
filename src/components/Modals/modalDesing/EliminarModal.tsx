import React from "react";
import ModalDesign from "./ModalDesign";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalDesign title="Confirmar Eliminación" onClose={onClose}>
      <p className="text-center text-gray-700">¿Estás seguro de que quieres eliminar este elemento?</p>
      <div className="flex justify-center mt-4 gap-4">
        <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Eliminar
        </button>
            <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            Cancelar
            </button>
      </div>
    </ModalDesign>
  );
};

export default DeleteModal;
