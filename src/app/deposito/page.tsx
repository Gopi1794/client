"use client";

import {
  useGetProductosQuery,
  useCreateRackMutation,
  useGetRacksQuery,
} from "@/state/api";
import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import { Move, Lock, Trash, Eye } from "lucide-react";
import {
  Button,
  Drawer,
  Modal,
  Skeleton,
  Typography,
  Box,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import Rating from "../(components)/Rating";

interface RackData {
  id: number;
  x: number;
  y: number;
  locked: boolean;
  qrData: string;
  productos: ProductoData[];
}

interface PaletData {
  id: number;
  x: number;
  y: number;
  locked: boolean;
  qrData: string;
  productos: ProductoData[];
}
interface ProductoData {
  productoId: string;
  nombre: string;
  precio: number;
  cantidadExistente: number;
  categoria?: number;
  proveedor: string;
  descripcion: string;
}
// Asegúrate de que este sea el nombre correcto del campo en tu respuesta de API

function Deposito() {
  const {
    data: productos,
    isLoading: isProductosLoading,
    isError: isProductosError,
  } = useGetProductosQuery();
  const {
    data: racksData,
    isLoading: isRacksLoading,
    isError: isRacksError,
  } = useGetRacksQuery();

  const [createRack] = useCreateRackMutation();

  const [racks, setRacks] = useState<RackData[]>([]);
  const [palet, setPalet] = useState<PaletData[]>([]);

  const [doors, setDoors] = useState<
    { x: number; y: number; visible: boolean }[]
  >([]);
  const [nextId, setNextId] = useState(1);
  const [nextId2, setNextId2] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState<{ [key: number]: boolean }>({});
  const [hoveredRackId, setHoveredRackId] = useState<number | null>(null);
  const [hoveredPaletId, setHoveredPaletId] = useState<number | null>(null);

  const qrRefs = useRef<{ [key: number]: HTMLDivElement | null }>({}); // refs por rack
  const [currentRackId, setCurrentRackId] = useState<number | null>(null);

  const [productoDetalle, setProductoDetalle] = useState<ProductoData | null>(
    null
  );

  useEffect(() => {
    if (racksData) {
      setRacks(racksData); // Actualiza el estado local con los racks obtenidos del backend
    }
  }, [racksData]);

  const guardarRackEnBaseDeDatos = async (rack: RackData) => {
    try {
      const response = await fetch("/api/racks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x: rack.x,
          y: rack.y,
          locked: rack.locked,
          qrData: rack.qrData,
          productos: rack.productos,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el rack");
      }

      const data = await response.json();
      console.log("Rack guardado:", data);
    } catch (error) {
      console.error(error);
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Abrir drawer de detalles
  const abrirDetalles = (producto: ProductoData) => {
    setProductoDetalle(producto);
  };

  // Cerrar drawer de detalles
  const cerrarDetalles = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Detiene la propagación del evento
    }
    setProductoDetalle(null);
  };

  const addRack = async () => {
    const nuevoRack = {
      id: racks.length + 1, // Genera un nuevo ID basado en la longitud de racks
      x: 0,
      y: 0,
      locked: false,
      qrData: `Rack-${racks.length + 1}`,
      productos: [], // Puedes asignar productos aquí si es necesario
    };

    try {
      const response = await createRack(nuevoRack).unwrap(); // Llama a la mutación
      console.log("Rack creado:", response);

      setRacks([...racks, response]); // Actualiza el estado local con el rack creado
    } catch (error) {
      console.error("Error al crear el rack:", error);
    }
  };

  const addPalet = () => {
    setPalet([
      ...palet,
      {
        id: nextId2,
        x: 0,
        y: 0,
        locked: false,
        qrData: `Palet-${nextId2}`,
        productos: productos.slice(3, 6), // Asigna otros 3 productos
      },
    ]);
    setNextId2(nextId2 + 1);
  };
  function borrarEntrada(index: number) {
    setDoors((prev) =>
      prev.map((door, i) => (i === index ? { ...door, visible: false } : door))
    );
  }

  const addDoor = () => {
    setDoors((prev) => [...prev, { x: 0, y: 0, visible: true }]);
  };

  const toggleDrawerRack = (id: number, open: boolean) => {
    console.log(`toggleDrawerRack llamado para id: ${id}, open: ${open}`);
    setDrawerOpen((prev) => ({
      ...prev,
      [id]: open,
    }));
    if (open) {
      setCurrentRackId(id); // setear rack actual para imprimir
    } else {
      setCurrentRackId(null);
    }
  };

  const toggleDrawerPalet = (id: number, open: boolean) => {
    setDrawerOpen((prev) => ({
      ...prev,
      [id]: open,
    }));
    if (open) {
      setCurrentRackId(id); // setear rack actual para imprimir
    } else {
      setCurrentRackId(null);
    }
  };

  const handlePrint = useReactToPrint({
    content: () =>
      currentRackId !== null ? qrRefs.current[currentRackId] : null,
    documentTitle: `Etiqueta-Rack-${currentRackId ?? ""}`,
    pageStyle: `
      @page {
        size: 60mm 40mm;
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

  const toggleLock = (id: number) => {
    setRacks((prev) => {
      const updated = prev.map((rack) =>
        rack.id === id ? { ...rack, locked: !rack.locked } : rack
      );

      // Esperamos que se actualice en la próxima microtarea
      setTimeout(() => {
        const rack = updated.find((r) => r.id === id);
        if (rack) {
          interact(`#rack-${id}`).draggable(!rack.locked);
        }
      }, 0);

      return updated;
    });
  };

  const togglePaletLock = (id: number) => {
    setPalet((prev) => {
      const updated = prev.map((palet) =>
        palet.id === id ? { ...palet, locked: !palet.locked } : palet
      );

      setTimeout(() => {
        const item = updated.find((p) => p.id === id);
        if (item) {
          interact(`#palet-${id}`).draggable(!item.locked);
        }
      }, 0);

      return updated;
    });
  };

  const deleteRack = (id: number) => {
    setRacks((prev) => prev.filter((rack) => rack.id !== id));
  };

  const deletepalet = (id: number) => {
    setPalet((prev) => prev.filter((p) => p.id !== id));
  };

  const applyInteract = (id: string) => {
    interact(id)
      .draggable({
        inertia: false,
        modifiers: [
          interact.modifiers.restrict({
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          }),
        ],
        listeners: {
          move(event) {
            const target = event.target as HTMLElement;
            const x =
              parseFloat(target.getAttribute("data-x") || "0") + event.dx;
            const y =
              parseFloat(target.getAttribute("data-y") || "0") + event.dy;
            const angle = parseFloat(target.getAttribute("data-angle") || "0");

            target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            target.setAttribute("data-x", x.toString());
            target.setAttribute("data-y", y.toString());
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            const target = event.target as HTMLElement;
            let { width, height } = event.rect;
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            const x =
              parseFloat(target.getAttribute("data-x") || "0") +
              event.deltaRect.left;
            const y =
              parseFloat(target.getAttribute("data-y") || "0") +
              event.deltaRect.top;
            const angle = parseFloat(target.getAttribute("data-angle") || "0");

            target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            target.setAttribute("data-x", x.toString());
            target.setAttribute("data-y", y.toString());
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 50, height: 50 },
            max: { width: 500, height: 500 },
          }),
        ],
      })
      .gesturable({
        listeners: {
          move(event) {
            const target = event.target as HTMLElement;
            const currentAngle = parseFloat(
              target.getAttribute("data-angle") || "0"
            );
            const newAngle = currentAngle + event.da;

            const x = parseFloat(target.getAttribute("data-x") || "0");
            const y = parseFloat(target.getAttribute("data-y") || "0");

            target.style.transform = `translate(${x}px, ${y}px) rotate(${newAngle}deg)`;
            target.setAttribute("data-angle", newAngle.toString());
          },
        },
      });
  };

  useEffect(() => {
    racks.forEach((rack) => {
      applyInteract(`#rack-${rack.id}`);
    });

    palet.forEach((p) => {
      applyInteract(`#palet-${p.id}`);
    });

    doors.forEach((door, index) => {
      if (door.visible) {
        applyInteract(`#door-${index}`);
      }
    });
  }, [racks, palet, doors]);

  return (
    <>
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          disableElevation
          style={{
            width: "200px",
            marginLeft: "20px",
            marginTop: "20px",
            backgroundColor: "#4cae40",
          }}
          onClick={addRack}
        >
          Agregar Rack
        </Button>

        <Button
          variant="contained"
          disableElevation
          style={{
            width: "200px",
            marginLeft: "20px",
            marginTop: "20px",
            backgroundColor: "#40aee5",
          }}
          onClick={addPalet}
        >
          Agregar Palet
        </Button>

        <Button
          variant="contained"
          disableElevation
          style={{
            width: "200px",
            marginLeft: "20px",
            marginTop: "20px",
          }}
          onClick={addDoor}
        >
          Agregar Puerta
        </Button>
      </div>

      <div
        style={{
          margin: "20px",
          border: "1px solid #ccc",
          backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 12%) 1px, transparent 1px),
            linear-gradient(rgb(204 204 204 / 16%) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundColor: "#5a5a5a",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "600px",
            overflow: "hidden",
          }}
        >
          {doors.map((door, index) =>
            door.visible ? (
              <div
                key={index}
                id={`door-${index}`} // 👈 ID único para usar en interact
                style={{
                  width: "40px",
                  height: "40px",
                  position: "absolute",
                  left: door.x,
                  top: door.y,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img src="entrada.png" alt="Entrada" width="150px" />
                  <button onClick={() => borrarEntrada(index)}>❌</button>
                </div>
              </div>
            ) : null
          )}

          {palet.map((p) => (
            <div
              key={p.id}
              id={`palet-${p.id}`}
              className="palet-container"
              onMouseEnter={() => setHoveredPaletId(p.id)} // Usar hoveredPaletId
              onMouseLeave={() => setHoveredPaletId(null)} // Usar hoveredPaletId
              style={{
                width: "100px",
                height: "100px",
                position: "absolute",
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                backgroundColor: p.locked ? "#40aee5" : "#42b0f5",
                cursor: p.locked ? "not-allowed" : "move",
                userSelect: "none",
                borderRadius: "10px",
                transition: "transform 0.05s linear",
                border: "5px solid transparent",
                backgroundImage: `
                linear-gradient(#40aee5, #40aee5),
                repeating-linear-gradient(
                45deg,
                red 0,
                red 10px,
                yellow 10px,
                yellow 20px
        )
      `,
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
              data-x={p.x}
              data-y={p.y}
            >
              Palet {p.id}
              <AnimatePresence>
                {/* Usar hoveredPaletId para mostrar los botones */}
                {hoveredPaletId === p.id && (
                  <motion.div
                    key="palet-buttons"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      transform: "translateY(-50%)",
                      display: "flex",
                      padding: "5px",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        backgroundColor: p.locked ? "#ccc" : "#4cae40",
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => togglePaletLock(p.id)}
                      aria-pressed={p.locked}
                    >
                      {p.locked ? <Move /> : <Lock />}
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => deletepalet(p.id)}
                    >
                      <Trash size={16} />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => toggleDrawerPalet(p.id, true)}
                    >
                      <Eye size={16} />
                    </Button>
                  </motion.div>
                )}
                <Drawer
                  anchor="bottom"
                  open={drawerOpen[p.id] || false}
                  onClose={() => toggleDrawerPalet(p.id, false)}
                  PaperProps={{
                    sx: {
                      backgroundColor: "rgba(176, 176, 176, 0.38)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "none",
                    },
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "500px",
                      padding: 16,
                    }}
                  >
                    <h2>Productos en Palet {p.id}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                      {p.productos.map((producto) => (
                        <div
                          key={producto.productoId}
                          className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
                        >
                          <h3 className="text-lg text-gray-900 font-semibold">
                            {producto.nombre}
                          </h3>
                          <p className="text-gray-800">
                            ${producto.precio.toFixed(2)}
                          </p>
                          <div className="text-sm text-gray-600 mt-1">
                            Stock: {producto.cantidadExistente}
                          </div>
                          {producto.categoria && (
                            <div className="flex items-center mt-2">
                              <span className="text-gray-600">
                                Categoría: {producto.categoria}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => toggleDrawerPalet(p.id, false)}
                      fullWidth
                    >
                      Cerrar
                    </Button>
                  </div>
                </Drawer>
              </AnimatePresence>
            </div>
          ))}

          {racks.map((rack) => (
            <div
              key={rack.id}
              id={`rack-${rack.id}`}
              className="rack-container"
              onMouseEnter={() => setHoveredRackId(rack.id)}
              onMouseLeave={() => setHoveredRackId(null)}
              style={{
                width: "100px",
                height: "100px",
                position: "absolute",
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                backgroundColor: rack.locked ? "#4cae40 " : "#4caf50",
                cursor: rack.locked ? "not-allowed" : "move",
                userSelect: "none",
                borderRadius: "10px",
                transition: "transform 0.05s linear",
                border: "5px solid transparent",
                backgroundImage: `
                linear-gradient(#4cae40, #4cae40),
                repeating-linear-gradient(
                  45deg,
                  red 0,
                  red 10px,
                  yellow 10px,
                  yellow 20px
                )
              `,
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
              data-x="0"
              data-y="0"
            >
              Rack {rack.id}
              <AnimatePresence>
                {/* Botones visibles solo en hover */}
                {hoveredRackId === rack.id && (
                  <motion.div
                    key="rack-buttons"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: "absolute",
                      left: "0", // al lado derecho del rack
                      top: "0",
                      transform: "translateY(-50%)",
                      display: "flex",
                      padding: "5px",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      style={{
                        backgroundColor: rack.locked ? "#ccc" : "#4cae40",
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => toggleLock(rack.id)}
                      aria-pressed={rack.locked}
                    >
                      {rack.locked ? <Move /> : <Lock />}
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => deleteRack(rack.id)}
                    >
                      <Trash size={16} />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => toggleDrawerRack(rack.id, true)}
                    >
                      <Eye size={16} />
                    </Button>
                  </motion.div>
                )}
                <Drawer
                  anchor="bottom"
                  open={drawerOpen[rack.id] || false}
                  onClose={() => toggleDrawerRack(rack.id, false)}
                  PaperProps={{
                    sx: {
                      backgroundColor: "rgba(245, 253, 250, 0.3)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    },
                  }}
                >
                  <div className="w-full h-[500px] p-6">
                    {/* Encabezado */}
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#4cae40] to-[#3a9a36] p-4 mb-6 shadow-md">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                        <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-white">
                          Productos en Rack{" "}
                          <span className="text-cyan-50 text-xl sm:text-2xl md:text-3xl">
                            {rack.id}
                          </span>
                        </h2>
                      </div>

                      <div
                        ref={(el) => (qrRefs.current[rack.id] = el)}
                        className="flex items-center space-x-3 bg-white/20 p-3 rounded-lg transition-all hover:bg-white/30"
                      >
                        <Button onClick={handleOpen}>
                          <div className="bg-white p-1 rounded">
                            <QRCodeSVG
                              value={rack.qrData}
                              size={32}
                              level="H"
                              fgColor="#3a9a36"
                              bgColor="transparent"
                            />
                          </div>
                        </Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 400,
                              bgcolor: "rgba(245, 253, 250, 0.8)",
                              border: "2px solid #000",
                              boxShadow: 24,
                              backdropFilter: "blur(10px)",
                              alignItems: "center",
                              borderRadius: "8px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              margin: "5px",
                            }}
                          >
                            <>
                              <Typography
                                id="modal-modal-title"
                                variant="h4"
                                component="h2"
                                m={1}
                              >
                                {rack.qrData}
                              </Typography>
                              <QRCodeSVG
                                value={rack.qrData}
                                size={100}
                                level="H"
                                fgColor="#000"
                                bgColor="transparent"
                              />
                              <Button
                                variant="contained"
                                onClick={handlePrint}
                                sx={{
                                  backgroundColor: "white",
                                  color: "#3a9a36",
                                  fontWeight: "medium",
                                  textTransform: "none",
                                  fontSize: "0.875rem",
                                  margin: "20px",
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  "&:hover": {
                                    backgroundColor: "#f0f7ef",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                  },
                                }}
                                startIcon={
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                  </svg>
                                }
                              >
                                Imprimir QR
                              </Button>
                            </>
                          </Box>
                        </Modal>
                      </div>
                    </div>

                    {/* Lista de Productos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rack.productos.map((producto) => (
                        <div
                          key={producto.productoId}
                          className="
        border border-gray-200 bg-white rounded-xl shadow-sm
        overflow-hidden transition-all duration-300
        hover:shadow-md hover:-translate-y-1
        group relative
      "
                        >
                          {/* Badge para stock bajo */}
                          {producto.cantidadExistente < 10 && (
                            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              ¡Últimas unidades!
                            </div>
                          )}

                          <div className="p-5">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#4cae40] transition-colors">
                                {producto.nombre}
                              </h3>
                              <span className="bg-[#e8f5e9] text-[#2e7d32] text-sm font-medium px-2.5 py-0.5 rounded-full">
                                ${producto.precio.toFixed(2)}
                              </span>
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center text-gray-600">
                                <svg
                                  className="w-4 h-4 mr-2 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                  />
                                </svg>
                                <span>
                                  Stock:{" "}
                                  <span className="font-medium">
                                    {producto.cantidadExistente}
                                  </span>
                                </span>
                              </div>

                              {producto.categoria && (
                                <div className="flex items-center text-gray-600">
                                  <svg
                                    className="w-4 h-4 mr-2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                    />
                                  </svg>
                                  <span>
                                    Categoría:{" "}
                                    <span className="font-medium">
                                      {producto.categoria}
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Barra de progreso */}
                            <div className="mt-4">
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className="bg-[#4cae40] h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (producto.cantidadExistente / 900000) *
                                        100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 text-right">
                                {producto.cantidadExistente}/900000 unidades
                              </p>
                              <div className="p-4 border-t border-gray-100">
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  onClick={() => abrirDetalles(producto)}
                                  sx={{
                                    color: "#4cae40",
                                    borderColor: "#4cae40",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(76, 174, 64, 0.08)",
                                      borderColor: "#3a9a36",
                                    },
                                  }}
                                >
                                  Ver características
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Botón de Cierre */}
                    <Button
                      variant="contained"
                      onClick={() => toggleDrawerRack(rack.id, false)}
                      fullWidth
                      sx={{
                        marginTop: "24px",
                        color: "white",
                        padding: "10px",
                        borderRadius: "8px",
                        fontWeight: "medium",

                        backgroundColor: "#eb0202",
                        "&:hover": { backgroundColor: "#ef1d1d" },
                      }}
                    >
                      Cerrar
                    </Button>
                  </div>
                </Drawer>

                <Drawer
                  anchor="right"
                  open={!!productoDetalle}
                  onClose={(e, reason) => {
                    // Solo cerrar con clic fuera o escape
                    if (
                      reason === "backdropClick" ||
                      reason === "escapeKeyDown"
                    ) {
                      cerrarDetalles();
                    }
                  }}
                  PaperProps={{
                    sx: {
                      backgroundColor: "rgba(245, 253, 250, 0.3)",
                      backdropFilter: "blur(20px)",
                      boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
                      width: { xs: "100%", sm: "400px" },
                    },
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {productoDetalle && (
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {productoDetalle.nombre}
                        </h2>
                        <Button
                          onClick={cerrarDetalles}
                          color="error"
                          size="small"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      </div>

                      <div className="flex-grow space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="font-medium text-gray-700 mb-2">
                            Información Básica
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Precio:</span>
                              <span className="font-medium text-teal-50">
                                ${productoDetalle.precio.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Stock:</span>
                              <span className="font-medium text-teal-50">
                                {productoDetalle.cantidadExistente}
                              </span>
                            </div>
                            {productoDetalle.categoria && (
                              <div className="flex justify-between">
                                <span className="text-gray-500 ">
                                  Categoría:
                                </span>
                                <span className="flex font-medium text-teal-50">
                                  {
                                    <Rating
                                      rating={productoDetalle.categoria}
                                    />
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="font-medium text-gray-700 mb-2">
                            Descripción
                          </h3>
                          <p className="text-gray-600">
                            {productoDetalle.descripcion ||
                              "No hay descripción disponible."}
                          </p>
                        </div>

                        {/* Sección adicional para más características */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="font-medium text-gray-700 mb-2">
                            Especificaciones
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-sm text-gray-500">SKU</p>
                              <p className="font-medium text-teal-50">
                                {productoDetalle.productoId}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Proveedor</p>
                              <p className="font-medium text-teal-50">
                                {productoDetalle.proveedor || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{
                            backgroundColor: "#eb0202",
                            "&:hover": { backgroundColor: "#ef1d1d" },
                          }}
                          onClick={cerrarDetalles}
                        >
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  )}
                </Drawer>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Deposito;
