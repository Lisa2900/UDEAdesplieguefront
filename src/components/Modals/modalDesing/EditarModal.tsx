import React from "react";
import ModalDesign from "./ModalDesign";


interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: string) => void;
  currentData: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, currentData }) => {
  const [newData, setNewData] = React.useState(currentData);

  const handleSave = () => {
    onSave(newData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalDesign title="Editar Información" onClose={onClose}>
      <input
        type="text"
        value={newData}
        onChange={(e) => setNewData(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <div className="flex justify-center mt-4">
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Guardar
        </button>

        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 ml-10 rounded-lg hover:bg-gray-500">
            Cancelar
            </button>
      </div>
    </ModalDesign>
  );
};

export default EditModal;
