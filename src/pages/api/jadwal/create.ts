import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { asalKeberangkatan, tujuanKeberangkatan, tanggalBerangkat, tanggalKedatangan, harga, keretaId } = req.body;

        if (!asalKeberangkatan || !tujuanKeberangkatan || !tanggalBerangkat || !tanggalKedatangan || !harga || !keretaId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newJadwal = await prisma.jadwal.create({
            data: {
                asalKeberangkatan,
                tujuanKeberangkatan,
                tanggalBerangkat: new Date(tanggalBerangkat),
                tanggalKedatangan: new Date(tanggalKedatangan),
                harga: parseFloat(harga),
                keretaId: parseInt(keretaId, 10),
            },
        });

        return res.status(201).json(newJadwal);
    } catch (error) {
        return res.status(500).json({ message: "Error creating jadwal", error });
    }
}
