import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument } from 'pdf-lib';

export const DocumentService = {
    async processUpload(file: File) {
        try {
            const uploadDir = path.resolve('uploads');
            const filePath = path.join(uploadDir, file.name);

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // 1. Simpan file fisik
            await writeFile(filePath, buffer);

            let extractedText = "";

            // 2. Ekstrak informasi dari PDF
            if (file.type === "application/pdf") {
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                
                const title = pdfDoc.getTitle() || "";
                const author = pdfDoc.getAuthor() || "";
                const pageCount = pdfDoc.getPageCount();
                
                extractedText = `Document: ${file.name}\nPages: ${pageCount}\nTitle: ${title}\nAuthor: ${author}`;
            } else {
                extractedText = new TextDecoder().decode(buffer);
            }

            console.log(`✅ File ${file.name} berhasil dimuat.`);
            
            return {
                fileName: file.name,
                textPreview: extractedText,
                message: "Dokumen berhasil diunggah dan dianalisis."
            };
        } catch (error) {
            console.error("❌ Detail Error:", error);
            throw new Error("Gagal memproses dokumen dengan pdf-lib.");
        }
    }
};