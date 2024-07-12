import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, PageSizes } from 'pdf-lib';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

function sanitizeFilename(filename: string | undefined | null): string {
  if (typeof filename !== 'string' || filename.trim() === '') {
    return 'document';
  }
  return filename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 255);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Starting PDF conversion process');

    const form = formidable({
      maxFileSize: 200 * 1024 * 1024, // 200MB max
      keepExtensions: true,
      multiples: true,
    });

    const [fields, files] = await new Promise<[formidable.Fields<string>, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          reject(new Error(`Form parsing failed: ${err.message}`));
        } else {
          console.log('Form parsed successfully');
          resolve([fields, files]);
        }
      });
    });

    console.log('Files received:', JSON.stringify(files, null, 2));

    if (!files.files) {
      throw new Error('No files were uploaded');
    }

    const pdfDoc = await PDFDocument.create();
    console.log('PDF document created');

    const fileArray = Array.isArray(files.files) ? files.files : [files.files];

    // Determine PDF orientation based on the first image
    let pdfOrientation: 'portrait' | 'landscape' = 'portrait';
    if (fileArray.length > 0) {
      const firstFile = fileArray[0];
      const firstFileData = await fs.readFile(firstFile.filepath);
      let firstImage;
      if (firstFile.mimetype === 'image/jpeg') {
        firstImage = await pdfDoc.embedJpg(firstFileData);
      } else if (firstFile.mimetype === 'image/png') {
        firstImage = await pdfDoc.embedPng(firstFileData);
      }
      if (firstImage && firstImage.width > firstImage.height) {
        pdfOrientation = 'landscape';
      }
    }

    const pageSize: [number, number] = pdfOrientation === 'portrait' 
      ? PageSizes.A4 
      : [PageSizes.A4[1], PageSizes.A4[0]] as const;

    for (const file of fileArray) {
      if (!file) {
        console.warn('Undefined file encountered, skipping');
        continue;
      }

      const filePath = file.filepath;
      const mimeType = file.mimetype;

      console.log(`Processing file: ${filePath}, type: ${mimeType}`);

      try {
        const fileData = await fs.readFile(filePath);
        console.log(`File read successfully: ${filePath}, size: ${fileData.length} bytes`);

        let image;
        if (mimeType === 'image/jpeg') {
          image = await pdfDoc.embedJpg(fileData);
        } else if (mimeType === 'image/png') {
          image = await pdfDoc.embedPng(fileData);
        } else {
          console.warn(`Unsupported file type: ${mimeType}, skipping`);
          continue;
        }

        const page = pdfDoc.addPage(pageSize);
        const { width, height } = page.getSize();
        const imageAspectRatio = image.width / image.height;
        const pageAspectRatio = width / height;

        let imageWidth, imageHeight;
        if (imageAspectRatio > pageAspectRatio) {
          // Image is wider than the page
          imageWidth = width;
          imageHeight = width / imageAspectRatio;
        } else {
          // Image is taller than the page
          imageHeight = height;
          imageWidth = height * imageAspectRatio;
        }

        const x = (width - imageWidth) / 2;
        const y = (height - imageHeight) / 2;

        page.drawImage(image, {
          x,
          y,
          width: imageWidth,
          height: imageHeight,
        });
        console.log(`Image added to PDF: ${file.originalFilename}`);
      } catch (fileError) {
        console.error(`Error processing file ${filePath}:`, fileError);
        throw new Error(`Failed to process file ${file.originalFilename}: ${fileError.message}`);
      } finally {
        await fs.unlink(filePath).catch(err => console.error(`Failed to delete temporary file ${filePath}:`, err));
      }
    }

    console.log('All images processed, saving PDF');
    const pdfBytes = await pdfDoc.save();
    console.log(`PDF saved successfully, size: ${pdfBytes.length} bytes`);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const sanitizedFilename = sanitizeFilename(title);
    const encodedFilename = encodeURIComponent(sanitizedFilename);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}.pdf"`);
    res.send(Buffer.from(pdfBytes));
    console.log('PDF sent as response');

  } catch (error) {
    console.error('PDF creation error:', error);
    res.status(500).json({ error: 'PDF creation failed', details: error.message, stack: error.stack });
  }
}