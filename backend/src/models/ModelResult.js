import mongoose from 'mongoose';

const modelResultSchema = new mongoose.Schema(
  {
    resultId: { type: String, required: true, unique: true, index: true },
    batchId: { type: String, default: 'BATCH-INITIAL' },
    modelName: { type: String, default: 'Isolation Forest' },
    projectId: { type: String, required: true, index: true },
    anomalyScore: { type: Number, required: true },
    isAnomaly: { type: Boolean, default: false },
    topFeatures: [
      {
        feature: { type: String },
        value: { type: String },
        zScore: { type: Number },
      },
    ],
    evaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ModelResult = mongoose.model('ModelResult', modelResultSchema);
export default ModelResult;
