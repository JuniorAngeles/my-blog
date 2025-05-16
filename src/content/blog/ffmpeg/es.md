---
title: '🧪 Cómo integrar FFmpeg en Vite para comprimir videos y audios desde el navegador'
description: 'Esta guía documenta todos los pasos realizados durante la migración de la base de datos desde un archivo de respaldo hacia un servidor de PostgreSQL, incluyendo los comandos utilizados, errores comunes y sus soluciones.'
pubDate: 'May 05 2025'
heroImage: '/FFmpeg/ffmpeg_logo_wine_e24ae49afe.png'
author: 'Junior Ángeles'
lang: 'es'
---

La compresión de archivos multimedia es una necesidad común en aplicaciones web modernas, sobre todo cuando necesitamos enviar archivos por canales limitados como WhatsApp o email. Una solución poderosa es usar FFmpeg, una herramienta popular para procesar audio y video.

Gracias a la versión WebAssembly (WASM) de FFmpeg, podemos ejecutar este procesamiento directamente en el navegador sin necesidad de backend. En este artículo, te mostraré paso a paso cómo integrar FFmpeg en un proyecto creado con Vite para comprimir videos y audios en el navegador y convertirlos a Base64.

## 🧰 ¿Qué es FFmpeg?

- FFmpeg es una suite de software libre que permite grabar, convertir y transmitir audio y video en múltiples formatos. Es ampliamente usado en entornos profesionales y proyectos multimedia. Con su versión WebAssembly (@ffmpeg/ffmpeg), es posible usarlo en aplicaciones web sin necesidad de instalar nada en el sistema del usuario.

## Requisitos previos

- Antes de comenzar, asegúrate de tener::
  - Node.js y Vite instalados.
  - Una aplicación web basada en React (aunque también funciona con otros frameworks).
  - Un poco de conocimiento básico de JavaScript.

## 📦 Paso 1: Instalar las dependencias

- Ejecuta en tu terminal:

```markdown
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

#### Esto instala:

- @ffmpeg/ffmpeg: la biblioteca principal que corre FFmpeg en el navegador.
- @ffmpeg/util: herramientas de ayuda como fetchFile para leer archivos.

## 🏗️ Paso 2: Crear una instancia global de FFmpeg

- Creamos un archivo para manejar la instancia compartida de FFmpeg:

```markdown
// src/utils/ffmpegInstance.js
import { createFFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

export default ffmpeg;
```

## 🔧 Paso 3: Crear una utilidad para convertir archivos a Base64

- Creamos un archivo para manejar la instancia compartida de FFmpeg:

```markdown
// src/utils/formats.js
export const fileToBase64 = async (file) => {
return new Promise((resolve, reject) => {

    if (!file) return reject("Archivo no válido");

const reader = new FileReader();

reader.onloadend = () => resolve(reader.result);

reader.onerror = reject;

reader.readAsDataURL(file);

});
};
```

## 🎞️ Paso 4: Crear funciones para comprimir video y audio

- Creamos un archivo llamado compressor.js:

```markdown
// src/utils/formats.js
// src/utils/compressor.js

import ffmpeg from "./ffmpegInstance";
import { fetchFile } from "@ffmpeg/util";
import { fileToBase64 } from "./formats";
// URLs del core de FFmpeg (evita problemas con WASM local)

const coreURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js";
const wasmURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm";

// 📼 Comprimir video

export const compressVideo = async (file) => {
if (!file) return null;
await ffmpeg.load({ coreURL, wasmURL });

      const inputData = await fetchFile(file);
      ffmpeg.writeFile("input.mp4", inputData);

      await ffmpeg.exec([
       	"-i", "input.mp4",
       	"-vcodec", "libx264",
       	"-acodec", "aac",
       	"-b:v", "400k",
       	"-b:a", "48k",
       	"-vf", "scale=360:-2",
       	"-preset", "ultrafast",
       	"-movflags", "+faststart",
       	"output.mp4"
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = new Blob([data], { type: "video/mp4" });
      return await fileToBase64(blob);

};

// 🎵 Comprimir audio

export const audioCompress = async (file) => {
if (!file) return null;
await ffmpeg.load({ coreURL, wasmURL });

const inputData = await fetchFile(file);
ffmpeg.writeFile("input.mp4", inputData);

await ffmpeg.exec([
"-i", "input.mp4",
"-acodec", "aac",
"-b:a", "48k",
"output.mp4"
]);

const data = await ffmpeg.readFile("output.mp4");
const blob = new Blob([data], { type: "audio/mp4" });
return await fileToBase64(blob);
};
```

## Paso 5: Usar la función en tu componente React

```
import { compressVideo } from "@/utils/compressor";

const handleUpload = async (event) => {
	const file = event.target.files[0];
	const compressedBase64 = await compressVideo(file);
	console.log("Base64 comprimido:", compressedBase64);
};
```

```
<input type="file" accept="video/*" onChange={handleUpload} />
```

## 🛠️ Configuración adicional en Vite (opcional)

- Si llegas a tener errores relacionados con .wasm:

```
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	assetsInclude: ["**/*.wasm"]
});
```

```

---

Este archivo `.md` ya está listo para integrarse en un blog con soporte para frontmatter (como Astro, Nuxt Content o Docusaurus). Si necesitas la versión como archivo descargable o con estilo de blog visual (como HTML estático), también puedo ayudarte.

```
