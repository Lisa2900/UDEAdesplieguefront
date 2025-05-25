import { AlumnoEdit } from "@/types";

interface User {
  id: number;
  nombre: string;
  correo: string;
  // Agrega más campos si tu usuario tiene otros atributos
}

export const updateALumn = async (
  data: AlumnoEdit
): Promise<{ ok: boolean; message: string; user?: User }> => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/alumno/${encodeURIComponent(data.correo)}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contentType = response.headers.get("content-type");

    const dataParsed: { message?: string; user?: User } =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

    if (!response.ok) {
      return {
        ok: false,
        message: dataParsed.message || "Error al actualizar",
      };
    }

    return {
      ok: true,
      message: dataParsed.message || "Actualización exitosa",
      user: dataParsed.user,
    };
  } catch (error) {
    const typedError = error as Error;
    return {
      ok: false,
      message: typedError.message || "Error desconocido",
    };
  }
};
