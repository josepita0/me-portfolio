# Portfolio — José Pita

Portfolio personal desarrollado con Astro, React y TypeScript.

## 🚀 Stack Tecnológico

- **Framework:** [Astro 6](https://astro.build/)
- **UI:** [React 19](https://react.dev/)
- **Animaciones:** [Motion](https://motion.dev/) (sucesor de Framer Motion)
- **Smooth Scroll:** [Lenis](https://lenis.darkroom.engineering/)
- **Analytics:** [Vercel Analytics](https://vercel.com/docs/analytics)
- **Formulario de contacto:** [Web3Forms](https://web3forms.com/)
- **Deploy:** [Vercel](https://vercel.com/)

## 📋 Prerequisitos

- Node.js 18+ (recomendado: 20+)
- npm, pnpm, o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/josepita0/me-porfolio-demo.git
cd me-porfolio-demo
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` y agrega tu API key de Web3Forms:
```
PUBLIC_WEB3FORMS_KEY=tu_access_key_aqui
```

Para obtener una key, visita [Web3Forms](https://web3forms.com/).

## 🏃 Desarrollo

Inicia el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## 📦 Build

Genera la versión de producción:
```bash
npm run build
```

Previsualiza el build:
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
/
├── public/
│   ├── fonts/          # Fuentes self-hosted (woff2)
│   ├── images/         # Imágenes y avatares
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/     # Componentes React y Astro
│   ├── layouts/        # Layouts de página
│   ├── pages/          # Páginas (rutas)
│   ├── styles/         # Estilos globales
│   └── lib/            # Utilidades
└── package.json
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `PUBLIC_WEB3FORMS_KEY` | API key de Web3Forms para el formulario de contacto | Sí |

### Dominio

El sitio está configurado para `https://pitass.com`. Para cambiarlo, edita:
- `astro.config.mjs` → propiedad `site`
- `public/sitemap.xml` → URLs

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**José Pita**
- Website: [pitass.com](https://pitass.com)
- LinkedIn: [@jose-acurero](https://www.linkedin.com/in/jose-acurero/)
- GitHub: [@josepita0](https://github.com/josepita0)
