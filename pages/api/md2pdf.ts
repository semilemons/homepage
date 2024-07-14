// pages/api/md2pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import PDFDocument from 'pdfkit';
import markdownIt from 'markdown-it';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { markdown } = req.body;

    if (!markdown || typeof markdown !== 'string') {
      return res.status(400).json({ message: 'Valid markdown content is required' });
    }

    const md = new markdownIt({
      html: true,
      linkify: true,
      typographer: true,
    });

    const htmlContent = md.render(markdown);
    const $ = cheerio.load(htmlContent);

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 72, right: 72 },
      autoFirstPage: false,
    });

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=converted.pdf',
    });

    doc.pipe(res);

    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Regular.ttf');
    doc.registerFont('NotoSansJP', fontPath);
    doc.font('NotoSansJP');

    doc.addPage();

    let y = doc.page.margins.top;

    $('body').children().each((i, elem) => {
      const tagName = elem.tagName.toLowerCase();
      const text = $(elem).text().trim();

      switch (tagName) {
        case 'h1':
          doc.fontSize(24).font('NotoSansJP', 'bold').text(text, { continued: false });
          y += 30;
          break;
        case 'h2':
          doc.fontSize(20).font('NotoSansJP', 'bold').text(text, { continued: false });
          y += 25;
          break;
        case 'h3':
          doc.fontSize(16).font('NotoSansJP', 'bold').text(text, { continued: false });
          y += 20;
          break;
        case 'p':
          doc.fontSize(12).font('NotoSansJP', 'normal').text(text, {
            width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
            align: 'left',
            continued: false,
          });
          y += doc.heightOfString(text) + 10;
          break;
        case 'ul':
        case 'ol':
          $(elem).find('li').each((j, li) => {
            const bullet = tagName === 'ul' ? '•' : `${j + 1}.`;
            doc.fontSize(12).font('NotoSansJP', 'normal').text(`${bullet} ${$(li).text().trim()}`, {
              width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 20,
              align: 'left',
              continued: false,
              indent: 20,
            });
            y += doc.heightOfString($(li).text().trim()) + 5;
          });
          y += 10;
          break;
      }

      if (y > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.page.margins.top;
      }
    });

    doc.end();
  } catch (error) {
    console.error('PDF conversion error:', error);
    res.status(500).json({ message: 'Error converting to PDF', error: error.message });
  }
}