// pages/api/md2pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).json({ message: 'Markdown content is required' });
    }

    const doc = new PDFDocument();
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
      res.send(pdfData);
    });

    // 簡単な変換: マークダウンをそのままPDFに書き込む
    // 注: 実際のアプリケーションでは、より高度なマークダウンパーサーを使用することをお勧めします
    doc.text(markdown);
    doc.end();
  } catch (error) {
    console.error('PDF conversion error:', error);
    res.status(500).json({ message: 'Error converting to PDF' });
  }
}