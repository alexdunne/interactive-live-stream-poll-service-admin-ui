import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  fetch(`${process.env.POLL_SERVICE_API_URL}/polls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...req.body,
      channelARN: process.env.CHANNEL_ARN,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      res.status(202).json(r);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    });
}
