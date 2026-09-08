import mongoose from 'mongoose';

const photoVerificationSchema = new mongoose.Schema(
  {
    photoId: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectLat: { type: Number, required: true },
    projectLng: { type: Number, required: true },
    photoLat: { type: Number, default: null },
    photoLng: { type: Number, default: null },

    distanceMeters: { type: Number, required: true },
    allowedThresholdMeters: { type: Number, default: 250 },

    gpsStatus: {
      type: String,
      enum: ['Consistent', 'Requires Review', 'Unavailable'],
      default: 'Requires Review',
    },
    timestampStatus: {
      type: String,
      enum: ['Verified', 'Suspicious', 'Unavailable'],
      default: 'Verified',
    },

    duplicateCheck: {
      isDuplicate: { type: Boolean, default: false },
      similarityScore: { type: Number, default: 0 },
      matchedPhotoId: { type: String, default: null },
      message: { type: String, default: 'No duplicate detected' },
    },

    overallVerification: {
      type: String,
      enum: ['PASS', 'REQUIRES_REVIEW', 'FAIL'],
      required: true,
      index: true,
    },
    reviewNotes: { type: String, default: '' },
    evaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PhotoVerification = mongoose.model('PhotoVerification', photoVerificationSchema);
export default PhotoVerification;
