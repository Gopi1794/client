"use client";

import { useTranslation } from "react-i18next";
import CardPopularProducts from "./cardPopularProducts";
import CardResumenDeVentas from "./cardResumenDeVentas";
import CardResumenDeCompras from "./cardResumenDeCompras";
import CardResumenDeGastos from "./cardResumenDeGastos";
import StatCard from "./statCard";
import {
  CheckCircle,
  Package,
  TagIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const { t } = useTranslation();

  // Obtener la fecha actual y restar dos días
  const formatDate = (date: Date) =>
    date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const today = new Date();
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const dateRange = `${formatDate(twoDaysAgo)} - ${formatDate(today)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardResumenDeVentas />
      <CardResumenDeCompras />
      <CardResumenDeGastos />
      <StatCard
        title={t("stats.clientExpenses")}
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange={dateRange}
        details={[
          {
            title: t("stats.clientExpenses"),
            amount: "175.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: t("stats.expenses"),
            amount: "100.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title={t("stats.duesAndPendingOrders")}
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange={dateRange}
        details={[
          {
            title: t("stats.membershipFee"),
            amount: "250.00",
            changePercentage: 120,
            IconComponent: TrendingUp,
          },
          {
            title: t("stats.pendingOrders"),
            amount: "10.00",
            changePercentage: -30,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title={t("stats.salesAndDiscounts")}
        primaryIcon={<TagIcon className="text-blue-600 w-6 h-6" />}
        dateRange={dateRange}
        details={[
          {
            title: t("stats.sales"),
            amount: "1000.00",
            changePercentage: 154,
            IconComponent: TrendingUp,
          },
          {
            title: t("stats.discounts"),
            amount: "200.00",
            changePercentage: -17,
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
