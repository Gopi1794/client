"use client"; // Indica que este archivo se ejecuta en el cliente (usando Next.js).

import { useCreateProductoMutation, useGetProductosQuery } from "@/state/api";
import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import Header from "@/app/(components)/Header/header";
import Rating from "@/app/(components)/Rating/index";
import CrearProductoModal from "./CrearProductoModal";

// Definimos el tipo para los datos del formulario de productos
type ProductoFormData = {
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria: number;
};

const Productos = () => {
  // Estado para manejar el término de búsqueda en la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para manejar la visibilidad del modal para crear un producto
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook para obtener la lista de productos basados en el término de búsqueda
  const {
    data: productos,
    isLoading,
    isError,
  } = useGetProductosQuery(searchTerm);

  // Hook para la mutación de creación de productos en la base de datos
  const [createProducto] = useCreateProductoMutation();

  // Función para manejar la creación de productos
  const handleCreateProduct = async (productoData: ProductoFormData) => {
    await createProducto(productoData); // Enviamos los datos a la API para crear un producto
  };

  // Si los productos están cargando, mostramos un esqueleto de carga
  if (isLoading) {
    return (
      <Skeleton
        sx={{
          bgcolor: "grey.900",
          width: "100%", // Ajuste al 100% del contenedor
          height: "100%", // Ajuste al 100% del contenedor
        }}
        variant="rectangular"
      />
    );
  }

  // Si hay un error en la consulta, mostramos un mensaje de error
  if (isError || !productos) {
    return (
      <div className="text-center text-red-500 py-4">
        Se ha producido un error al colectar los datos de los productos.
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2 " />
          <input
            type="text"
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado con el texto ingresado
          />
        </div>
      </div>

      {/* Encabezado y botón para agregar un producto */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Productos" />
        <button
          className="flex item-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)} // Abre el modal para crear un producto
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Producto
        </button>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <Skeleton
            sx={{
              bgcolor: "grey.900",
              width: "100%", // Ajuste al 100% del contenedor
              height: "100%", // Ajuste al 100% del contenedor
            }}
            variant="rectangular"
          />
        ) : (
          productos?.map((producto) => (
            <div
              key={producto.productoId} // Cada producto tiene un ID único
              className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center">
                {/* Aquí podrías agregar una imagen del producto */}
                img
                <h3 className="text-lg text-gray-900 font-semibold">
                  {producto.nombre}
                </h3>
                <p className="text-gray-800">${producto.precio.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock: {producto.cantidadExistente}
                </div>
                {/* Si el producto tiene categoría, mostramos la calificación */}
                {producto.categoria && (
                  <div className="flex items-center mt-2">
                    <Rating rating={producto.categoria} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para crear un producto */}
      <CrearProductoModal
        isOpen={isModalOpen} // Controla si el modal está abierto
        onClose={() => setIsModalOpen(false)} // Cierra el modal
        onCreate={handleCreateProduct} // Llama a la función de creación de productos
      />
    </div>
  );
};

export default Productos;
