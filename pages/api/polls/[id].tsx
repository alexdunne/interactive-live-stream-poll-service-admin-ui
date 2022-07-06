import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  fetch(`${process.env.POLL_SERVICE_API_URL}/polls/${id}`)
    .then((r) => r.json())
    .then((r) => {
      res.status(200).json(r);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    });
}
