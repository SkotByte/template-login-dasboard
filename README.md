# Admin E-Commerce Web Application

A modern, responsive admin panel for e-commerce management built with React, TypeScript, Vite, Ant Design, and Tailwind CSS.

## 🚀 Features

- **Dashboard**: Overview with key metrics and recent orders
- **Product Management**: Create, read, update, delete products with image upload
- **Order Management**: View and track orders with filtering capabilities  
- **Customer Management**: Manage customer information and profiles
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean design using Ant Design components with Tailwind CSS styling
- **Form Validation**: Robust validation using Yup and React Hook Form
- **Date Handling**: Comprehensive date management with Day.js
- **Thai Localization**: Built-in Thai language support

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with rolldown (experimental)
- **UI Library**: Ant Design 
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Yup validation
- **Date Library**: Day.js with Thai locale
- **Routing**: React Router DOM
- **Icons**: Ant Design Icons

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## 🏃‍♂️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 Project Structure

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
