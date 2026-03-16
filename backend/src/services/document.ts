import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';
// @ts-ignore
import pdfExtract from 'pdf-parse-fork';
import { VectorService } from './vector';

export const DocumentService = {
    createChunks(text: string, chunkSize: number = 1200, chunkOverlap: number = 300) {
        const chunks = [];
        let i = 0;

        while (i < text.length) {
            let end = i + chunkSize;
            let chunk = text.substring(i, end);

            if (end < text.length) {
                const lastSpace = chunk.lastIndexOf(' ');
                if (lastSpace > 0) {
                    end = i + lastSpace;
                    chunk = text.substring(i, end);
                }
            }

            chunks.push(chunk.trim());
            i = end - chunkOverlap;

            if (i >= text.length || chunk.length === 0) break;
        }
        return chunks;
    },

    async processUpload(file: File) {
        try {
            const uploadDir = path.resolve('uploads');
            const filePath = path.join(uploadDir, file.name);
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            await writeFile(filePath, buffer);

            let rawText = "";
            let title = "";
            let contributorInfo = "";

            if (file.type === "application/pdf") {
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                // 1. Coba ambil dari metadata bawaan file
                title = pdfDoc.getTitle() || "";
                
                const data = await pdfExtract(buffer);
                rawText = data.text;

                // Ambil baris pertama yang memiliki teks minimal 5 karakter (menghindari baris kosong)
                const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 5);

                // 2. REKOMENDASI: Jika metadata kosong atau "Untitled", ambil baris pertama teks sebagai judul
                if (!title || title.trim().toLowerCase() === "untitled") {
                    title = lines[0] || file.name; 
                }
                // Ambil 5-10 baris pertama sebagai informasi kontributor
                contributorInfo = lines.slice(0, 10).join(", ");
            } else {
                rawText = new TextDecoder().decode(buffer);
                title = file.name;
            }

            // Membersihkan teks agar kalimat yang terpisah baris menyambung kembali
            const cleanText = rawText
                .replace(/(\r\n|\n|\r)/gm, " ") // Ubah enter menjadi spasi
                .replace(/\s+/g, " ")           // Ubah spasi ganda menjadi spasi tunggal
                .trim();

            // REKOMENDASI: Gunakan format yang sangat jelas agar AI tahu mana judul mana isi
            const fullText = `JUDUL DOKUMEN: ${title}\n\nISI LENGKAP ARTIKEL:\n${cleanText}`;

            const chunks = this.createChunks(fullText);

            const chunksWithMetadata = chunks.map(chunk => ({
                text: chunk,
                metadata: {
                    fileName: file.name,
                    title: title, // Tambahkan title ke metadata jika diperlukan
                    uploadedAt: new Date().toISOString()
                }
            }));

            await VectorService.addDocuments(chunksWithMetadata);

            return {
                fileName: file.name,
                totalChunks: chunks.length,
                message: "Dokumen berhasil diproses! Silakan coba chat kembali."
            };
        } catch (error: any) {
            console.error("❌ Svoy-AI Error:", error.message);
            throw new Error(`Gagal memproses dokumen: ${error.message}`);
        }
    }
};