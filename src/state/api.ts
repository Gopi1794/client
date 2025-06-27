// Importamos funciones y tipos necesarios de Redux Toolkit Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Definimos la interfaz para un producto
export interface Productos {
  productoId: string;
  nombre: string;
  precio: number;
  categoria: number;
  cantidadExistente: number;
  descripcion: string;
  proveedor: string;
  qr_url?: string | null;
  ubicaciones?: ProductoUbicacion[];
}

export interface ProductoUbicacion {
  id: number;
  productoId: string;
  floorId: number;
  cantidad: number;
  producto: Productos;
}

export interface Floor {
  id: number;
  name: string;
  level: number;
  rackId: number;
  ubicaciones: ProductoUbicacion[];
}

export interface Rack {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  locked: boolean;
  qrData: string;
  floors: Floor[];
}

// Interfaz para crear un nuevo producto
export interface NuevoProducto {
  productoId: string;
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria: number;
  descripcion: string;
  proveedor: string;
  qr_url: string;
  ubicaciones: { floorId: number }[]; // solo floorId
}



// Interfaz para el resumen de ventas
export interface ResumenDeVentas {
  resumenDeVentasId: number; // ID único del resumen de ventas
  fecha: string;              // Fecha del resumen de ventas
  valorTotal: number;         // Valor total de las ventas
  porcentajeDeCambio?: number; // Porcentaje de cambio en comparación con el período anterior (opcional)
}

// Interfaz para el resumen de compras
export interface ResumenDeCompras {
  resumenDeComprasId: number; // ID único del resumen de compras
  totalComprado: string;      // Total de productos comprados
  porcentajeDeCambio?: number; // Porcentaje de cambio en comparación con el período anterior (opcional)
  fecha: number;              // Fecha del resumen de compras
}

// Interfaz para el resumen de gastos
export interface ResumenDeGastos {
  resumenDeGastosId: string;  // ID único del resumen de gastos
  totalGastos: number;        // Total de los gastos
  fecha: string;              // Fecha del resumen de gastos
}

// Interfaz para los gastos por categoría
export interface GastosPorCategoria {
  expensesCategoryId: string; // ID único de la categoría de gastos
  categoria: string;          // Nombre de la categoría de gastos
  totalGastos: number;        // Total de los gastos en esa categoría
  fecha: string;              // Fecha de los gastos
}

export interface GastosPorCategoriaResumen {
  gastosPorCategoriaResumenId: string;
  categoria: string;
  total: string;
  fecha: string;
}

// Interfaz que incluye todas las métricas del dashboard
export interface DashboardMetrics {
  productosPopulares: Productos[];    // Lista de productos populares
  resumenDeVentas: ResumenDeVentas[]; // Resumen de las ventas
  resumenDeCompras: ResumenDeCompras[]; // Resumen de las compras
  resumenDeGastos: ResumenDeGastos[];   // Resumen de los gastos
  gastosPorCategoria: GastosPorCategoria[]; // Gastos desglosados por categoría
}

// Interfaz para los usuarios
export interface Usuarios {
  usuarioId: string;  // ID único del usuario
  nombre: string;     // Nombre del usuario
  email: string;      // Email del usuario
}

// Definimos la API utilizando Redux Toolkit Query
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }), // Base URL de la API
  reducerPath: "api", // Ruta del reducer en el store de Redux
  tagTypes: ["dashboardMetrics", "Productos", "Usuarios", "Gastos", "Racks"], // Etiquetas para invalidar cachés
  endpoints: (build) => ({  // Definimos los endpoints disponibles en esta API
    // Endpoint para obtener las métricas del dashboard
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",  // URL para obtener las métricas del dashboard
      providesTags: ["dashboardMetrics"], // Etiqueta que se asocia a este endpoint
    }),
    // Endpoint para obtener los productos (opcionalmente puede recibir un parámetro de búsqueda)
    getProductos: build.query<Productos[], {
      searchTerm: string,
      page: number,
      limit: number,
      categoria: string,
      proveedor: string,
      precioMin: number,
      precioMax: number
    }>({
      query: ({ searchTerm, page, limit, categoria, proveedor, precioMin, precioMax }) =>
        `/productos?search=${searchTerm}&page=${page}&limit=${limit}` +
        (categoria ? `&categoria=${categoria}` : "") +
        (proveedor ? `&proveedor=${proveedor}` : "") +
        (precioMin ? `&precioMin=${precioMin}` : "") +
        (precioMax ? `&precioMax=${precioMax}` : ""),
    }),
    getRacks: build.query<Rack[], void>({
      query: () => "/rackRoutes", // ✅ Así coincide con tu backend
      providesTags: ["Racks"],
    }),
    // Endpoint para crear un nuevo producto
    createProducto: build.mutation<Productos, NuevoProducto>({
      query: (nuevoProducto) => ({
        url: "/productos", // URL para crear un producto
        method: "POST", // Método HTTP POST
        body: nuevoProducto // El cuerpo de la solicitud es el nuevo producto
      }),
      invalidatesTags: ["Productos"], // Invalidamos la caché de productos después de crear uno
    }),

   
  
    // Endpoint para obtener los usuarios
    getUsuarios: build.query<Usuarios[], void>({
      query: () => "/usuarios",  // URL para obtener los usuarios
      providesTags: ["Usuarios"],  // Etiqueta que se asocia a este endpoint
    }),
    getGastosPorCategoria: build.query<GastosPorCategoriaResumen[], void>({
      query: () => "/gastos",
      providesTags: ["Gastos"],  // Etiqueta que se asocia a este endpoint
    }),
    loginUsuario: build.mutation({
      query: ({ nombre_usuario, contrasena }) => ({
        url: '/authRoutes/login', // URL para el login
        method: 'POST',
        body: { nombre_usuario, contrasena },
      }),
    }),

    // Agrega este endpoint dentro de `endpoints` en tu configuración de la API
    createRack: build.mutation<Rack, Partial<Rack>>({
      query: (nuevoRack) => ({
        url: "/rackRoutes",
        method: "POST",
        body: nuevoRack,
      }),
      invalidatesTags: ["Racks"],
    }),

    // Agregar el endpoint para eliminar racks
    deleteRack: build.mutation<Rack, number>({
      query: (id) => ({
        url: `/rackRoutes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Racks"],
    }),

    updateRack: build.mutation<Rack, Partial<Rack> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/rackRoutes/${id}`,
        method: "PATCH", // o "PUT" según tu backend
        body: patch,
      }),
      // Opcional: actualiza el cache local si lo necesitas
    }),
    updateProducto: build.mutation<Productos, { productoId: string; qr_url: string }>({
      query: ({ productoId, qr_url }) => ({
        url: `/productos/${productoId}`,
        method: "PATCH",
        body: { qr_url },
      }),
      invalidatesTags: ["Productos"],
    }),
  }),
});

// Exponemos los hooks generados por Redux Toolkit Query para su uso en componentes
// HOOK
export const {
  useUpdateProductoMutation,
  useGetDashboardMetricsQuery,
  useGetProductosQuery,
  useCreateProductoMutation,
  useGetUsuariosQuery,
  useGetGastosPorCategoriaQuery,
  useLoginUsuarioMutation,
  useGetRacksQuery,
  useCreateRackMutation,
  useUpdateRackMutation,
  useDeleteRackMutation // Agregar el nuevo hook para eliminar racks
} = api;
