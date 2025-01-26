// update data gerbong

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("req.method", req.method);
    if (req.method === "PUT") {
        try {
            const { id } = req.query;
            const { noKursi, gerbongId } = req.body;

            if (!id) {
                return res.status(400).json({ message: "Id is required" });
            }

            const updateData: { noKursi?: string; gerbongId?: number } = {};

            if (noKursi) {
                updateData.noKursi = noKursi;
            }

            if (gerbongId) {
                updateData.gerbongId = parseInt(gerbongId, 10);
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "At least one field (noKursi, gerbongId) is required to update" });
            }

            const updatedKursi = await prisma.kursi.update({
                where: {
                    id: Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10),
                },
                data: updateData,
            });

            return res.status(200).json(updatedKursi);
        } catch (error) {
            return res.status(500).json({ message: "Error updating kursi", error });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}