"use client";

import { useGetGastosPorCategoriaQuery } from "@/state/api";
import { Skeleton } from "@mui/material";
import { useMemo, useState } from "react";

const Gastos = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectCategoria, setSelectCategoria] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const {
    data: gastosData,
    isError,
    isLoading,
  } = useGetGastosPorCategoriaQuery();

  const gastos = useMemo(() => gastosData ?? [], [gastosData]);

  if (isLoading) {
    return (
      // ✅ Agregar return para que el Skeleton se renderice
      <Skeleton
        sx={{
          bgcolor: "grey.900",
          width: "100%",
          height: "100%",
        }}
        variant="rectangular"
      />
    );
  }
  if (isError || !gastosData) {
    return (
      <div className="text-center text-red-500 py-4">
        Fallo la captura de agastos
      </div>
    );
  }
};

export default Gastos;
