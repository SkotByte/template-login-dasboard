import { useState } from 'react'
import { Layout, Menu, Button, Dropdown, Avatar, message } from 'antd'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { menuItems } from './MenuItems'

const { Sider, Content } = Layout

interface AdminLayoutProps {
    children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuthStore()


    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key)
    }

    return (
        <Layout className="min-h-screen">
            <Sider trigger={null} collapsible collapsed={collapsed} className="min-h-screen">
                <div className="h-8 mx-4 my-2 bg-white bg-opacity-30 rounded-md flex items-center justify-center text-blue-950 font-bold">
                    {collapsed ? 'A' : 'Admin'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <div className="flex justify-between items-center px-4 py-2 bg-white shadow-sm">

                    <Button
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                                {user?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {user?.role}
                            </div>
                        </div>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'profile',
                                        icon: <UserOutlined />,
                                        label: 'Profile'
                                    },
                                    {
                                        key: 'settings',
                                        icon: <SettingOutlined />,
                                        label: 'Settings'
                                    },
                                    {
                                        type: 'divider'
                                    },
                                    {
                                        key: 'logout',
                                        icon: <LogoutOutlined />,
                                        label: 'Logout',
                                        onClick: async () => {
                                            await logout()
                                            message.success('Logged out successfully')
                                        }
                                    }
                                ]
                            }}
                            placement="bottomRight"
                        >
                            <Avatar
                                src={user?.avatar}
                                className="cursor-pointer bg-blue-500"
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                        </Dropdown>
                    </div>
                </div>
                <Content className="m-4 p-6 min-h-[calc(100vh-80px)] bg-white rounded-lg overflow-auto">
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminLayout