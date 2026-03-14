# ⚙️ Svoy AI - Backend Engine

Ini adalah inti (engine) dari Svoy AI yang dibangun menggunakan Bun dan ElysiaJS. Fokus dari modul ini adalah untuk memproses dokumen secara efisien dan menyediakan API untuk berinteraksi dengan model AI.

## 🛠 Teknologi yang Digunakan
- **Runtime:** [Bun](https://bun.sh/) - Runtime JavaScript cepat dengan dukungan TypeScript bawaan.
- **Framework:** [ElysiaJS](https://elysiajs.com/) - Framework web berperforma tinggi dan ramah terhadap pengembang.
- **Bahasa:** TypeScript.
- **Dokumentasi:** Swagger/Scalar (Terintegrasi otomatis).

## 📂 Struktur Folder
- `src/index.ts`: Titik masuk utama aplikasi (setup port dan hostname).
- `src/server.ts`: Konfigurasi server, middleware (CORS, Swagger), dan definisi rute API.
- `src/services/`: Berisi logika bisnis (pemrosesan dokumen, koneksi ke database vektor, dll).
- `uploads/`: Folder penyimpanan sementara untuk file (PDF/Text) yang diunggah oleh pengguna.

## 🔑 Fitur Utama (Tahap Pengembangan)
- [ ] Arsitektur RESTful API yang bersih.
- [ ] Dokumentasi API interaktif menggunakan Swagger.
- [ ] Pengunggahan Dokumen (PDF/Teks).
- [ ] Pemecahan Teks (Chunking) & Pembuatan Embedding.
- [ ] Integrasi Database Vektor (Vector Search).

## 🚀 Cara Menjalankan
Pastikan Anda berada di dalam folder `backend`, lalu jalankan:

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev index.ts
```

This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
