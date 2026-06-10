# DENTISTADG — Guía de Despliegue en Render

**Alumno:** Diego Alejandro Gomez Vazquez | 24308051280845 | 4-J Programación

---

## 📁 Estructura de Archivos Necesaria

```
DAGV-0845/
├── server.js              ✅ (usa este, el actualizado)
├── package.json           ✅ (nuevo, necesario para Render)
├── .gitignore             ✅ (nuevo, necesario para GitHub)
├── dagv-dentista.html     (tu archivo original)
├── odontologos.html       (tu archivo original)
├── encuesta.html          (tu archivo original)
├── servicios.html         (tu archivo original)
├── citas.html             (tu archivo original)
├── pagos.html             (tu archivo original)
└── logo.png               (tu imagen)
```

---

## 🗄️ PASO 1 — Crear MongoDB Atlas (Base de datos en la nube)

1. Ve a **https://www.mongodb.com/cloud/atlas** y crea una cuenta gratuita.
2. Crea un **Cluster gratuito (M0)**.
3. En **Database Access** → crea un usuario con contraseña (guárdala).
4. En **Network Access** → agrega la IP `0.0.0.0/0` (permite acceso desde Render).
5. En tu Cluster → clic en **Connect** → **Compass** o **Drivers** → copia la URI.
   - Ejemplo: `mongodb+srv://tuUsuario:tuPassword@cluster0.xxxxx.mongodb.net/proyectofinal`

---

## 🐙 PASO 2 — Subir el proyecto a GitHub

```bash
# Dentro de tu carpeta DAGV-0845:
git init
git add .
git commit -m "Proyecto Final DENTISTADG"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/dagv-dentista.git
git push -u origin main
```

---

## 🚀 PASO 3 — Desplegar en Render

1. Ve a **https://render.com** e inicia sesión con tu cuenta de GitHub.
2. Clic en **New +** → **Web Service**.
3. Conecta tu repositorio `dagv-dentista`.
4. Configura así:

   | Campo            | Valor                  |
   |------------------|------------------------|
   | **Environment**  | `Node`                 |
   | **Build Command**| `npm install`          |
   | **Start Command**| `node server.js`       |

5. En la sección **Environment Variables** agrega:

   | Key          | Value                                              |
   |--------------|----------------------------------------------------|
   | `MONGO_URI`  | `mongodb+srv://usuario:pass@cluster.mongodb.net/proyectofinal` |

6. Clic en **Create Web Service** y espera ~2 minutos.
7. Render te dará una URL pública tipo: `https://dagv-dentista.onrender.com`

---

## ⚠️ Notas Importantes

- El `server.js` actualizado detecta automáticamente si estás en local o en Render.
  - **Local:** sigue usando `mongodb://127.0.0.1:27017/proyectofinal` (Compass).
  - **Render:** usa la variable `MONGO_URI` que configuraste.
- El puerto también se ajusta solo (`process.env.PORT` en Render, `3000` en local).
- **Nunca** subas el archivo `.env` a GitHub (ya está en el `.gitignore`).
