import { AuditLog } from "../models/AuditLog.js";

export async function listActivity(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = 40;

  const [items, total] = await Promise.all([
    AuditLog.find().sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize),
    AuditLog.countDocuments(),
  ]);

  res.json({ items, total, page, pageSize });
}
