import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";

// Definimos el tipo completo del producto
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

type QRModalProps = {
  isOpen: boolean;
  producto: Producto;
  onClose: () => void;
  onQRGenerated: (qrUrl: string) => void; // Nueva prop para pasar el QR generado
};

const QRModal = ({
  isOpen,
  producto,
  onClose,
  onQRGenerated,
}: QRModalProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [productoCongelado, setProductoCongelado] = useState<Producto | null>(
    null
  );
  useEffect(() => {
    if (isOpen && producto && !productoCongelado) {
      setProductoCongelado({ ...producto });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, producto]);
  // Función para generar la URL del QR
  const generateQRCodeUrl = () => {
    if (!productoCongelado) return "";

    const qrData = {
      id: productoCongelado.productoId,
      nombre: productoCongelado.nombre,
      precio: productoCongelado.precio,
      rack: productoCongelado.rack_id,
    };

    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      JSON.stringify(qrData)
    )}&size=200x200`;
  };

  // Llamar a onQRGenerated cuando tengamos los datos
  useEffect(() => {
    if (productoCongelado) {
      const qrUrl = generateQRCodeUrl();
      onQRGenerated(qrUrl); // Pasamos la URL generada al componente padre
    }
  }, [productoCongelado, onQRGenerated]);

  const handlePrint = useReactToPrint({
    content: () => qrRef.current,
    documentTitle: `Etiqueta - ${productoCongelado?.nombre || "Etiqueta"}`,
    pageStyle: `
      @page { size: 60mm 40mm; margin: 0; }
      body { margin: 0; padding: 0; }
      .etiqueta {
        width: 60mm;
        height: 40mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        font-size: 10pt;
      }
      .etiqueta p { margin: 2px 0; }
      .etiqueta canvas { margin-bottom: 4px; }
    `,
  });

  if (!isOpen || !productoCongelado) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-100">
        {/* Encabezado minimalista */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            Código QR del Producto
          </h2>
        </div>

        {/* Contenedor QR simplificado */}
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <QRCodeSVG
              value={JSON.stringify({
                id: productoCongelado.productoId,
                nombre: productoCongelado.nombre,
                precio: productoCongelado.precio,
                rack: productoCongelado.rack_id,
              })}
              size={180}
              bgColor="#ffffff"
              fgColor="#1f2937"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Información en lista compacta */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Producto:</span>
            <span className="text-gray-900 font-medium">
              {productoCongelado.nombre}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Precio:</span>
            <span className="text-gray-900 font-medium">
              ${productoCongelado.precio}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">ID:</span>
            <span className="text-gray-900 font-medium">
              {productoCongelado.productoId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Ubicación:</span>
            <span className="text-gray-900 font-medium">
              {productoCongelado.rack_id}
            </span>
          </div>
        </div>

        {/* Botones simplificados */}
        <div className="flex gap-3 justify-end border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            Imprimir QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
