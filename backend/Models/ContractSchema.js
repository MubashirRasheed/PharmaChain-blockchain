import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    contractId: {
        type: String,
        required: true,
        unique: true,
        },
    contractDate: {
      type: Date,
      default: Date.now,
    },
    contractCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Userjob',
      required: true,
    },
    contractCreatedFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userjob',
        required: true,
        },
    bidderName: {
      type: String,
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    jobTitle: {
        type: String,
        required: true,
        },
    amount: {
      type: Number,
      required: true,
    },
    revenue: {
        type: Number,
        default: 0,
        },
    location: {
        type: String,
        required: true,
        },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      // enum: ['paid', 'failed', 'pending', 'closed', 'Succeeded', ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contract', contractSchema);
