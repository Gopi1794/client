import { useGetDashboardMetricsQuery } from "../../state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n"; // Asegura que se inicializa

import Skeleton from "@mui/material/Skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardResumenDeVentas = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const salesData = data?.resumenDeVentas || [];

  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum =
    salesData.reduce((acc, curr) => acc + curr.valorTotal, 0) || 0;

  const averageChangePercentage =
    salesData.reduce((acc, curr, _, array) => {
      return acc + (curr.porcentajeDeCambio || 0) / array.length;
    }, 0) || 0;

  const highestValueData = salesData.reduce((acc, curr) => {
    return acc.valorTotal > curr.valorTotal ? acc : curr;
  }, salesData[0] || {});

  const highestValueDate = highestValueData.fecha
    ? new Date(highestValueData.fecha).toLocaleDateString(i18n.language, {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return <div className="m-5">{t("error.fetchData")}</div>;
  }

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <Skeleton
          sx={{ bgcolor: "grey.900", width: "100%", height: "100%" }}
          variant="rectangular"
        />
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              {t("sales.summary")}
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">{t("sales.value")}</p>
                <span className="text-2xl font-extrabold">
                  $
                  {(totalValueSum / 1000000).toLocaleString(i18n.language, {
                    maximumFractionDigits: 2,
                  })}
                  {t("sales.millions")}
                </span>
                <span className="text-green-500 text-sm ml-2">
                  <TrendingUp className="inline w-4 h-4 mr-1" />
                  {averageChangePercentage.toFixed(2)}%
                </span>
              </div>
              <select
                className="shadow-sm border border-gray-300 bg-white p-1 rounded"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="daily">{t("time.daily")}</option>
                <option value="weekly">{t("time.weekly")}</option>
                <option value="monthly">{t("time.monthly")}</option>
              </select>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={350} className="px-7">
              <BarChart
                data={salesData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="fecha"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString(i18n.language, {
                      month: "numeric",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  tickFormatter={(value) => {
                    return `$${(value / 1000000).toFixed(0)}m`;
                  }}
                  tick={{ fontSize: 12, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString(i18n.language)}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString(i18n.language, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "8px",
                    padding: "10px",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                  }}
                  itemStyle={{ color: "white", padding: "5px" }}
                />
                <Bar
                  dataKey="valorTotal"
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div>
            <hr />
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p>{t("sales.days", { count: salesData.length || 0 })}</p>
              <p className="text-sm">
                {t("sales.highestDate")}:{" "}
                <span className="font-bold">{highestValueDate}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardResumenDeVentas;
