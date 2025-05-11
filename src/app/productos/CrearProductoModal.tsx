import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { v4 } from "uuid"; // Para generar un ID único
import QRModal from "../(components)/QR/QrProductoModal"; // Ajusta la ruta si es distinta
import { useGetRacksQuery } from "@/state/api";

type ProductoFormData = {
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria: number;
  descripcion: string;
  proveedor: string;
  qr_url: string;
  rack_id: number;
};

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
    productoId: v4(), // ID único generado solo cuando se abre el modal
    nombre: "",
    precio: 0,
    cantidadExistente: 0,
    categoria: 0,
    descripcion: "",
    proveedor: "",
    qr_url: "",
    rack_id: 0,
  });

  const [productoGenerado, setProductoGenerado] = useState<
    (ProductoFormData & { productoId: string }) | null
  >(null);

  // Generar nuevo productoId solo cuando se abre el modal
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      productoId: prev.productoId || v4(),
    }));
  }, []);

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

  const handleQRGenerated = async (qrUrl: string) => {
    const finalData = { ...formData, qr_url: qrUrl };

    try {
      await onCreate(finalData);
      alert("Producto creado exitosamente.");
    } catch (error) {
      console.error("Error al crear el producto:", error);
      alert(
        "Ocurrió un error al crear el producto. Por favor, inténtalo de nuevo."
      );
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      formData.precio <= 0 ||
      formData.cantidadExistente <= 0
    ) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    setProductoGenerado(formData); // Guardamos los datos previos al QR
    setIsQRModalOpen(true); // Abrimos modal de QR
  };

  const handleClose = () => {
    setFormData({
      productoId: v4(),
      nombre: "",
      precio: 0,
      cantidadExistente: 0,
      categoria: 0,
      descripcion: "",
      proveedor: "",
      qr_url: "",
      rack_id: 0,
    });
    setProductoGenerado(null);
    onClose();
  };

  // Obtener racks desde la API
  const { data: racks = [], isLoading, isError } = useGetRacksQuery();

  if (isError) {
    return (
      <p>Error al cargar los racks. Por favor, inténtalo de nuevo más tarde.</p>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 className="text-xl font-bold">Nuevo Producto</h2>
          <p className="text-sm opacity-90">
            Complete los detalles del producto
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Grupo de campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Nombre*
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej: Laptop HP EliteBook"
                onChange={handleChange}
                value={formData.nombre}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Precio */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Precio*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="precio"
                  placeholder="0.00"
                  onChange={handleChange}
                  value={formData.precio}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Cantidad */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Cantidad*
              </label>
              <input
                type="number"
                name="cantidadExistente"
                placeholder="0"
                onChange={handleChange}
                value={formData.cantidadExistente}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Categoría*
              </label>
              <select
                name="categoria"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoria: parseInt(e.target.value),
                  })
                }
                value={formData.categoria}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Seleccione...
                </option>
                <option value="1">Electrónica</option>
                <option value="2">Oficina</option>
                <option value="3">Suministros</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              placeholder="Detalles del producto..."
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              value={formData.descripcion}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            />
          </div>

          {/* Proveedor */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Proveedor*
            </label>
            <input
              type="text"
              name="proveedor"
              placeholder="Nombre del proveedor"
              onChange={handleChange}
              value={formData.proveedor}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Ubicación*
            </label>
            <select
              name="rack_id"
              value={formData.rack_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rack_id: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Seleccionar ubicación...
              </option>
              {isLoading ? (
                <option value="">Cargando racks...</option>
              ) : (
                racks.map((rack) => (
                  <option key={rack.id} value={rack.id}>
                    {rack.qrData}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>

      {/* Modal de QR */}
      {productoGenerado && (
        <QRModal
          isOpen={isQRModalOpen && !!productoGenerado}
          producto={productoGenerado}
          onClose={() => {
            setIsQRModalOpen(false);
            handleClose();
          }}
          onQRGenerated={handleQRGenerated}
        />
      )}
    </div>
  );
};

export default CrearProductoModal;
