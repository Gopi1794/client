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
      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                {t("configuration")}
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                {t("values")}
              </th>
            </tr>
          </thead>
          <tbody>
            {configuracionesDeUsuario.map((setting, index) => (
              <tr className="hover:bg-blue-50" key={setting.key}>
                <td className="py-2 px-4">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative item-center cursor-pointer">
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
                      <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : setting.key === "language" ? (
                    <div className="flex items-center">
                      <img
                        src={flagSrc}
                        alt="Flag"
                        width="24"
                        height="18"
                        className="mr-2"
                      />
                      <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-blue-500"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-blue-500"
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
