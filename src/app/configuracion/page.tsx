"use client";

import React, { useState } from "react";
import Header from "../(components)/Header/header";
import { setIsDarkMode } from "@/state";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { useTranslation } from "react-i18next";
import "../../i18n"; // Importa i18n para inicializarlo

type ConfiguracionesDeUsuario = {
  label: string;
  key: string;
  value: string | boolean;
  type: "text" | "toggle";
};

const Configuracion = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [configuracionesDeUsuario, setConfiguracionesDeUsuario] = useState<
    ConfiguracionesDeUsuario[]
  >([
    {
      label: t("username"),
      key: "username",
      value: "GG_developer",
      type: "text",
    },
    {
      label: t("email"),
      key: "email",
      value: "gg.developer.full@gmail.com",
      type: "text",
    },
    {
      label: t("notifications"),
      key: "notifications",
      value: true,
      type: "toggle",
    },
    { label: t("darkMode"), key: "darkMode", value: false, type: "toggle" },
    { label: t("language"), key: "language", value: "es", type: "text" },
  ]);

  const handleToggleChange = (index: number) => {
    const configuracionesCopy = [...configuracionesDeUsuario];
    configuracionesCopy[index].value = !configuracionesCopy[index]
      .value as boolean;
    setConfiguracionesDeUsuario(configuracionesCopy);
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const flagSrc =
    i18n.language === "es"
      ? "https://flagcdn.com/32x24/es.png"
      : "https://flagcdn.com/32x24/gb.png";

  return (
    <div className="w-full">
      <Header name={t("userSettings")} />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t("configuration")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {t("values")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {configuracionesDeUsuario.map((setting, index) => (
              <tr key={setting.key} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {setting.label}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={
                          setting.key === "darkMode"
                            ? isDarkMode
                            : (setting.value as boolean)
                        }
                        onChange={() => {
                          if (setting.key === "darkMode") {
                            toggleDarkMode();
                          } else {
                            handleToggleChange(index);
                          }
                        }}
                      />
                      <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  ) : setting.key === "language" ? (
                    <div className="flex items-center space-x-2">
                      <img
                        src={flagSrc}
                        alt="Flag"
                        width="20"
                        height="15"
                        className="rounded-sm"
                      />
                      <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm text-sm border py-1 px-2"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm text-sm border py-1 px-2"
                      value={setting.value as string}
                      onChange={(e) => {
                        const settingCopy = [...configuracionesDeUsuario];
                        settingCopy[index].value = e.target.value;
                        setConfiguracionesDeUsuario(settingCopy);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Configuracion;
