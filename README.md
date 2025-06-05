# 🛍️ Frontend - E-commerce Portfolio | React + Vite

Este es el **frontend del sistema de e-commerce** que forma parte de mi portfolio como Full Stack Developer. Se conecta con un backend en NestJS y permite realizar un flujo completo de compra, desde la visualización del producto hasta la confirmación de pago.

> 🛠️ Proyecto desarrollado en paralelo al backend en solo **7 días**  
> 🚀 Incluye autenticación, carrito, checkout con Mercado Pago y panel admin

---

## ⚙️ Stack Tecnológico

| Tecnología   | Uso                                     |
| ------------ | --------------------------------------- |
| React        | Interfaz de usuario                     |
| Vite         | Empaquetador rápido                     |
| TypeScript   | Tipado estático                         |
| Ant Design   | Componentes de UI                       |
| Axios        | Peticiones HTTP                         |
| React Router | Rutas públicas y privadas               |
| Context API  | Estado global (usuario, carrito)        |
| SCSS Modules | Estilos modulares                       |
| i18n         | Soporte multilenguaje (`react-i18next`) |

---

## 🚀 Cómo levantar el proyecto

### 1. Clonar el repositorio

git clone https://github.com/tu-usuario/tu-front-repo.git
cd tu-front-repo

### 2. Instalar dependencias

yarn install

### 3. Crear archivo .env

cp .env.example .env

## 4. Definir la API del backend

Editá el archivo .env con la URL de tu backend NestJS:

VITE_API_URL=http://localhost:4000/api/v1

### 5. Levantar el servidor de desarrollo

yarn dev
La app estará disponible en http://localhost:5173

### 📁 .env.example

VITE_API_URL=http://localhost:4000/api/v1

### 🧪 Scripts útiles

yarn lint # Linting con ESLint
yarn format # Formateo con Prettier
yarn build # Genera build optimizada
yarn preview # Sirve el build localmente
