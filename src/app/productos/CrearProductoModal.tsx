import React, { ChangeEvent, FormEvent, useState, useRef } from "react";
import { v4 } from "uuid"; // Importa la función para generar un ID único
import Header from "../(components)/Header/header";
import QRModal from "../(components)/QR/QrProductoModal"; // ajustá la ruta si es distinta

// Define el tipo de datos que manejará el formulario
type ProductoFormData = {
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria: number;
};

// Define las propiedades que recibirá el componente
type CrearProductoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductoFormData) => void;
};

const CrearProductoModal = ({
  isOpen,
  onClose,
  onCreate,
}: CrearProductoModalProps) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    productoId: v4(),
    nombre: "",
    precio: 0,
    cantidadExistente: 0,
    categoria: 0,
  });

  // ✅ Aquí definimos handlePrint, fuera de cualquier ciclo de renderizado

  const [productoGenerado, setProductoGenerado] = useState<
    (ProductoFormData & { productoId: string }) | null
  >(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "precio" || name === "cantidadExistente"
          ? parseFloat(value) || 0
          : value,
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevoProducto = { ...formData, productoId: v4() };
    onCreate(nuevoProducto);
    setProductoGenerado(nuevoProducto);
    setIsQRModalOpen(true); // 👈 abrí el modal de QR
  };

  const handleClose = () => {
    setProductoGenerado(null); // limpia el producto generado
    onClose(); // cierra el modal
  };

  // Si el modal no está abierto, no renderiza nada
  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 text-gray-100 placeholder-gray-500 border-gray-500 border-2 rounded-md";

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-auto h-full w-full z-20 "
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Nuevo Producto" />
        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="nombreProducto" className={labelCssStyles}>
            Nombre del Producto
          </label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            value={formData.nombre}
            className={inputCssStyles}
            required
          />
          <label htmlFor="precioProducto" className={labelCssStyles}>
            Precio del Producto
          </label>
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            onChange={handleChange}
            value={formData.precio}
            className={inputCssStyles}
            required
          />
          <label htmlFor="cantidadExistente" className={labelCssStyles}>
            Cantidad
          </label>
          <input
            type="number"
            name="cantidadExistente"
            placeholder="Cantidad Existente"
            onChange={handleChange}
            value={formData.cantidadExistente}
            className={inputCssStyles}
            required
          />
          <label htmlFor="categoria" className={labelCssStyles}>
            Categoria
          </label>
          <input
            type="number"
            name="categoria"
            placeholder="Categoria"
            onChange={handleChange}
            value={formData.categoria}
            className={inputCssStyles}
            required
          />
          <div className="flex-col justify-between gap-1">
            <div className="flex justify-between gap-1">
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Guardar Producto
              </button>
              <button
                onClick={handleClose}
                type="button"
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>

          {productoGenerado && (
            <QRModal
              isOpen={isQRModalOpen && !!productoGenerado}
              producto={productoGenerado}
              onClose={() => {
                setIsQRModalOpen(false); // cerrar el QR modal
                handleClose(); // cerrar el modal de crear producto
              }}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default CrearProductoModal;
