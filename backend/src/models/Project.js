import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
    projectName: { type: String, required: true, trim: true },
    state: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    constituency: { type: String, default: '' },
    mp: { type: String, default: '' },
    description: { type: String, default: '' },
    workType: { type: String, required: true, index: true },
    category: { type: String, default: 'Civil Infrastructure' },
    agency: { type: String, default: 'Public Works Department (PWD)' },
    contractor: { type: String, default: 'Unassigned' },

    sanctionedAmount: { type: Number, required: true, min: 0 },
    estimatedCost: { type: Number, required: true, min: 0 },
    actualCost: { type: Number, required: true, min: 0 },
    expenditure: { type: Number, default: 0, min: 0 },

    physicalProgress: { type: Number, default: 0, min: 0, max: 100 },
    financialProgress: { type: Number, default: 0, min: 0, max: 100 },

    startDate: { type: Date, default: Date.now },
    expectedCompletionDate: { type: Date, required: true },
    actualCompletionDate: { type: Date, default: null },
    delayDays: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'DELAYED', 'PENDING_REVIEW'],
      default: 'IN_PROGRESS',
      index: true,
    },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

// Compound indices for fast production query filtering
projectSchema.index({ state: 1, district: 1 });
projectSchema.index({ status: 1, workType: 1 });

// Virtual properties for calculated financial ratios (Section 31)
projectSchema.virtual('costDeviation').get(function () {
  if (!this.estimatedCost || this.estimatedCost === 0) return 0;
  return Number((((this.actualCost - this.estimatedCost) / this.estimatedCost) * 100).toFixed(2));
});

projectSchema.virtual('progressGap').get(function () {
  return Number((this.financialProgress - this.physicalProgress).toFixed(2));
});

projectSchema.virtual('expenditureRatio').get(function () {
  if (!this.sanctionedAmount || this.sanctionedAmount === 0) return 0;
  return Number(((this.expenditure / this.sanctionedAmount) * 100).toFixed(2));
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

export const Project = mongoose.model('Project', projectSchema);
export default Project;
