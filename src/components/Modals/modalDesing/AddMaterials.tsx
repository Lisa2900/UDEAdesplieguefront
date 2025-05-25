import React, { useState } from "react";
import ModalDesign from "./ModalDesign";
import { Lock, X, Save } from "lucide-react";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { nombreMateria: string; fkIdSemestre: number; fkIdArea: number }) => void;
  fkIdSemestre: number;
  fkIdArea: number;
}

const AddMaterials: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  fkIdSemestre,
  fkIdArea,
}) => {
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = async () => {
    if (isLoading || isAdded) {
      console.log("Solicitud ya está en curso o la materia ya fue agregada.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    if (!newItem.trim()) {
      setErrorMessage("El nombre del material es obligatorio.");
      setIsLoading(false);
      return;
    }

    if (!fkIdSemestre || fkIdSemestre <= 0) {
      setErrorMessage("El ID del semestre no es válido.");
      setIsLoading(false);
      return;
    }

    if (!fkIdArea || fkIdArea <= 0) {
      setErrorMessage("El ID del área no es válido.");
      setIsLoading(false);
      return;
    }

    try {
      // Solo pasamos los datos al padre, que hará la petición
      onAdd({
        nombreMateria: newItem,
        fkIdSemestre,
        fkIdArea,
      });

      setNewItem("");
      setIsAdded(true);
      onClose();
    } catch (error) {
      console.error("Error al agregar materia:", error);
      setErrorMessage("Hubo un error al procesar el material. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalDesign title="Agregar Materiales" onClose={onClose}>
      <div className="relative w-full">
        <span className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-400">
          <Lock size={20} />
        </span>
        <p className="text-center mb-1">Nombre</p>
        <input
          type="text"
          placeholder="Material"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full p-2 pr-10 border rounded-md"
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-center mt-2">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 mr-4 rounded-lg hover:bg-gray-500 flex items-center"
        >
          <X size={20} className="mr-2" />
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-400 flex items-center"
          disabled={isLoading || isAdded}
        >
          <Save size={20} className="mr-2" />
          {isLoading ? "Cargando..." : isAdded ? "Materia Agregada" : "Agregar"}
        </button>
      </div>
    </ModalDesign>
  );
};

export default AddMaterials;
