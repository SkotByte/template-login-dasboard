import { ConfigProvider, theme } from 'antd'
import { useThemeStore } from './store/themeStore'
import App from './App'
import thTH from 'antd/locale/th_TH'

const AppWrapper = () => {
  const { isDarkMode } = useThemeStore()

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          fontFamily: "'Noto Sans Lao', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        },
      }}
    >
      <App />
    </ConfigProvider>
  )
}

export default AppWrapper
