---
title: '🧪 How to Integrate FFmpeg in Vite to Compress Videos and Audio in the Browser'
description: 'This guide documents all the steps taken during the integration of FFmpeg into a Vite project to compress multimedia files directly in the browser, including dependencies, utility functions, and common issues with their solutions.'
pubDate: 'May 05 2025'
heroImage: '/FFmpeg/ffmpeg_logo_wine_e24ae49afe.png'
author: 'Junior Ángeles'
lang: 'en'
---

Compressing multimedia files is a common need in modern web applications, especially when sending them through limited channels like WhatsApp or email. A powerful solution is to use FFmpeg, a popular tool for processing audio and video.

Thanks to the WebAssembly (WASM) version of FFmpeg, we can perform this processing directly in the browser without needing a backend. In this article, I’ll show you step-by-step how to integrate FFmpeg into a project built with Vite to compress videos and audio in the browser and convert them to Base64.

## 🧰 What is FFmpeg?

- **FFmpeg** is a free and open-source software suite used to record, convert, and stream audio and video in multiple formats. It is widely used in professional environments and multimedia projects. With its WebAssembly version (`@ffmpeg/ffmpeg`), it’s possible to use it in web applications without installing anything on the user’s system.

## Prerequisites

- Before getting started, make sure you have:
  - Node.js and Vite installed.
  - A web application based on React (although it also works with other frameworks).
  - Basic knowledge of JavaScript.

## 📦 Step 1: Install the dependencies

Run the following in your terminal:

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

#### This installs:

- @ffmpeg/ffmpeg: the main library that runs FFmpeg in the browser.

- @ffmpeg/util: helper tools like fetchFile to read files.

## 🏗️ Step 2: Create a global FFmpeg instance

- Creamos un archivo para manejar la instancia compartida de FFmpeg:

```markdown
// src/utils/ffmpegInstance.js
import { createFFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

export default ffmpeg;
```

## 🔧 Step 3: Create a utility to convert files to Base64

- Create a helper function:

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

## 🎞️ Step 4: Create functions to compress video and audio

- Create a file named compressor.js:

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

## 🧪 Step 5: Use the function in your React component

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

## 🛠️ Additional configuration in Vite (optional)

- If you run into errors related to .wasm:

```
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	assetsInclude: ["**/*.wasm"]
});
```

Now your application will be ready to compress videos and audio directly in the browser using FFmpeg and convert them to Base64 format.

```

---

✅ This file is ready to be used in any documentation-based blog system like Astro, Docusaurus, or Nuxt Content.

Would you also like a downloadable version or a styled HTML export?
```
