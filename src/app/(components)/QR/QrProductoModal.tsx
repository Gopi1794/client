import React, { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";

type QRModalProps = {
  isOpen: boolean;
  producto: {
    productoId: string;
    nombre: string;
    precio: number;
    cantidadExistente: number;
    categoria: number;
  };
  onClose: () => void;
};

const QRModal = ({ isOpen, producto, onClose }: QRModalProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => qrRef.current,
    documentTitle: `Etiqueta - ${producto.nombre}`,
    pageStyle: `
      @page {
        size: 60mm 40mm; /* Ajustalo al tamaño real de tu etiqueta */
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
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
      .etiqueta p {
        margin: 2px 0;
      }
      .etiqueta canvas {
        margin-bottom: 4px;
      }
    `,
  });

  const qrValue = useMemo(() => JSON.stringify(producto), [producto]);

  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">
          Código QR Generado
        </h2>
        <div
          ref={qrRef}
          className="etiqueta flex flex-col items-center justify-center text-center"
        >
          <QRCodeSVG
            className="mb-2"
            value={qrValue}
            size={128}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
          <p>
            <strong>{producto.nombre}</strong>
          </p>
          <p>Precio: ${producto.precio}</p>
          <p>ID: {producto.productoId}</p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Escanea el código QR para más info</p>
        </div>
        <div className="flex justify-around mt-6">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
