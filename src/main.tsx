import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'

// Ant Design React 19 compatibility patch
import '@ant-design/v5-patch-for-react-19'

import './index.css'
import App from './App.tsx'

// Ant Design Thai locale
import thTH from 'antd/locale/th_TH'
import dayjs from './utils/dayjs'
import 'dayjs/locale/th'

dayjs.locale('th')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider 
        locale={thTH}
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
