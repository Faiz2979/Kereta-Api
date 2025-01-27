import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function pesanTiketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, secretKey);
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== 'pelanggan') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { jadwalId, penumpang } = req.body;

    if (!jadwalId || !penumpang || !Array.isArray(penumpang) || penumpang.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const jadwal = await prisma.jadwal.findUnique({
      where: { id: jadwalId },
      include: { kereta: true },
    });

    if (!jadwal) {
      return res.status(404).json({ message: 'Jadwal not found' });
    }

    const totalPenumpang = penumpang.length;

    // Remove kuota check
    // if (totalPenumpang > jadwal.kuota) {
    //   return res.status(400).json({ message: 'Kuota tidak mencukupi' });
    // }

    const pelanggan = await prisma.pelanggan.findFirst({
      where: { userId: user.id },
    });

    if (!pelanggan) {
      return res.status(404).json({ message: 'Pelanggan not found' });
    }

    const pembelianTiket = await prisma.pembelianTiket.create({
      data: {
        tanggal: new Date(),
        pelangganId: pelanggan.id,
        jadwalId: jadwal.id,
        penumpang: {
          create: penumpang.map((p: any) => ({
            nama: p.nama,
            nik: p.nik,
          })),
        },
      },
    });

    // Remove kuota update
    // await prisma.jadwal.update({
    //   where: { id: jadwal.id },
    //   data: { kuota: jadwal.kuota - totalPenumpang },
    // });

    // Generate PDF
    const doc = new PDFDocument();
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=bukti_pemesanan.pdf');
      res.send(pdfData);
    });

    doc.fontSize(20).text('Bukti Pemesanan Tiket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Nama Pelanggan: ${pelanggan.nama}`);
    doc.text(`NIK: ${pelanggan.nik}`);
    doc.text(`Tanggal Pemesanan: ${new Date().toLocaleDateString()}`);
    doc.text(`Kereta: ${jadwal.kereta.namaKereta}`);
    doc.text(`Asal: ${jadwal.asalKeberangkatan}`);
    doc.text(`Tujuan: ${jadwal.tujuanKeberangkatan}`);
    doc.text(`Tanggal Berangkat: ${new Date(jadwal.tanggalBerangkat).toLocaleDateString()}`);
    doc.text(`Waktu Berangkat: ${jadwal.waktuBerangkat}`);
    doc.text(`Waktu Tiba: ${jadwal.waktuTiba}`);
    doc.text(`Harga: Rp ${jadwal.harga}`);
    doc.moveDown();
    doc.text('Penumpang:', { underline: true });

    penumpang.forEach((p: any, index: number) => {
      doc.text(`${index + 1}. Nama: ${p.nama}, NIK: ${p.nik}`);
    });

    doc.end();
  } catch (error) {
    console.error('Error processing ticket purchase:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}