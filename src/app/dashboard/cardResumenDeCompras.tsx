import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import "../../i18n";
import i18n from "../../i18n";

const CardResumenDeCompras = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetDashboardMetricsQuery();
  const purchaseData = data?.resumenDeCompras || [];
  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;

  return (
    <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <Skeleton
          sx={{
            bgcolor: "grey.900",
            width: "100%",
            height: "100%",
          }}
          variant="rectangular"
        />
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              {t("cardResumen.title")}{" "}
              {/* Clave de traducción para "Resumen de Compras" */}
            </h2>
            <hr />
          </div>
          {/* BODY */}
          <div>
            <div className="mb-4 mt-7 px-7">
              <p className="text-xs text-gray-400">{t("cardResumen.bought")}</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">
                  {lastDataPoint
                    ? numeral(lastDataPoint.totalComprado).format("$0.00a")
                    : "0"}
                </p>
                {lastDataPoint && (
                  <p
                    className={`text-sm ${
                      lastDataPoint.porcentajeDeCambio! >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    } flex ml-3`}
                  >
                    {lastDataPoint.porcentajeDeCambio! >= 0 ? (
                      <TrendingUp className="w-5 h-5 mr-2" />
                    ) : (
                      <TrendingDown className="w-5 h-5 mr-2" />
                    )}
                    {Math.abs(lastDataPoint.porcentajeDeCambio ?? 0)}%
                  </p>
                )}
              </div>
            </div>

            {/* CHART */}
            <div className="px-7 h-[145px]">
              <ResponsiveContainer width="100%">
                <AreaChart
                  data={purchaseData}
                  margin={{ top: 0, right: 0, left: -50, bottom: 45 }}
                >
                  <XAxis dataKey="fecha" tick={false} axisLine={false} />
                  <YAxis tickLine={false} tick={false} axisLine={false} />
                  <Tooltip
                    formatter={(value: number) =>
                      `$${value.toLocaleString("es")}`
                    }
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "8px",
                      padding: "10px",
                      color: "#fff",
                      backdropFilter: "blur(10px)",
                    }}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString(i18n.language, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }}
                  />
                  <Area
                    type="linear"
                    dataKey="totalComprado"
                    stroke="#fff"
                    fill="#8884d8"
                    dot={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardResumenDeCompras;
