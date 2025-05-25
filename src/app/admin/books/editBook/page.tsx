"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Pencil,
  User,
  ImagePlus,
  CircleX,
  Save,
  BookOpen,
  School,
  Calendar,
  BookText,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "nextjs-toast-notify";
import Image from "next/image";

interface Area {
  id: number;
  nombreArea: string;
}

interface Semestre {
  idSemestre: number;
  nombreSemestre: string;
  fkIdArea: number;
}

interface Materia {
  idMateria: number;
  nombreMateria: string;
  fkIdSemestre: number;
}

const EditarLibro = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idLibro = searchParams.get("id");

  const [nombreLibro, setNombreLibro] = useState("");
  const [autor, setAutor] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [portada, setPortada] = useState<File | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  const [fkIdArea, setFkIdArea] = useState<number | null>(null);
  const [fkIdSemestre, setFkIdSemestre] = useState<number | null>(null);
  const [fkIdMateria, setFkIdMateria] = useState<number | null>(null);

  const [areas, setAreas] = useState<Area[]>([]);
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const [areaRes, semestreRes, materiaRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/area/`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/semestre/`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/materias/`),
        ]);

        setAreas(await areaRes.json());
        setSemestres(await semestreRes.json());
        setMaterias(await materiaRes.json());
      } catch {
        toast.error("Error al cargar información del backend");
      }
    };

    fetchInfo();
  }, []);

  useEffect(() => {
    if (idLibro) {
      const fetchLibro = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/books/getBooks/${idLibro}`
          );
          const data = await res.json();

          setNombreLibro(data.nombreLibro || "");
          setAutor(data.autor || "");
          setDescripcion(data.descripcion || "");
          setFkIdArea(data.fkIdArea);
          setFkIdSemestre(data.fkIdSemestre);
          setFkIdMateria(data.fkIdMateria);
        } catch {
          toast.error("Error al obtener los datos del libro.");
        }
      };

      fetchLibro();
    }
  }, [idLibro]);

  const handlePortadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPortada(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      setPreviewPdf(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      !nombreLibro ||
      !autor ||
      !descripcion ||
      !fkIdArea ||
      !fkIdSemestre ||
      !fkIdMateria
    ) {
      toast.error("Por favor llena todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombreLibro", nombreLibro);
    formData.append("autor", autor);
    formData.append("descripcion", descripcion);
    formData.append("fkIdArea", fkIdArea.toString());
    formData.append("fkIdSemestre", fkIdSemestre.toString());
    formData.append("fkIdMateria", fkIdMateria.toString());
    formData.append("idLibro", idLibro!); // Añadido idLibro a la solicitud

    if (portada) formData.append("portada", portada);
    if (archivo) formData.append("archivo", archivo);

    try {
      console.log("Datos a enviar:", {
        nombreLibro,
        autor,
        descripcion,
        fkIdArea,
        fkIdSemestre,
        fkIdMateria,
        portada,
        archivo,
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/updateBook/${idLibro}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        toast.success("Libro actualizado correctamente");
        router.push("/admin/books");
      } else {
        const errorText = await res.text();
        toast.error(`Error al actualizar el libro: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de red al actualizar");
    }
  };

  const filteredSemestres = semestres.filter((s) => s.fkIdArea === fkIdArea);
  const filteredMaterias = materias.filter(
    (m) => m.fkIdSemestre === fkIdSemestre
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
        {/* Sección izquierda - Imagen y PDF */}
        <div className="flex flex-col items-center justify-between w-full md:w-2/5 bg-gradient-to-br from-emerald-500 to-teal-700 p-8 text-white">
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Portada del Libro
            </h2>
            <div className="flex justify-center">
              <label className="w-64 h-64 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl cursor-pointer hover:bg-white/30 transition-all duration-300 overflow-hidden border-4 border-white/50 shadow-lg">
                {previewImg ? (
                  <Image
                    src={previewImg || "/placeholder.svg"}
                    alt="Previsualización"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <ImagePlus size={60} className="text-white mb-2" />
                    <span className="text-sm font-medium">
                      Seleccionar imagen
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePortadaChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="w-full mt-8">
            <h2 className="text-xl font-bold mb-4 text-center">Archivo PDF</h2>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <label className="flex flex-col items-center justify-center w-full p-3 border-2 border-white/50 border-dashed rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex flex-col items-center justify-center">
                  <BookOpen className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">
                    {archivo ? archivo.name : "Seleccionar PDF"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleArchivoChange}
                  className="hidden"
                />
              </label>

              {previewPdf && (
                <div className="mt-4 bg-white rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={previewPdf}
                    className="w-full h-40"
                    title="PDF preview"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full mt-8 gap-4 justify-center">
            <button
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 justify-center font-medium transition-all duration-300 backdrop-blur-sm border border-white/30"
              onClick={() => router.back()}
            >
              <CircleX size={18} /> Cancelar
            </button>
            <button
              className="bg-white text-teal-700 px-5 py-2.5 rounded-lg flex items-center gap-2 justify-center font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg"
              onClick={handleSubmit}
            >
              <Save size={18} /> Guardar
            </button>
          </div>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
            Editar Libro
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nombre del Libro
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nombreLibro}
                  onChange={(e) => setNombreLibro(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg pl-12 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Ingresa el título del libro"
                />
                <BookText
                  className="absolute left-4 top-3.5 text-emerald-600"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Autor
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg pl-12 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="Nombre del autor"
                />
                <User
                  className="absolute left-4 top-3.5 text-emerald-600"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all min-h-[100px]"
                placeholder="Escribe una breve descripción del libro"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Área
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg pl-12 text-gray-700 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                    value={fkIdArea ?? ""}
                    onChange={(e) => {
                      const selected = Number.parseInt(e.target.value);
                      setFkIdArea(selected);
                      setFkIdSemestre(null);
                      setFkIdMateria(null);
                    }}
                  >
                    <option value="">Selecciona</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombreArea}
                      </option>
                    ))}
                  </select>
                  <School
                    className="absolute left-4 top-3.5 text-emerald-600"
                    size={20}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Semestre
                </label>
                <div className="relative">
                  <select
                    className={`w-full p-3 border border-gray-300 rounded-lg pl-12 text-gray-700 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white ${
                      !fkIdArea ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    value={fkIdSemestre ?? ""}
                    onChange={(e) => {
                      const selected = Number.parseInt(e.target.value);
                      setFkIdSemestre(selected);
                      setFkIdMateria(null);
                    }}
                    disabled={!fkIdArea}
                  >
                    <option value="">Selecciona</option>
                    {filteredSemestres.map((sem) => (
                      <option key={sem.idSemestre} value={sem.idSemestre}>
                        {sem.nombreSemestre}
                      </option>
                    ))}
                  </select>
                  <Calendar
                    className="absolute left-4 top-3.5 text-emerald-600"
                    size={20}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Materia
                </label>
                <div className="relative">
                  <select
                    className={`w-full p-3 border border-gray-300 rounded-lg pl-12 text-gray-700 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white ${
                      !fkIdSemestre ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    value={fkIdMateria ?? ""}
                    onChange={(e) =>
                      setFkIdMateria(Number.parseInt(e.target.value))
                    }
                    disabled={!fkIdSemestre}
                  >
                    <option value="">Selecciona</option>
                    {filteredMaterias.map((materia) => (
                      <option key={materia.idMateria} value={materia.idMateria}>
                        {materia.nombreMateria}
                      </option>
                    ))}
                  </select>
                  <Pencil
                    className="absolute left-4 top-3.5 text-emerald-600"
                    size={20}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarLibro;
