import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authorization.split(' ')[1];

        try {
            // Verifikasi token JWT
            const decoded: any = jwt.verify(token, secretKey);
            const user = await prisma.users.findUnique({
                where: { id: decoded.userId },
            });

            // Cek role user
            if (!user || user.role !== 'petugas') {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const { nomorKursi, gerbongId } = req.body;

            if (!nomorKursi || !gerbongId) {
                return res.status(400).json({ message: "nomorKursi and gerbongId are required" });
            }

            // Ambil data gerbong & kuota
            const gerbong = await prisma.gerbong.findUnique({
                where: { id: parseInt(gerbongId, 10) },
                include: {
                    _count: { select: { kursi: true } }, // Hitung total kursi yang sudah ada
                },
            });

            if (!gerbong) {
                return res.status(404).json({ message: "Gerbong not found" });
            }

            const totalKursiTerdaftar = gerbong._count.kursi;
            const kuotaGerbong = gerbong.kuota;

            // Cek apakah total kursi yang mau dibuat akan melebihi kuota
            if (totalKursiTerdaftar >= kuotaGerbong) {
                return res.status(400).json({ message: "Jumlah kursi sudah mencapai batas kuota gerbong" });
            }

            // Pastikan nomor kursi belum terdaftar di gerbong tersebut
            const kursiExist = await prisma.kursi.findFirst({
                where: {
                    nomorKursi,
                    gerbongId: parseInt(gerbongId, 10),
                },
            });

            if (kursiExist) {
                return res.status(400).json({ message: "Nomor kursi sudah terdaftar di gerbong ini" });
            }

            // Jika lolos semua validasi, buat kursi baru
            const newKursi = await prisma.kursi.create({
                data: {
                    nomorKursi,
                    gerbongId: parseInt(gerbongId, 10),
                },
            });

            return res.status(201).json(newKursi);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error creating kursi", error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
