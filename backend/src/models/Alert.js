import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    alertId: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    state: { type: String, required: true, index: true },
    district: { type: String, required: true },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'RESOLVED'],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    reason: { type: String, required: true },
    riskScore: { type: Number, required: true },
    suggestedAction: { type: String, default: 'Review project records' },
    status: {
      type: String,
      enum: ['NEW', 'REVIEWING', 'RESOLVED', 'DISMISSED'],
      default: 'NEW',
      index: true,
    },
    resolvedBy: { type: String, default: null },
    resolvedAt: { type: Date, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
