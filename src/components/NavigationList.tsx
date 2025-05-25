"use client";

import React from "react";
import { Plus, ChevronRight, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

/* Usamos un tipo genérico <T> para hacer que ListaNavegacion sea más flexible y escalable.
 En lugar de restringirnos a un solo tipo (Item), permitimos que cualquier tipo con { id, nombre } sea válido.
 Esto evita la necesidad de transformar manualmente los datos antes de pasarlos como items, 
 reduciendo la sobrecarga y mejorando la reutilización del componente.*/

type ListaNavegacionProps<T extends { id: number; nombre: string }> = {
  titulo: string;
  items: T[];
  onSelect: (item: T) => void;
  onBack?: () => void;
  onAgregar: () => void;
};

const ListaNavegacion = <T extends { id: number; nombre: string }>({
  titulo,
  items,
  onSelect,
  onBack,
  onAgregar,
}: ListaNavegacionProps<T>) => {
  const pathname = usePathname();

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">{titulo}</h1>
        {onBack && (
          <button onClick={onBack} className="text-2xl text-black">
            <ArrowLeft />
          </button>
        )}
      </div>

      {pathname === "/SuperAdmin/Navegacion" && (
        <button
          onClick={onAgregar}
          className="bg-green-500 text-white flex items-center px-4 py-2 rounded-full mb-4 shadow-md"
        >
          <Plus className="mr-2" size={20} /> Agregar
        </button>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <button
            key={`item-${item.id !== undefined ? item.id : index}`}  // Usa el id o el índice si el id es undefined
            onClick={() => onSelect(item)}
            className="w-full text-left border border-gray-400 rounded-lg p-4 bg-white flex justify-between items-center shadow-sm"
          >
            <span className="text-lg">{item.nombre}</span>
            <ChevronRight className="text-blue-700" size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListaNavegacion;
