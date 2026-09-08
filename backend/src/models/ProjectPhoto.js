import mongoose from 'mongoose';

const projectPhotoSchema = new mongoose.Schema(
  {
    photoId: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    stage: { type: String, default: 'Civil Milestone Inspection' },
    photoUrl: { type: String, required: true },
    filePath: { type: String, default: '' },
    mimeType: { type: String, default: 'image/jpeg' },
    fileSizeBytes: { type: Number, default: 0 },

    // Extracted EXIF Metadata
    photoLat: { type: Number, default: null },
    photoLng: { type: Number, default: null },
    captureTimestamp: { type: Date, default: null },
    deviceModel: { type: String, default: 'Unknown' },
    pHash: { type: String, default: null },

    uploadedBy: { type: String, default: 'Field Officer' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ProjectPhoto = mongoose.model('ProjectPhoto', projectPhotoSchema);
export default ProjectPhoto;
