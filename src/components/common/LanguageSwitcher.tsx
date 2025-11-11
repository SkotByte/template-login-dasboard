import React from "react";
import { Button, Dropdown, Flex } from "antd";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const languages = [
    {
      key: "en",
      label: "English",
      flag: "/public/icons/flags/united-kingdom.png",
    },
    {
      key: "th",
      label: "ไทย",
      flag: "/public/icons/flags/thailand.png",
    },
    {
      key: "lo",
      label: "ລາວ",
      flag: "/public/icons/flags/laos.png",
    },
  ];

  const currentLanguage =
    languages.find((lang) => lang.key === i18n.language) || languages[0];

  const handleLanguageChange = (langKey: string) => {
    i18n.changeLanguage(langKey);
  };

  const items: MenuProps["items"] = languages.map((lang) => ({
    key: lang.key,
    label: (
      <Flex align="center" gap={10}>
        <img className="w-4 h-4" src={lang.flag} alt={lang.label} />
        <span>{lang.label}</span>
      </Flex>
    ),
    onClick: () => handleLanguageChange(lang.key),
  }));

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
      <Button
        shape="circle"
        icon={<img className="w-8" src={currentLanguage.flag} alt="Language Flag" />}
      />
    </Dropdown>
  );
};

export default LanguageSwitcher;
