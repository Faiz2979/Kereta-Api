import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id } = req.query;
        const { asalKeberangkatan, tujuanKeberangkatan, tanggalBerangkat, tanggalKedatangan, harga, keretaId } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const updateData: { [key: string]: any } = {};

        if (asalKeberangkatan) updateData.asalKeberangkatan = asalKeberangkatan;
        if (tujuanKeberangkatan) updateData.tujuanKeberangkatan = tujuanKeberangkatan;
        if (tanggalBerangkat) updateData.tanggalBerangkat = new Date(tanggalBerangkat);
        if (tanggalKedatangan) updateData.tanggalKedatangan = new Date(tanggalKedatangan);
        if (harga) updateData.harga = parseFloat(harga);
        if (keretaId) updateData.keretaId = parseInt(keretaId, 10);

        const updatedJadwal = await prisma.jadwal.update({
            where: {
                id: Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10),
            },
            data: updateData,
        });

        return res.status(200).json(updatedJadwal);
    } catch (error) {
        return res.status(500).json({ message: "Error updating jadwal", error });
    }
}
