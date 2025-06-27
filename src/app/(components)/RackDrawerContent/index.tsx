import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { Package, X, Layers, Info } from "lucide-react";
import type { Rack } from "@/state/api";

function RackDrawerContent({
  rack,
  onClose,
}: {
  rack: Rack;
  onClose?: () => void;
}) {
  const [selectedFloor, setSelectedFloor] = useState(
    rack.floors && rack.floors.length > 0 ? rack.floors[0].id : null
  );

  useEffect(() => {
    setSelectedFloor(
      rack.floors && rack.floors.length > 0 ? rack.floors[0].id : null
    );
  }, [rack]);

  const floor = useMemo(
    () => rack.floors?.find((f) => f.id === selectedFloor),
    [rack.floors, selectedFloor]
  );

  return (
    <Box
      className="p-6 h-full flex flex-col"
      sx={{
        minHeight: "100vh",
        background: "transparent",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header */}
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" fontWeight={700} color="#1976d2">
          Rack #{rack.id}
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <X className="h-6 w-6 text-gray-500" />
          </IconButton>
        )}
      </Box>

      {/* Selector de piso */}
      <Box className="mb-4">
        <FormControl fullWidth>
          <InputLabel>Piso</InputLabel>
          <Select
            value={selectedFloor ?? ""}
            label="Piso"
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            sx={{
              bgcolor: "rgba(255,255,255,0.7)",
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            {rack.floors.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                <Chip
                  label={f.name}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                Nivel {f.level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Contenido principal */}
      <Box className="flex-grow overflow-y-auto space-y-4">
        {/* Información básica del rack */}
        <Paper
          className="bg-white p-4 rounded-lg border border-gray-200"
          elevation={2}
        >
          <Typography
            className="font-medium text-gray-700 mb-3 flex items-center"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            Información del Rack
          </Typography>
          <Box className="space-y-2">
            <Box className="flex justify-between">
              <span className="text-gray-500">Posición:</span>
              <span className="font-medium text-gray-900">
                ({rack.x}, {rack.y})
              </span>
            </Box>
            <Box className="flex justify-between">
              <span className="text-gray-500">Tamaño:</span>
              <span className="font-medium text-gray-900">
                {rack.width} x {rack.height}
              </span>
            </Box>
            <Box className="flex justify-between">
              <span className="text-gray-500">Estado:</span>
              <Chip
                label={rack.locked ? "Bloqueado" : "Activo"}
                color={rack.locked ? "default" : "success"}
                size="small"
              />
            </Box>
            <Box className="flex justify-between">
              <span className="text-gray-500">Pisos:</span>
              <span className="font-medium text-gray-900">
                {rack.floors.length}
              </span>
            </Box>
          </Box>
        </Paper>

        {/* Productos del piso seleccionado */}
        <Paper
          className="bg-white p-4 rounded-lg border border-gray-200"
          elevation={2}
        >
          <Typography
            className="font-medium text-gray-700 mb-3 flex items-center"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <Layers className="h-5 w-5 mr-2 text-blue-500" />
            Productos en {floor?.name || "Piso"}
          </Typography>
          {floor && floor.ubicaciones && floor.ubicaciones.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {floor.ubicaciones.map((ubicacion) => (
                <Paper
                  key={ubicacion.id}
                  elevation={1}
                  className="flex items-center gap-3 p-2 rounded-lg border border-gray-100"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.85)",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    <Package size={20} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {ubicacion.producto.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {ubicacion.producto.productoId}
                    </Typography>
                  </Box>
                  <Chip
                    label={`Cantidad: ${ubicacion.cantidad}`}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                pl: 2,
                mt: 2,
                fontStyle: "italic",
                opacity: 0.7,
              }}
            >
              No hay productos en este piso
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Botón para cerrar */}
      {onClose && (
        <Box className="mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<X className="h-5 w-5" />}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Cerrar
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default RackDrawerContent;
