export default async function handler(req, res) {
  return res.status(410).json({ message: "This endpoint is deprecated" });
}
