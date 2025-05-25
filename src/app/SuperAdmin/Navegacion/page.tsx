"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListaNavegacion from "@/components/NavigationList";
import AgregaCarrera from "../../../components/Modals/modalDesing/AgregaCarrera";
import AgregaSemestres from "../../../components/Modals/modalDesing/AgregaSemestres";
import AgregaMateria from "../../../components/Modals/modalDesing/AddMaterials";
import axios from "axios";
import Swal from "sweetalert2";

type Materia = { id: number; nombre: string };
type Semestre = { id: number; nombre: string; materias: Materia[] };
type Carrera = {
  id: number;
  nombreArea: string;
  idArea: number;
  semestres?: Semestre[];
};

const Navigation: React.FC = () => {
  const router = useRouter();
  const [nivel, setNivel] = useState<"carreras" | "semestres" | "materias">(
    "carreras"
  );
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [semestre, setSemestre] = useState<Semestre | null>(null);
  const [modalAbierto, setModalAbierto] = useState<
    "carrera" | "semestre" | "materia" | null
  >(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);

  // ✅ Obtener áreas (carreras)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/area/`
        );

        // Normalizamos los datos para asegurarnos de que tengan `idArea`
        const areasFormateadas: Carrera[] = response.data.map(
          (area: {
            id: number;
            nombre: string;
            idArea?: number;
            nombreArea?: string;
          }) => ({
            ...area,
            idArea: area.idArea ?? area.id,
            id: area.idArea ?? area.id,
            nombreArea: area.nombreArea ?? area.nombre,
          })
        );

        setCarreras(areasFormateadas);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  // ✅ Obtener semestres al seleccionar carrera
  useEffect(() => {
    const fetchSemestres = async () => {
      if (carrera && carrera.idArea) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/semestre/?fkIdArea=${carrera.idArea}`
          );

          setCarrera((prevCarrera) => ({
            ...prevCarrera!,
            semestres: response.data.map(
              (semestre: {
                idSemestre: number;
                nombreSemestre: string;
                materias: { id: number; nombreMateria: string }[];
              }) => ({
                id: semestre.idSemestre,
                nombre: semestre.nombreSemestre,
                materias: semestre.materias.map((materia) => ({
                  id: materia.id,
                  nombre: materia.nombreMateria,
                })),
              })
            ),
          }));
        } catch (error) {
          console.error("Error al obtener semestres:", error);
        }
      } else {
        console.error("ID de área no válido:", carrera?.idArea);
      }
    };

    if (carrera) {
      fetchSemestres();
    }
  }, [carrera]);

  // ✅ Agregar carrera
  const agregarCarrera = async ({ nombreArea }: { nombreArea: string }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/area/createArea`,
        {
          nombreArea,
        }
      );
      const nuevaCarrera = {
        ...response.data.area,
        idArea: response.data.area.idArea ?? response.data.area.id,
        id: response.data.area.idArea ?? response.data.area.id,
      };
      setCarreras([...carreras, nuevaCarrera]);

      Swal.fire({
        icon: "success",
        title: "Área registrada",
        text: `Se registró el área "${nombreArea}" correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al agregar carrera:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: "No se pudo registrar el área. Inténtalo nuevamente.",
      });
    }
  };

  // ✅ Agregar semestre
  const agregarSemestre = async ({
    nombreSemestre,
    fkIdArea,
  }: {
    nombreSemestre: string;
    fkIdArea: number;
  }) => {
    if (!carrera) return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/semestre/`,
        {
          nombreSemestre,
          fkIdArea,
        }
      );

      const nuevoSemestre: Semestre = response.data;
      setCarrera((prevCarrera) => {
        if (!prevCarrera) return prevCarrera;
        const nuevosSemestres = [
          ...(prevCarrera.semestres || []),
          nuevoSemestre,
        ];
        return { ...prevCarrera, semestres: nuevosSemestres };
      });
    } catch (error) {
      console.error("Error al agregar semestre:", error);
    }
  };

  const seleccionarCarrera = (c: Carrera) => {
    setCarrera(c);
    setNivel("semestres");
  };

  const seleccionarSemestre = (s: Semestre) => {
    console.log("Semestre seleccionado:", s);

    if (!s.id) {
      console.error("El semestre seleccionado no tiene un ID válido.");
      return;
    }
    setSemestre(s);
    setNivel("materias");
  };
  const seleccionarMateria = () => {
    router.push("/SuperAdmin/books");
  };

  const volverAtras = () => {
    if (nivel === "materias") setNivel("semestres");
    else if (nivel === "semestres") setNivel("carreras");
  };

  return (
    <>
      {nivel === "carreras" && (
        <ListaNavegacion
          titulo="Area"
          items={carreras.map((c) => ({
            id: c.idArea,
            nombre: c.nombreArea,
          }))}
          onSelect={(item) =>
            seleccionarCarrera({
              id: item.id,
              idArea: item.id,
              nombreArea: item.nombre,
              semestres: [],
            })
          }
          onAgregar={() => setModalAbierto("carrera")}
        />
      )}

      {nivel === "semestres" && carrera && (
        <ListaNavegacion
          titulo={`Semestres - ${carrera.nombreArea}`}
          items={carrera.semestres || []}
          onSelect={seleccionarSemestre}
          onBack={volverAtras}
          onAgregar={() => setModalAbierto("semestre")}
        />
      )}

      {/* console.log("Materias enviadas a ListaNavegacion:" items, semestre.materias) */}
      {nivel === "materias" && semestre && (
        <>
          <ListaNavegacion
            titulo={`Materias - ${semestre.nombre}`}
            items={semestre.materias}
            onSelect={seleccionarMateria}
            onBack={volverAtras}
            onAgregar={() => setModalAbierto("materia")}
          />
        </>
      )}

      {modalAbierto === "carrera" && (
        <AgregaCarrera
          isOpen
          onClose={() => setModalAbierto(null)}
          onAdd={agregarCarrera}
        />
      )}

      {modalAbierto === "semestre" && carrera && (
        <AgregaSemestres
          isOpen
          onClose={() => setModalAbierto(null)}
          onAdd={agregarSemestre}
          fkIdArea={carrera.idArea} // ✅ Pasar el ID del área
        />
      )}

      {/* Nos quedamos aqui xd*/}
      {modalAbierto === "materia" && semestre && semestre.id && carrera && (
        <AgregaMateria
          isOpen
          onClose={() => setModalAbierto(null)}
          onAdd={async ({ nombreMateria, fkIdSemestre, fkIdArea }) => {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/materias`,
                {
                  nombreMateria,
                  fkIdSemestre,
                  fkIdArea,
                }
              );

              const nuevaMateria = {
                id: response.data.idMateria || response.data.id,
                nombre: response.data.nombreMateria || response.data.nombre,
              };

              // Actualizar el estado del semestre y renderizar correctamente
              setSemestre((prevSemestre) => {
                if (!prevSemestre) return prevSemestre;
                const nuevasMaterias = [
                  ...(prevSemestre.materias || []),
                  nuevaMateria,
                ];
                return { ...prevSemestre, materias: nuevasMaterias };
              });
            } catch (error) {
              console.error("Error al agregar materia:", error);
            }
          }}
          fkIdSemestre={semestre.id}
          fkIdArea={carrera.idArea}
        />
      )}
    </>
  );
};

export default Navigation;
