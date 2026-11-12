# El jardín encantado de Luna 🦋

Invitación digital para el tercer cumpleaños de Luna. Sitio web estático, **mobile-first**, desarrollado en HTML, CSS y JavaScript. No requiere dependencias, npm ni compilación.

## Estructura

- `index.html`: portada, bienvenida, datos del evento, cuenta regresiva, sorpresas, confirmación y despedida.
- `styles.css`: diseño responsivo con acuarelas, fuentes y animaciones ligeras.
- `script.js`: cuenta regresiva, conexión a Maps y WhatsApp, transiciones y pétalos al entrar.
- **`config.js`: único archivo que necesitas editar para introducir la información real.**
- `assets/`: portada aprobada e ilustraciones complementarias comprimidas en WebP.

## Personalizar

Abre `config.js` y completa:

```js
window.LUNA_CONFIG = {
  dateTime: "",       // ISO con zona horaria: AAAA-MM-DDTHH:mm:ss-06:00
  venueName: "",      // Nombre exacto del lugar
  venueAddress: "",   // Dirección visible
  mapsUrl: "",        // Enlace real a Maps o Waze
  rsvpPhone: "",      // 52 + teléfono, SIN + ni espacios (el formato depende del número)
  rsvpMessage: "¡Hola! Me gustaría confirmar mi asistencia al cumpleaños de Luna. 🦋🌸",
  dressCode: ""       // Opcional; si está vacío, no aparece la sección
};
```

**Importante:** los datos de fecha, lugar y contacto aún no han sido facilitados. La invitación muestra «por confirmar» y no activa enlaces hasta que existan valores reales. No hay horarios o teléfonos inventados.

## Ver en computadora

Abre `index.html` en un navegador. También puedes levantar un servidor sencillo:

```bash
python3 -m http.server 8000
```

Después entra a `http://localhost:8000`.

## Subir a GitHub

1. Crea un repositorio llamado `cumple_Luna_3`.
2. Sube el **contenido interno** de esta carpeta a la raíz del repositorio. En GitHub: **Add file → Upload files**.
3. Confirma que `index.html` está en la raíz y `assets/` está junto a él.
4. Revisa en el navegador; para publicarlo como sitio web, utiliza GitHub Pages desde **Settings → Pages** (o el método de hosting que prefieras).

## Privacidad

La portada contiene una imagen de una niña pequeña. **No publiques GitHub Pages ni conviertas el repositorio en público sin contar con la autorización de sus padres o tutores.** Incluso con el repositorio privado, un sitio de GitHub Pages puede ser visible en la web; verifica las condiciones de privacidad antes de compartir el enlace. Esta entrega está pensada como proyecto local hasta que se autorice publicarlo.

## Notas de diseño

Se conserva la portada aprobada como imagen para no alterar los rasgos y la composición de Luna. El botón «Descubre la magia» es un enlace HTML superpuesto y accesible. Las pantallas interiores son HTML editable; las acuarelas son recursos decorativos optimizados.
