"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GuardSpinner } from "react-spinners-kit"; // Elegí el spinner que más te guste

const RouteLoader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // Forzado para verlo

  useEffect(() => {
    // Forzar loader visible mientras desarrollás
    // Comentá el siguiente bloque si querés que se mantenga siempre
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(128, 128, 128, 0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <GuardSpinner
        size={50}
        backColor="rgba(128, 128, 128, 24)"
        loading={true}
      />
    </div>
  );
};

export default RouteLoader;
