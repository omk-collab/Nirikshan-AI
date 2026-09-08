import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    trancheNumber: { type: Number, required: true },
    amount: { type: Number, required: true, min: 0 },
    disbursedDate: { type: Date, default: Date.now },
    milestoneAchieved: { type: String, default: '' },
    approvedBy: { type: String, default: 'District Planning Officer' },
    status: { type: String, enum: ['DISBURSED', 'PENDING', 'HELD_FOR_REVIEW'], default: 'DISBURSED' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
