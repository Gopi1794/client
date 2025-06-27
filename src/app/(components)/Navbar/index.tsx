"use client";
import { Bell, Menu, Moon, Settings, Sun } from "lucide-react";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetProductosQuery } from "@/state/api";

import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const { data: productos = [], isLoading } = useGetProductosQuery(
    {
      searchTerm,
      page: 1,
      limit: 10,
      categoria: "",
      proveedor: "",
      precioMin: 0,
      precioMax: 0,
    },
    { skip: searchTerm.length < 3 }
  );

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 2);
  };

  const handleSelect = (productoId) => {
    setShowDropdown(false);
    setSearchTerm("");
    router.push(`/productos/${productoId}`);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-16 bg-white shadow-md px-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "10px",
        color: "#fff",
        backdropFilter: "blur(10px)",
      }}
    >
      {/*LADO IZQUIERDO*/}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-blue-500 rounded-full hover:bg-blue-500"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => searchTerm.length > 2 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Busca tu grupo de productos o productos"
            className="pl-10 pr-4 py-2 w-50 md:w-80 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 font flex items-center pointer-events-none">
            <Bell className="text-gray-500" size={20} />
          </div>

          {showDropdown && productos.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
              {productos.map((producto) => (
                <div
                  key={producto.productoId}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={() => handleSelect(producto.productoId)}
                >
                  {producto.nombre}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/*LADO DERECHO*/}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <button onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Sun className="cursor-pointer text-white" size={24} />
            ) : (
              <Moon className="cursor-pointer text-white" size={24} />
            )}
          </button>

          <div className="relative">
            <Bell className="cursor-pointer text-white" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-[#ffff] bg-red-400 rounded-full">
              3
            </span>
          </div>

          <hr className="w-0 h-7 border border-solid border-1 border-gray-300 mx-3" />

          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9">image</div>
            <span className="font-semibold">GG Dev</span>
          </div>
        </div>

        <Link href="/setting">
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
