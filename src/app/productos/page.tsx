"use client";

// Importaciones de hooks, componentes y utilidades
import {
  NuevoProducto,
  useCreateProductoMutation,
  useGetProductosQuery,
} from "@/state/api";
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
  QrCode,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Filter,
} from "lucide-react";
import CrearProductoModal from "./CrearProductoModal";
import { Drawer } from "@mui/material";
import Swal from "sweetalert2";

// Definición del tipo de datos para un producto
type ProductoFormData = {
  productoId: string;
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria?: number;
  descripcion?: string;
  proveedor?: string;
  qr_url?: string;
  ubicaciones: {
    floorId: number;
  }[];
  fechaDeCreacion: Date;
  fechaDeModificacion: Date;
};

interface Ubicacion {
  id: number;
  floorId: number;
  producto: ProductoData; // Cambia de productos: ProductoData[] a producto: ProductoData
  cantidad: number;
}

// Componente principal de la página de productos
const Productos = () => {
  // Estados locales para búsqueda, modal, producto seleccionado y detalles
  const [detailedView, setDetailedView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createProducto] = useCreateProductoMutation();
  const [selectedProducto, setSelectedProducto] =
    useState<ProductoFormData | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [productoDetalle, setProductoDetalle] =
    useState<ProductoFormData | null>(null);
  const [page, setPage] = useState(1);
  const limit = 12;
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Función para abrir el drawer de detalles de un producto
  // Mejorar el manejo de valores por defecto
  const abrirDetalles = (producto: ProductoFormData) => {
    setSelectedProducto({
      ...producto,
      qr_url: producto.qr_url || "", // Mejor manejar en UI la ausencia
    });
    setIsQRModalOpen(true);
    setProductoDetalle(producto);
  };

  // Agregar paginación o carga infinita

  // Función para cerrar el drawer de detalles
  const cerrarDetalles = (
    event: React.KeyboardEvent | React.MouseEvent,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (!reason || reason === "backdropClick" || reason === "escapeKeyDown") {
      setProductoDetalle(null);
    }
  };

  // Consulta de productos usando RTK Query, filtrando por término de búsqueda
  const {
    data: productos,
    isLoading,
    isError,
  } = useGetProductosQuery({
    searchTerm,
    categoria,
    proveedor,
    precioMin: precioMin ? Number(precioMin) : 0,
    precioMax: precioMax ? Number(precioMax) : 0,
    page,
    limit,
  });

  // Función para crear un producto nuevo y mostrar feedback con SweetAlert
  const handleCreateProduct = async (productoData: NuevoProducto) => {
    try {
      // Validación básica
      if (
        !productoData.nombre ||
        !productoData.precio ||
        !productoData.cantidadExistente
      ) {
        throw new Error("Faltan campos requeridos");
      }

      // Establecer fechas
      const now = new Date();
      const productoCompleto = {
        ...productoData,
        fechaDeCreacion: now,
        fechaDeModificacion: now,
        fechaDeEliminacion: null,
        qr_url: productoData.qr_url || null,
        descripcion: productoData.descripcion || "Descripción no disponible",
        proveedor: productoData.proveedor || "Proveedor no especificado",
      };

      const response = await createProducto(productoCompleto).unwrap();

      Swal.fire({
        title: "¡Éxito!",
        text: "Producto guardado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      return response;
    } catch (error) {
      console.error("Error al crear producto:", error);
      Swal.fire({
        title: "Error",
        text:
          error.message || "No se pudo crear el producto. Verifica los datos.",
        icon: "error",
      });
      throw error;
    }
  };

  // Renderiza skeletons mientras se cargan los productos
  if (isLoading) {
    return (
      <div className="mx-auto pb-5 w-full max-w-9xl px-4">
        <div className="mb-8 relative">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={44}
            className="rounded-lg"
          />
        </div>
        {/* Skeleton de header y botón */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <Skeleton variant="text" width={180} height={40} />
          <Skeleton
            variant="rectangular"
            width={160}
            height={44}
            className="rounded-lg"
          />
        </div>
        {/* Skeletons de tarjetas de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={192}
                className="bg-gray-100"
              />
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

  // Renderiza mensaje de error si ocurre un error al cargar productos
  if (isError || !productos) {
    return (
      <div className="text-center text-red-500 py-4">
        Se ha producido un error al colectar los datos de los productos.
      </div>
    );
  }

  // Render principal de la página de productos
  return (
    <div className="mx-auto pb-5 w-full max-w-9xl px-4">
      <div className="mb-8 space-y-4">
        {/* Barra de búsqueda principal */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar productos por nombre, categoría, proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Botón para filtros avanzados (mobile/desktop) */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {showFilters ? (
              <X className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
            <span>{showFilters ? "Cerrar" : "Filtros"}</span>
          </button>
        </div>

        {/* Filtros avanzados (condicional) */}
        {showFilters && (
          <div className="flex flex-wrap justify-between gap-1 p-4 bg-gray-50 rounded-lg border border-gray-200 w-75">
            {/* Selector de categoría */}
            <div className="">
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-48 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                <option value="1">Categoría 1</option>
                <option value="2">Categoría 2</option>
              </select>
            </div>

            {/* Rango de precios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Máx"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtro de proveedor */}
            <div>
              <label
                htmlFor="proveedor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Proveedor
              </label>
              <input
                id="proveedor"
                type="text"
                placeholder="Nombre"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-48 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Botón de reset (opcional) */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoria("");
                  setProveedor("");
                  setPrecioMin("");
                  setPrecioMax("");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 shadow-xs hover:shadow-sm"
              >
                <RefreshCw className="h-4 w-4" /> {/* Icono de recargar */}
                Reiniciar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header con título y botón para abrir el modal de nuevo producto */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShoppingBag className="h-6 w-6 mr-2 text-blue-600" />
          Productos
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-5 rounded-lg shadow hover:shadow-md transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nuevo Producto
        </button>
      </div>

      {/* Botón para cambiar vista detallada/compacta */}
      <div className="mb-6">
        <button
          onClick={() => setDetailedView((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full shadow hover:bg-blue-100 transition-all"
        >
          {detailedView ? (
            <>
              <Box className="h-4 w-4" />
              Vista compacta
            </>
          ) : (
            <>
              <Info className="h-4 w-4" />
              Vista detallada
            </>
          )}
        </button>
      </div>

      {/* Lista de productos o mensaje si no hay productos */}
      {productos.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
          <Box className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay productos registrados
          </h3>
          <p className="mt-1 text-gray-500">
            Comienza agregando tu primer producto al inventario
          </p>
        </div>
      ) : detailedView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.productoId}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              {/* Imagen o icono del producto */}
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 h-48 flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-blue-400" />
              </div>

              {/* Información del producto */}
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

                {/* Categoría como estrellas */}
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

                {/* Botón para ver detalles del producto */}
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
      ) : (
        <div className="flex flex-col gap-3">
          {productos.map((producto) => (
            <div
              key={producto.productoId}
              className="bg-white rounded-lg border p-4 flex items-center gap-6 shadow-sm hover:shadow transition-all"
            >
              {/* Imagen o icono */}
              <div className="flex-shrink-0">
                <ShoppingBag className="h-12 w-12 text-blue-400" />
              </div>
              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 truncate">
                    {producto.nombre}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ID: {producto.productoId.substring(0, 4)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500">
                    Stock: {producto.cantidadExistente}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    ${producto.precio.toFixed(2)}
                  </span>
                </div>
              </div>
              {/* Botón de acción */}
              <button
                onClick={() => abrirDetalles(producto)}
                className="ml-4 text-blue-600 hover:underline text-sm whitespace-nowrap"
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {productos && productos.length > 0 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-opacity"
          >
            Anterior
          </button>
          <span className="flex items-center justify-center text-lg font-semibold text-gray-800">
            {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={productos.length < limit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-opacity"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal para crear un nuevo producto */}
      <CrearProductoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      {/* Drawer lateral para mostrar detalles del producto seleccionado */}
      <Drawer
        anchor="right"
        open={!!productoDetalle}
        onClose={cerrarDetalles}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "450px" },
            backgroundColor: "rgba(176, 176, 176, 0.38)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        {productoDetalle && (
          <div className="p-6 h-full flex flex-col">
            {/* Header del drawer */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {productoDetalle.nombre}
              </h2>
              <button
                onClick={cerrarDetalles}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Contenido del drawer: QR, info básica, descripción, detalles */}
            <div className="flex-grow overflow-y-auto space-y-4">
              {/* Sección del QR */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <QrCode className="h-5 w-5 mr-2 text-blue-500" />
                  Código QR del Producto
                </h3>
                <div className="flex flex-col items-center">
                  {productoDetalle.qr_url ? (
                    <img
                      src={productoDetalle.qr_url}
                      alt="Código QR del producto"
                      className="w-48 h-48 border border-gray-200 p-2 rounded-md"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                      <span className="text-gray-400">QR no disponible</span>
                    </div>
                  )}
                  <p className="mt-3 text-sm text-gray-500 text-center">
                    Escanea este código para ver los detalles del producto
                  </p>
                </div>
              </div>

              {/* Información básica */}
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ubicación:</span>
                    <span className="font-medium text-gray-900">
                      {productoDetalle.ubicaciones &&
                      productoDetalle.ubicaciones.length > 0
                        ? `Rack ${productoDetalle.ubicaciones[0].floor.rackId}, Nivel ${productoDetalle.ubicaciones[0].floor.level}`
                        : "No especificada"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
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

              {/* Detalles adicionales */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Detalles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Package className="h-4 w-4 mr-1" />
                      ID Producto
                    </div>
                    <p className="font-medium text-gray-900">
                      {productoDetalle.productoId}
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

            {/* Botón para cerrar el drawer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={cerrarDetalles}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
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
