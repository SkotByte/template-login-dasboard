import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Ant Design React 19 compatibility patch
import '@ant-design/v5-patch-for-react-19'

import './index.css'
import './i18n'
import AppWrapper from './AppWrapper'

import dayjs from './utils/dayjs'
import 'dayjs/locale/th'
import 'dayjs/locale/lo'

dayjs.locale('th')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  </StrictMode>,
)
