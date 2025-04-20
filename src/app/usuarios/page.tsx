"use client";

// Importamos los hooks de Redux Toolkit Query y componentes de Material UI
import { useGetUsuariosQuery } from "@/state/api";
import { Skeleton } from "@mui/material";
import Header from "../(components)/Header/header"; // Componente del encabezado
import { DataGrid, GridColDef } from "@mui/x-data-grid"; // Importamos DataGrid para mostrar los usuarios en una tabla

// Definimos las columnas que tendrá la tabla en el DataGrid
const columns: GridColDef[] = [
  { field: "usuarioId", headerName: "ID", width: 90 }, // Columna para el ID de usuario
  { field: "nombre", headerName: "Nombre", width: 200 }, // Columna para el nombre del usuario
  { field: "email", headerName: "Email", width: 200 }, // Columna para el email del usuario
];

const Usuarios = () => {
  // Usamos el hook useGetUsuariosQuery para obtener los datos de los usuarios de la API
  const { data: usuarios, isError, isLoading } = useGetUsuariosQuery();

  // Si los datos están cargando, mostramos un componente Skeleton como cargando
  if (isLoading) {
    return (
      <Skeleton
        sx={{
          bgcolor: "grey.900", // Fondo gris oscuro para el Skeleton
          width: "100%", // El Skeleton ocupará el 100% del ancho
          height: "100%", // El Skeleton ocupará el 100% de la altura
        }}
        variant="rectangular" // El Skeleton será rectangular (como un bloque)
      />
    );
  }

  // Si ocurrió un error al obtener los usuarios o no hay datos, mostramos un mensaje de error
  if (isError || !usuarios) {
    return (
      <div className="text-center text-red-500 py-4">
        Falló la captura de Usuarios
      </div>
    );
  }

  // Una vez cargados los usuarios correctamente, mostramos los datos en una tabla
  return (
    <div className="flex flex-col">
      {/* Componente Header que contiene el nombre de la página */}
      <Header name="Usuarios" />

      {/* Componente DataGrid que muestra la tabla con los datos de los usuarios */}
      <DataGrid
        rows={usuarios} // Los datos de usuarios son pasados a la tabla
        columns={columns} // Las columnas definidas anteriormente
        getRowId={(row) => row.usuarioId} // Función que obtiene el ID único de cada fila (usuarioId)
        checkboxSelection // Agregamos selección por casillas de verificación en cada fila
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-500" // Clases para el estilo de la tabla
      />
    </div>
  );
};

export default Usuarios;
