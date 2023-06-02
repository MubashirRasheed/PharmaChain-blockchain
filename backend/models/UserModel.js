// import mongoose from "mongoose";
// import validator from "validator";

// const userSchema = new mongoose.Schema(
//   {
//     id: {
//       type: mongoose.Schema.Types.ObjectId,
//     },
//     fullname: {
//       type: String,
//       required: true,
//       trim: true,
//       min: 2,
//       max: 100,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//       validate(value) {
//         if (!validator.isEmail(value)) {
//           throw new Error("Email is invalid");
//         }
//       },
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 5,
//       trim: true,
//       validate(value) {
//         if (value.toLowerCase().includes("password")) {
//           throw new Error('Password cannot contain the word: "password"');
//         }
//       },
//     },
//     chatId:{
//       type: String,
//     },
//     picturePath:{
//       type: String,
//       default: "https://res.cloudinary.com/daz0bajhs/image/upload/v1679767972/profpic/evagqgxxm1qk1xuhsliv.png"
//     },
//     role: {
//       type: String,
//       enum: ['admin', 'rawMaterialSupplier', 'manufacturer', 'transporter', 'distributor', 'pharmacist'],
//       required: true
//     },
//     location: {
//       type: String,
//       required: true
//     },
//     ethAddress: {
//       type: String,
//       required: true,
//       unique: true
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // const User = mongoose.model("Users", userSchema);
// const User = mongoose.model("userfyps", userSchema);

// // module.exports = User;
// export default User;

import mongoose from 'mongoose';


const jobSchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    deliveryTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Userjob',
      required: true,
    },
    bids: [
      {
        bidPrice: {
          type: Number,
          required: true,
        },
        bidDeliveryTime: {
          type: Date,
          required: true,
        },
        bidder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Userjob',
          required: true,
        },
        proposal: {
          type: String,
        },
        uploadedUrls: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    chatId:{
      type: String,
    },
  picturePath:{
      type: String,
      default: "https://res.cloudinary.com/daz0bajhs/image/upload/v1679767972/profpic/evagqgxxm1qk1xuhsliv.png"
    },
    role: {
      type: String,
      enum: ['admin', 'rawMaterialSupplier', 'manufacturer', 'transporter', 'distributor', 'pharmacist'],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      // required: true,
      // unique: true,
    },
    ethAddress: {
      type: String,
      required: true,
      unique: true,
    },
    postedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    bids: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
          required: true,
        },
        bidPrice: {
          type: Number,
          required: true,
        },
        bidDeliveryTime: {
          type: Date,
          required: true,
        },
        proposal: {
          type: String,
        },
        uploadedUrls: [
          {
            type: String,
          },
        ],
      },
    ],
    contracts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract'
    }],
    appliedJobs: [
      {
        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job',
          required: true,
        },
        status: {
          type: String,
          enum: ['applied', 'accepted', 'rejected'],
          default: 'pending',
        },
        bidPrice: {
          type: Number,
          required: true,
        },
        bidDeliveryTime: {
          type: Date,
          required: true,
        },
        proposal: {
          type: String,
        },
        uploadedUrls: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
export const User = mongoose.model('Userjob', userSchema); // for bidding
// export const User = mongoose.model('userfyps', userSchema); // for blockchaain temporary

// module.exports = { Job, User };
