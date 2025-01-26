// update data gerbong

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("req.method", req.method);
    if (req.method === "PUT") {
        try {
            const { id } = req.query;
            const { namaGerbong: nama, kuota, keretaId } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }
            const updateData: { nama?: string; kuota?: number; keretaId?: number } = {};

            if (nama) {
                updateData.nama = nama;
            }
            if (kuota) {
                updateData.kuota = kuota;
            }
            if (keretaId) {
                updateData.keretaId = keretaId;
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "At least one field (namaGerbong, deskripsi, kelas) is required to update" });
            }

            const gerbong = await prisma.gerbong.update({
                where: {
                    id: Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10),
                },
                data: {
                    ...updateData,
                },
            });

            return res.status(201).json({ gerbong });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "An unknown error occurred" });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}