// Importamos funciones y tipos necesarios de Redux Toolkit Query
import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Definimos la interfaz para un producto
export interface Productos {
    productoId: string ;      // ID único del producto
    nombre: string;           // Nombre del producto
    precio: number;           // Precio del producto
    categoria: number;        // Categoría del producto
    cantidadExistente: number; // Cantidad de productos disponibles en stock
}

// Interfaz para crear un nuevo producto
export interface NuevoProducto {
    nombre: string;           // Nombre del producto
    precio: number;           // Precio del producto
    categoria: number;        // Categoría del producto
    cantidadExistente: number; // Cantidad de productos a crear
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
    ctaegoria: string;
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
    tagTypes: ["dashboardMetrics", "Productos", "Usuarios" , "Gastos"], // Etiquetas para invalidar cachés
    endpoints: (build) => ({  // Definimos los endpoints disponibles en esta API
        // Endpoint para obtener las métricas del dashboard
        getDashboardMetrics: build.query<DashboardMetrics, void>({
            query: () => "/dashboard",  // URL para obtener las métricas del dashboard
            providesTags: ["dashboardMetrics"], // Etiqueta que se asocia a este endpoint
        }),
        // Endpoint para obtener los productos (opcionalmente puede recibir un parámetro de búsqueda)
        getProductos: build.query<Productos[], string | void>({
            query: (search) => ({ 
                url: "/productos",  // URL para obtener los productos
                params: search ? { search } : {}  // Si hay búsqueda, la pasamos como parámetro
            }),
            providesTags: ["Productos"],  // Etiqueta que se asocia a este endpoint
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
              url: '/authRoutes',
              method: 'POST',
              body: { nombre_usuario, contrasena },
            }),
          }),
          
      
    }),
});

// Exponemos los hooks generados por Redux Toolkit Query para su uso en componentes
export const {
    useGetDashboardMetricsQuery,
    useGetProductosQuery,
    useCreateProductoMutation,
    useGetUsuariosQuery,
    useGetGastosPorCategoriaQuery,
    useLoginUsuarioMutation, // <<--- NUEVO HOOK
  } = api;
  
