"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListaNavegacion from "@/components/NavigationList";

type Materia = { id: number; nombre: string };
type Semestre = { id: number; nombre: string; materias: Materia[] };
type Carrera = { id: number; nombreArea: string; idArea: number; semestres?: Semestre[] };

const Navigation: React.FC = () => {
  const router = useRouter();
  const [nivel, setNivel] = useState<"carreras" | "semestres" | "materias">("carreras");
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrera, setCarrera] = useState<Carrera | null>(null);
  const [semestre, setSemestre] = useState<Semestre | null>(null);

  // Obtener áreas (carreras)
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/area/`);
        const data = await res.json();
        const areasFormateadas: Carrera[] = data.map((area: { id: number; nombre: string; idArea?: number; nombreArea?: string }) => ({
          ...area,
          idArea: area.idArea ?? area.id,
          id: area.idArea ?? area.id,
          nombreArea: area.nombreArea ?? area.nombre,
        }));
        setCarreras(areasFormateadas);
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Obtener semestres al seleccionar carrera
  useEffect(() => {
    const fetchSemestres = async () => {
      if (carrera && carrera.idArea) {
        try {
          const res = await fetch(`http://localhost:4000/api/semestre/?fkIdArea=${carrera.idArea}`);
          const data = await res.json();
          setCarrera((prevCarrera) => ({
            ...prevCarrera!,
            semestres: data.map((semestre: { idSemestre: number; nombreSemestre: string; materias: { id: number; nombreMateria: string }[] }) => ({
              id: semestre.idSemestre,
              nombre: semestre.nombreSemestre,
              materias: semestre.materias.map((materia) => ({
                id: materia.id,
                nombre: materia.nombreMateria,
              })),
            })),
          }));
        } catch (error) {
          console.error("Error al obtener semestres:", error);
        }
      }
    };

    if (carrera) {
      fetchSemestres();
    }
  }, [carrera]);

  const seleccionarCarrera = (c: Carrera) => {
    setCarrera(c);
    setNivel("semestres");
  };

  const seleccionarSemestre = (s: Semestre) => {
    setSemestre(s);
    setNivel("materias");
  };

  const seleccionarMateria = (materia: Materia) => {
    console.log("Materia seleccionada:", materia);
    router.push("/admin/books");
  };

  const volverAtras = () => {
    if (nivel === "materias") setNivel("semestres");
    else if (nivel === "semestres") setNivel("carreras");
  };

  return (
    <>
      {nivel === "carreras" && (
        <ListaNavegacion
          titulo="Áreas"
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
          onAgregar={() => console.log("Agregar clicked")}
        />
      )}

      {nivel === "semestres" && carrera && (
        <ListaNavegacion
          titulo={`Semestres - ${carrera.nombreArea}`}
          items={carrera.semestres || []}
          onSelect={seleccionarSemestre}
          onBack={volverAtras}
          onAgregar={() => console.log("Agregar clicked")}
        />
      )}

      {nivel === "materias" && semestre && (
        <ListaNavegacion
          titulo={`Materias - ${semestre.nombre}`}
          items={semestre.materias}
          onSelect={seleccionarMateria}
          onAgregar={() => console.log("Agregar materia clicked")}
          onBack={volverAtras}
        />
      )}
    </>
  );
};

export default Navigation;
