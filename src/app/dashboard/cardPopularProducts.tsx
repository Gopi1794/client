import { ShoppingBagIcon } from "lucide-react";
import { useGetDashboardMetricsQuery } from "../../state/api";
import React from "react";
import Rating from "../(components)/Rating";
import Skeleton from "@mui/material/Skeleton";
import { useTranslation } from "react-i18next";
import "../../i18n"; // Asegura que se inicializa

const CardPopularProducts = () => {
  const { t } = useTranslation();
  const {
    data: dashboardMetrics,
    isLoading,
    error,
  } = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
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
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            {t("popularProducts.title")} {/* ⬅ Traducción */}
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {dashboardMetrics?.productosPopulares.map((producto) => (
              <div
                key={producto.productoId}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
              >
                <div className="flex items-center gap-3">
                  <div>img</div>
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">
                      {producto.nombre}
                    </div>
                    <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        ${producto.precio}
                      </span>
                      <span className="mx-2">|</span>
                      <Rating rating={producto.categoria || 0} />
                    </div>
                  </div>
                </div>

                <div className="text xs flex items-center">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <ShoppingBagIcon className="w-4 h-4" />
                  </button>
                  {Math.round(producto.cantidadExistente / 1000)}{" "}
                  {t("popularProducts.sold")}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;
