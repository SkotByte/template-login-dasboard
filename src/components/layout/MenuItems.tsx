import { DashboardOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";

export const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/products',
            icon: <ShoppingOutlined />,
            label: 'Products',
        },
        {
            key: '/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Orders',
        },
        {
            key: '/customers',
            icon: <UserOutlined />,
            label: 'Customers',
        },
    ]