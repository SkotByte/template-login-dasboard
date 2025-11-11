import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  message,
  Flex,
  Popover,
  Typography,
  Card,
  Button,
  Divider,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "react-i18next";
import { getMenuItems } from "./MenuItems";
import LanguageSwitcher from "../common/LanguageSwitcher";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { Menu as MenuIcon } from "lucide-react";

const { Sider, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const menuItems = getMenuItems();
  const [openProfile, setOpenProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Profile menu actions
  const profileMenuActions = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("profile.View Profile"),
      onClick: () => {
        setOpenProfile(false);
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("profile.Settings"),
      onClick: () => {
        setOpenProfile(false);
      },
    },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-600" />,
      label: t("profile.Logout"),
      onClick: async () => {
        setOpenProfile(false);
        await logout();
        message.success("Logged out successfully");
      },
    },
  ];

  const contentProfile = (
    <Card style={{ width: 280 }}>
      <Flex vertical gap={16}>
        {/* User Info Section */}
        <Flex vertical align="center" gap={8}>
          <Avatar size={64} className="bg-blue-500">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
          </Avatar>
          <Flex vertical align="center" gap={2}>
            <Text strong style={{ fontSize: "16px" }}>
              {user?.name}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {user?.email}
            </Text>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              {user?.role}
            </Text>
          </Flex>
        </Flex>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #f0f0f0", margin: "8px 0" }} />

        {/* Settings Section */}
        <Flex vertical gap={12}>
          <Text strong style={{ fontSize: "13px" }}>
            {t("profile.Settings")}
          </Text>
          <Flex gap={8}>
            <Flex vertical align="center" gap={4} style={{ flex: 1 }}>
              <ThemeSwitcher />
              <Text style={{ fontSize: "11px" }}>{t("profile.Theme")}</Text>
            </Flex>
            <Flex vertical align="center" gap={4} style={{ flex: 1 }}>
              <LanguageSwitcher />
              <Text style={{ fontSize: "11px" }}>{t("profile.Language")}</Text>
            </Flex>
          </Flex>
        </Flex>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #f0f0f0", margin: "8px 0" }} />

        {/* Actions */}
        <Flex vertical gap={8}>
          {profileMenuActions.map((action) => (
            <>
              {action.key === "logout" && <Divider style={{ padding: 0, margin: 0 }}/>}
              <Button
                key={action.key}
                danger={action.key === "logout"}
                type="text"
                onClick={action.onClick}
                icon={action.icon}
                style={{ justifyContent: "flex-start" }}
              >
                {action.label}
              </Button>
            </>
          ))}
        </Flex>
      </Flex>
    </Card>
  );

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "toggle-menu") {
      setCollapsed(!collapsed);
      return;
    }
    navigate(key);
  };

  // Toggle button to menu items
  const menuItemsWithToggle = [
    {
      key: "toggle-menu",
      icon: (
        <Flex align="center" justify="center">
          <MenuIcon
            size={15}
            className={`${
              collapsed ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
        </Flex>
      ),
      label: collapsed ? "" : "Menu",
      title: "",
    },
    ...menuItems,
  ];

  return (
    <Layout className="h-screen overflow-hidden">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={50}
        width={200}
        className="h-screen transition-all duration-300 relative overflow-hidden"
      >
        <Menu
          className="h-full overflow-y-auto flex flex-col"
          selectedKeys={[location.pathname]}
          items={menuItemsWithToggle}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout className="h-screen overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-4 py-2 shadow-sm shrink-0">
          <img src="/" alt="LOGO" />

          {/* Profile section */}
          <div className="flex gap-5">
            <Popover
              trigger="click"
              open={openProfile}
              onOpenChange={setOpenProfile}
              placement="bottomRight"
              content={contentProfile}
              className="cursor-pointer"
            >
              <Flex justify="between" align="center" gap={10}>
                {!isMobile && (
                  <Flex className="text-end" vertical justify="end" gap={0}>
                    <Text style={{ fontSize: "12px" }} strong>
                      {" "}
                      {user?.name}{" "}
                    </Text>
                    <Text style={{ fontSize: "12px" }}>{user?.email}</Text>
                  </Flex>
                )}
                <Avatar size={"large"}>
                  {user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <UserOutlined />
                  )}
                </Avatar>
              </Flex>
            </Popover>
          </div>
        </div>

        {/* Main content */}
        <Content className="m-4 p-6 flex-1 rounded-lg overflow-y-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
