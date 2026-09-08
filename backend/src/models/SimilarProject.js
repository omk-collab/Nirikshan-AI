import mongoose from 'mongoose';

const similarProjectSchema = new mongoose.Schema(
  {
    pairId: { type: String, required: true, unique: true, index: true },
    primaryProjectId: { type: String, required: true, index: true },
    matchedProjectId: { type: String, required: true },
    similarityScore: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, default: 'REQUIRES_REVIEW' },
    similarityTag: { type: String, default: 'Potentially Similar Work' },
    analysis: { type: String, required: true },
  },
  { timestamps: true }
);

export const SimilarProject = mongoose.model('SimilarProject', similarProjectSchema);
export default SimilarProject;
