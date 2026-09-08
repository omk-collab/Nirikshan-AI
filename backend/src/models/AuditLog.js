import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true, index: true },
    user: { type: String, required: true },
    role: { type: String, default: 'ANALYST' },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true },
    entityId: { type: String, required: true, index: true },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '127.0.0.1' },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['SUCCESS', 'FAILURE', 'WARNING'], default: 'SUCCESS' },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
