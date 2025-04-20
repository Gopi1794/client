"use client";

import { useGetProductosQuery } from "@/state/api";
import { Skeleton } from "@mui/material";
import Header from "../(components)/Header/header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "productoId", headerName: "ID", width: 90 },
  { field: "nombre", headerName: "Nombre de Producto", width: 200 },
  {
    field: "precio",
    headerName: "Precio",
    width: 150,
    type: "number",
    valueGetter: (value, row) => `$${row.precio}`,
  },
  {
    field: "categoria",
    headerName: "Categoria",
    width: 150,
    type: "number",
    valueGetter: (value, row) => (row.categoria ? row.categoria : "N/A"),
  },
  {
    field: "cantidadExistente",
    headerName: "CantidadExistente",
    width: 150,
    type: "number",
    valueGetter: (value, row) =>
      row.cantidadExistente ? row.cantidadExistente : "N/A",
  },
];

const Inventario = () => {
  const { data: productos, isError, isLoading } = useGetProductosQuery();
  console.log("productos :", productos);

  if (isLoading) {
    return (
      // ✅ Agregar return para que el Skeleton se renderice
      <Skeleton
        sx={{
          bgcolor: "grey.900",
          width: "100%",
          height: "100%",
        }}
        variant="rectangular"
      />
    );
  }

  if (isError || !productos) {
    return (
      <div className="text-center text-red-500 py-4">
        Falló la captura de productos
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Inventario" />
      <DataGrid
        rows={productos}
        columns={columns}
        getRowId={(row) => row.productoId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-500"
      />
    </div>
  );
};

export default Inventario;
