import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        await prisma.jadwal.delete({
            where: {
                id: Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10),
            },
        });

        return res.status(200).json({ message: "Jadwal deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting jadwal", error });
    }
}
