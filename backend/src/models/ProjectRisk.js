import mongoose from 'mongoose';

const projectRiskSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    financialRisk: { type: Number, default: 0, min: 0, max: 100 },
    progressRisk: { type: Number, default: 0, min: 0, max: 100 },
    delayRisk: { type: Number, default: 0, min: 0, max: 100 },
    mlRisk: { type: Number, default: 0, min: 0, max: 100 },
    photoRisk: { type: Number, default: 0, min: 0, max: 100 },
    peerRisk: { type: Number, default: 0, min: 0, max: 100 },
    similarityRisk: { type: Number, default: 0, min: 0, max: 100 },

    overallRisk: { type: Number, required: true, min: 0, max: 100, index: true },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
      index: true,
    },

    indicators: [
      {
        indicator: { type: String, required: true },
        severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
        value: { type: Number },
        message: { type: String },
      },
    ],
    riskReasons: [{ type: String }],
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

// Compound index for fast risk filtering and sorting
projectRiskSchema.index({ riskLevel: 1, overallRisk: -1 });

export const ProjectRisk = mongoose.model('ProjectRisk', projectRiskSchema);
export default ProjectRisk;
