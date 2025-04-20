import { useTranslation } from "react-i18next";

type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  const { t } = useTranslation(); // ⬅ Obtén la función de traducción

  return <h1 className="text-2xl font-semibold text-gray-700">{t(name)}</h1>;
};

export default Header;
