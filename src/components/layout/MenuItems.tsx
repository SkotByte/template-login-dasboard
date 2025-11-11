import { DashboardOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import i18n from '../../i18n'

export const getMenuItems = () => [
    {
        key: '/',
        icon: <DashboardOutlined />,
        label: i18n.t('menu.dashboard'),
        title: i18n.t('menu.dashboard'),
    },
    {
        key: '/products',
        icon: <ShoppingOutlined />,
        label: i18n.t('menu.products'),
        title: i18n.t('menu.products'),
    },
    {
        key: '/orders',
        icon: <ShoppingCartOutlined />,
        label: i18n.t('menu.orders'),
        title: i18n.t('menu.orders'),
    },
    {
        key: '/customers',
        icon: <UserOutlined />,
        label: i18n.t('menu.customers'),
        title: i18n.t('menu.customers'), 
    },
    {
        type: 'divider' as const,
    },
    // {
    //     key: 'settings-footer',
    //     icon: <SettingOutlined style={{ fontSize: '25px' }} />,
    //     label: '',
    //     title: 'settings', 
    //     className: 'mt-auto cursor-default hover:bg-transparent',
    //     style: { 
    //         marginTop: 'auto',
    //         cursor: 'default',
    //         height: '50px',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //     }
    // },
]

export const menuItems = getMenuItems()