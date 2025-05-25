"use client";

import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Search,
  UserPen,
  Trash2,
  CircleUserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const TableDesign = () => {
  interface Admin {
    nombre: string;
    telefono: string;
    correo: string;
  }

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]); // Lista filtrada
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Obtener administradores
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/administrador/getAllAdmins`
      );
      const adminsData = Array.isArray(res.data.admins) ? res.data.admins : [];
      setAdmins(adminsData);
      setFilteredAdmins(adminsData); // Inicializa la lista filtrada con todos los administradores
    } catch (error) {
      console.error("Error al obtener administradores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filtrar administradores por nombre, teléfono o correo
    const filtered = admins.filter(
      (admin) =>
        admin.nombre.toLowerCase().includes(value) ||
        admin.telefono.toLowerCase().includes(value) ||
        admin.correo.toLowerCase().includes(value)
    );
    setFilteredAdmins(filtered);
  };

  const handleUpdateUser = (email: string) => {
    router.push(`/SuperAdmin/users/editUser?email=${email}`);
  };

  const handleAddUser = () => {
    router.push("/SuperAdmin/users/addUser");
  };

  const handleDeleteUser = async (email: string) => {
    const confirm = window.confirm(`¿Estás seguro de eliminar al usuario?`);
    if (!confirm) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/administrador/deleteAdminByEmail/${email}`
      );
      setAdmins((prev) => prev.filter((admin) => admin.correo !== email)); // Eliminar del estado local
      setFilteredAdmins((prev) =>
        prev.filter((admin) => admin.correo !== email)
      ); // Actualizar la lista filtrada
      alert("Administrador eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar administrador", error);
      alert("Hubo un error al eliminar al administrador.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
      <p className="text-gray-900">
        Esta acción permitirá incorporar nuevos miembros al equipo académico de
        forma estructurada.
      </p>

      <div className="flex justify-between items-center mb-6 mt-12">
        <button
          className="bg-green-600 text-white px-5 py-3 text-lg rounded-xl flex items-center gap-2 hover:bg-green-800"
          onClick={handleAddUser}
        >
          <UserPlus size={24} />
          Agregar
        </button>

        <div className="relative w-72">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange} // Manejar el cambio en el campo de búsqueda
            className="w-full p-3 text-lg border rounded-md pr-12"
          />
          <Search
            size={24}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando administradores...</p>
      ) : (
        <>
          {/* Tabla para desktop */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="min-w-full bg-gray-50 border border-gray-200 rounded-md hidden sm:table">
              <thead className="bg-[#1e3a4c] text-white sticky top-0 z-10">
                <tr className="text-lg">
                  <th className="py-4 px-6 border-b text-left">Foto</th>
                  <th className="py-4 px-6 border-b text-left">Nombre</th>
                  <th className="py-4 px-6 border-b text-left">Teléfono</th>
                  <th className="py-4 px-6 border-b text-left">Correo</th>
                  <th className="py-4 px-6 border-b text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((persona, index) => (
                  <tr key={index} className="border-b hover:bg-gray-300">
                    <td className="py-4 px-6">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center">
                        <CircleUserRound size={90} />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-lg">
                      {persona?.nombre || "No disponible"}
                    </td>
                    <td className="py-4 px-6 text-lg">
                      {persona?.telefono || "No disponible"}
                    </td>
                    <td className="py-4 px-6 text-lg">
                      {persona?.correo || "No disponible"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <button
                          className="text-blue-500 hover:text-blue-800 transition"
                          onClick={() => handleUpdateUser(persona?.correo)}
                        >
                          <UserPen size={28} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition"
                          onClick={() => handleDeleteUser(persona?.correo)}
                        >
                          <Trash2 size={28} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil */}
          <div className="sm:hidden">
            {filteredAdmins.map((persona, index) => (
              <div
                key={index}
                className="mb-4 border bg-gray-200 p-4 rounded-md"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center">
                    <CircleUserRound size={60} />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold">
                      {persona?.nombre || "No disponible"}
                    </p>
                    <p>{persona?.telefono || "No disponible"}</p>
                    <p>{persona?.correo || "No disponible"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    className="text-blue-500 hover:text-blue-800 transition"
                    onClick={() => handleUpdateUser(persona?.correo)}
                  >
                    <UserPen size={28} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => handleDeleteUser(persona?.correo)}
                  >
                    <Trash2 size={28} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TableDesign;
