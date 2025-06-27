import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import QRModal from "../(components)/QR/QrProductoModal";
import { useGetRacksQuery, useUpdateProductoMutation } from "@/state/api";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { QRCodeSVG } from "qrcode.react";

type ProductoUbicacionInput = {
  rackId?: number;
  floorId?: number;
};

type NuevoProductoInput = {
  productoId: string; // <-- AGREGA ESTA LÍNEA
  nombre: string;
  precio: number;
  categoria?: number;
  descripcion?: string;
  proveedor?: string;
  cantidadExistente: number; // <--- nuevo campo
  ubicaciones: ProductoUbicacionInput[];
};

type CrearProductoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    productoData: NuevoProductoInput
  ) => Promise<{ productoId: string }>;
};

type Producto = {
  productoId: string;
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria: number;
  descripcion: string;
  proveedor: string;
  qr_url: string;
  rack_id?: number;
};

const CrearProductoModal = ({
  isOpen,
  onClose,
  onCreate,
}: CrearProductoModalProps) => {
  // Estados principales
  const [formData, setFormData] = useState<NuevoProductoInput>({
    productoId: uuidv4(),
    nombre: "",
    precio: 0,
    categoria: undefined,
    descripcion: "",
    proveedor: "",
    cantidadExistente: 0, // Inicializar nuevo campo
    ubicaciones: [],
  });

  const [ubicacionActual, setUbicacionActual] =
    useState<ProductoUbicacionInput>({});
  const [updateProducto] = useUpdateProductoMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productoCreado, setProductoCreado] = useState<Producto | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Consultas de datos
  const { data: racks = [], isLoading: isLoadingRacks } = useGetRacksQuery();

  // Resetear el formulario cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      productoId: uuidv4(),
      nombre: "",
      precio: 0,
      categoria: undefined,
      descripcion: "",
      proveedor: "",
      cantidadExistente: 0,
      ubicaciones: [],
    });
    setUbicacionActual({});
    setProductoCreado(null);
    setIsQRModalOpen(false);
  };

  // Validaciones
  const camposObligatoriosCompletos = () => {
    return (
      formData.nombre.trim() !== "" &&
      formData.precio > 0 &&
      formData.cantidadExistente > 0 &&
      formData.ubicaciones.length > 0 &&
      formData.ubicaciones.every(
        (u) =>
          u.rackId !== undefined &&
          u.rackId !== null &&
          u.floorId !== undefined &&
          u.floorId !== null
      )
    );
  };

  const hayDatosEnFormulario = () => {
    return Object.values(formData).some((value, index) => {
      if (index === 0) return false; // Ignorar productoId
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim() !== "";
      if (typeof value === "number") return value !== 0;
      return false;
    });
  };

  // Manejadores de cambios
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? parseFloat(value) : undefined,
    }));
  };

  const handleUbicacionChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUbicacionActual((prev) => ({
      ...prev,
      [name]: value
        ? name === "cantidad"
          ? parseInt(value)
          : parseInt(value)
        : undefined,
    }));
  };

  const agregarUbicacion = () => {
    if (ubicacionActual.rackId && ubicacionActual.floorId) {
      setFormData((prev) => ({
        ...prev,
        ubicaciones: [
          ...prev.ubicaciones,
          {
            rackId: Number(ubicacionActual.rackId),
            floorId: Number(ubicacionActual.floorId),
          },
        ],
      }));
      setUbicacionActual({});
    }
  };

  const eliminarUbicacion = (index: number) => {
    setFormData((prev) => {
      const nuevasUbicaciones = [...prev.ubicaciones];
      nuevasUbicaciones.splice(index, 1);
      return { ...prev, ubicaciones: nuevasUbicaciones };
    });
  };

  // Manejadores de formulario
  const handleCloseWithConfirm = async () => {
    if (!hayDatosEnFormulario()) {
      onClose();
      return;
    }

    const result = await Swal.fire({
      title: "¿Seguro que deseas cerrar?",
      text: "Hay datos ingresados. Si cierras, perderás los cambios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      onClose();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validación final
      if (!camposObligatoriosCompletos()) {
        throw new Error("Faltan campos obligatorios o ubicaciones inválidas");
      }

      // Crear el producto en la base de datos
      const resultado = await onCreate(formData);

      // Preparar datos para el QR
      setProductoCreado({
        productoId: resultado.productoId,
        nombre: formData.nombre,
        precio: formData.precio,
        cantidadExistente: formData.cantidadExistente,
        categoria: formData.categoria ?? 0,
        descripcion: formData.descripcion ?? "",
        proveedor: formData.proveedor ?? "",
        qr_url: "", // o el valor que corresponda
        rack_id: formData.ubicaciones[0]?.rackId ?? undefined,
      });
      setIsQRModalOpen(true);
    } catch (error) {
      console.error("Error al crear producto:", error);
      Swal.fire({
        title: "Error",
        text:
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as any).message === "string"
            ? (error as any).message
            : "No se pudo crear el producto",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // En CrearProductoModal.tsx
  const handleQRGenerated = (qrUrl: string) => {
    updateProducto({ productoId: productoCreado.productoId, qr_url: qrUrl });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="bg-blue-500 p-4 text-white">
          <h2 className="text-xl font-bold">Nuevo Producto</h2>
          <p className="text-sm opacity-90">
            Complete los detalles del producto
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Precio */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precio"
                min="0"
                step="0.01"
                value={formData.precio}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria || ""}
                onChange={handleSelectChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    Categoría {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Proveedor */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Proveedor
              </label>
              <input
                type="text"
                name="proveedor"
                value={formData.proveedor}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Cantidad total */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Cantidad total <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="cantidadExistente"
                min="1"
                value={formData.cantidadExistente || 0}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Ubicaciones */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-gray-700">
              Ubicaciones <span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Selección de Rack */}
              <div className="space-y-1">
                <label className="block text-sm text-gray-500">Rack</label>
                <select
                  name="rackId"
                  value={ubicacionActual.rackId || ""}
                  onChange={handleUbicacionChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar Rack...</option>
                  {racks.map((rack) => (
                    <option key={`rack-${rack.id}`} value={rack.id}>
                      Rack {rack.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de Piso */}
              {ubicacionActual.rackId && (
                <div className="space-y-1">
                  <label className="block text-sm text-gray-500">Piso</label>
                  <select
                    name="floorId"
                    value={ubicacionActual.floorId || ""}
                    onChange={handleUbicacionChange}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar Piso...</option>
                    {racks
                      .find(
                        (rack) => rack.id === Number(ubicacionActual.rackId)
                      )
                      ?.floors.map((floor) => (
                        <option key={floor.id} value={floor.id}>
                          {floor.name} (Nivel {floor.level})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Cantidad */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={agregarUbicacion}
                  disabled={!ubicacionActual.rackId || !ubicacionActual.floorId}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Lista de ubicaciones agregadas */}
            {formData.ubicaciones.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Ubicaciones asignadas
                </h4>
                <ul className="space-y-2">
                  {formData.ubicaciones.map((ubic, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span>
                        {`Rack ${ubic.rackId} - Piso ${
                          racks
                            .find((r) => r.id === ubic.rackId)
                            ?.floors.find((f) => f.id === ubic.floorId)?.name ||
                          ubic.floorId
                        }`}
                      </span>
                      <button
                        type="button"
                        onClick={() => eliminarUbicacion(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseWithConfirm}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!camposObligatoriosCompletos() || isSubmitting}
              className={`px-4 py-2 text-white rounded-md ${
                camposObligatoriosCompletos()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de QR (solo después de crear el producto) */}
      {productoCreado && (
        <QRModal
          isOpen={isQRModalOpen}
          producto={productoCreado} // <--- Cambia esto
          onClose={() => {
            setIsQRModalOpen(false);
            onClose();
          }}
          onQRGenerated={handleQRGenerated}
        />
      )}
    </div>
  );
};

export default CrearProductoModal;
