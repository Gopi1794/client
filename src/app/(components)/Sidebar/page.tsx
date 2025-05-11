"use client";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  SlidersHorizontal,
  User,
  Box,
} from "lucide-react";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../../../i18n"; // Asegura que se inicializa

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  labelKey: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  labelKey,
  isCollapsed,
}: SidebarLinkProps) => {
  const { t } = useTranslation(); // ⬅ Obtén la función de traducción
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
    hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
      isActive ? "bg-blue-200 text-white" : ""
    }`}
      >
        <Icon className="w-6 h-6 !text-gray-700"></Icon>
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {t(labelKey)} {/* ⬅ Traducimos la clave */}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassName = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassName} style={{ paddingTop: "50px" }}>
      {/* TOP LOGO*/}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <div>Logo</div>
        <h1
          className={`font-extrabold text-2xl ${
            isSidebarCollapsed ? "hidden" : "block"
          }`}
        >
          GGDev
        </h1>
      </div>

      {/* LINK */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          labelKey="sidebar.dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/inventario"
          icon={Archive}
          labelKey="sidebar.inventory"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/productos"
          icon={Clipboard}
          labelKey="sidebar.products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/usuarios"
          icon={User}
          labelKey="sidebar.users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/configuracion"
          icon={SlidersHorizontal}
          labelKey="sidebar.settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/gastos"
          icon={CircleDollarSign}
          labelKey="sidebar.expenses"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/deposito"
          icon={Box}
          labelKey="sidebar.warehouse"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2025 gg.dev</p>
      </div>
    </div>
  );
};

export default Sidebar;
