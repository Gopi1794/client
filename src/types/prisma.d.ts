import { Prisma } from '@prisma/client';

export namespace PrismaTypes {
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

    export interface Floor {
        id: number;
        name: string;
        level: number;
        rackId: number;
        ubicaciones: ProductoUbicacion[];
    }

    export interface ProductoUbicacion {
        id: number;
        productoId: string;
        floorId: number;
        cantidad: number;
        producto: Producto;
    }

    export interface Producto {
        productoId: string;
        nombre: string;
        precio: number;
        cantidadExistente: number;
        categoria?: number;
        proveedor: string;
        descripcion: string;
    }
} 