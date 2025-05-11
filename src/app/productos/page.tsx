"use client"; // Indica que este archivo se ejecuta en el cliente (usando Next.js).

import { useCreateProductoMutation, useGetProductosQuery } from "@/state/api";
import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  Search,
  PlusCircle,
  ShoppingBag,
  Box,
  Star,
  Info,
  X,
  Package,
  Truck,
  FileText,
} from "lucide-react";
import CrearProductoModal from "./CrearProductoModal";
import QRModal from "@/app/(components)/QR/QrProductoModal"; // Asegúrate de importar el modal de QR
import { Drawer } from "@mui/material";
// Definimos el tipo para los datos del formulario de productos
type ProductoFormData = {
  productoId: string;
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria: number;
  qr_url: string;
  ubicacion: string; // El campo qr_url es opcional aquí
};

const Productos = () => {
  // Estado para manejar el término de búsqueda en la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para manejar la visibilidad del modal para crear un producto
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para manejar la visibilidad del modal de características
  const [selectedProducto, setSelectedProducto] =
    useState<ProductoFormData | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState<Producto | null>(null);

  // Función para abrir el drawer con un producto
  const abrirDetalles = (producto: Producto) => {
    setSelectedProducto({
      ...producto,
      qr_url: producto.qr_url || "url por defecto o generada",
    });
    setIsQRModalOpen(true);
    setProductoDetalle(producto);
  };

  // Función para cerrar el drawer
  const cerrarDetalles = (
    event: React.SyntheticEvent,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    // Solo permite cerrar con clic fuera o tecla escape
    if (!reason || reason === "backdropClick" || reason === "escapeKeyDown") {
      setProductoDetalle(null);
    }
  };

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

  // Reemplaza el bloque de isLoading actual con este código:
  if (isLoading) {
    return (
      <div className="mx-auto pb-5 w-full max-w-9xl px-4">
        {/* Barra de búsqueda skeleton */}
        <div className="mb-8 relative">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={44}
            className="rounded-lg"
          />
        </div>

        {/* Encabezado skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <Skeleton variant="text" width={180} height={40} />
          <Skeleton
            variant="rectangular"
            width={160}
            height={44}
            className="rounded-lg"
          />
        </div>

        {/* Grid de productos skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              {/* Imagen skeleton */}
              <Skeleton
                variant="rectangular"
                width="100%"
                height={192}
                className="bg-gray-100"
              />

              {/* Contenido skeleton */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between">
                  <Skeleton variant="text" width="60%" height={28} />
                  <Skeleton variant="circular" width={60} height={24} />
                </div>

                <div className="flex justify-between items-center">
                  <Skeleton variant="text" width="30%" height={24} />
                  <Skeleton variant="text" width="40%" height={24} />
                </div>

                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="circular"
                      width={20}
                      height={20}
                      className="mr-1"
                    />
                  ))}
                </div>

                <div className="flex space-x-3 pt-2">
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={36}
                    className="rounded-md"
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={36}
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto pb-5 w-full max-w-9xl px-4">
      {/* Barra de búsqueda moderna */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Buscar productos por nombre, categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2 text-blue-600" />
          Productos
        </h2>
        <button
          onClick={() => {
            console.log("Abriendo modal...");
            setIsModalOpen(true);
          }}
          className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-5 rounded-lg shadow hover:shadow-md transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Lista de productos mejorada */}
      {productos?.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
          <Box className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay productos registrados
          </h3>
          <p className="mt-1 text-gray-500">
            Comienza agregando tu primer producto al inventario
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Agregar Producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos?.map((producto) => (
            <div
              key={producto.productoId}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              {/* Placeholder para imagen del producto */}
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 h-48 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-blue-400" />
              </div>

              {/* Contenido de la tarjeta */}
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {producto.nombre}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ID: {producto.productoId.substring(0, 4)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ${producto.precio.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      producto.cantidadExistente > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {producto.cantidadExistente > 0
                      ? `${producto.cantidadExistente} disponibles`
                      : "Agotado"}
                  </span>
                </div>

                {producto.categoria && (
                  <div className="mt-3 flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < producto.categoria
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-500">
                      ({producto.categoria}.0)
                    </span>
                  </div>
                )}

                <div className="mt-5 flex space-x-3">
                  <button
                    onClick={() => abrirDetalles(producto)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      <CrearProductoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      {selectedProducto && (
        <QRModal
          isOpen={isQRModalOpen}
          producto={selectedProducto}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}

      {/* Drawer de detalles con MUI */}
      <Drawer
        anchor="right"
        open={!!productoDetalle}
        onClose={cerrarDetalles}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "400px" },
            backgroundColor: "rgba(176, 176, 176, 0.38)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {productoDetalle && (
          <div className="p-6 h-full flex flex-col">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {productoDetalle.nombre}
              </h2>
              <button
                onClick={() => setProductoDetalle(null)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-grow overflow-y-auto space-y-4">
              <div className="bg-gray-50 h-48 flex items-center justify-center rounded-lg">
                <ShoppingBag className="h-16 w-16 text-blue-400" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  Información Básica
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Precio:</span>
                    <span className="font-medium text-blue-600">
                      ${productoDetalle.precio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stock:</span>
                    <span
                      className={`font-medium ${
                        productoDetalle.cantidadExistente > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {productoDetalle.cantidadExistente} unidades
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  Descripción
                </h3>
                <p className="text-gray-600">
                  {productoDetalle.descripcion ||
                    "No hay descripción disponible."}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Detalles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Package className="h-4 w-4 mr-1" />
                      SKU
                    </div>
                    <p className="font-medium text-gray-900">
                      {productoDetalle.productoId.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Truck className="h-4 w-4 mr-1" />
                      Proveedor
                    </div>
                    <p className="font-medium text-gray-900">
                      {productoDetalle.proveedor || "No especificado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie del drawer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setProductoDetalle(null)}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <X className="h-5 w-5 mr-2" />
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Productos;
