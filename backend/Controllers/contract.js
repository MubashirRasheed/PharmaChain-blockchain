import ContractSchema from '../Models/ContractSchema.js';
import {User} from '../Models/UserModel.js';
import {Job} from '../Models/UserModel.js';

 export const  conPost = async (req, res) => {
    console.log(req.body.bidId, req.body.jobId)
    const jobId = req.body.jobId;
    const bidderId = req.body.bidId;
    try {
      const job = await Job.findById(jobId);
      const bid = job.bids.find((bid) => bid._id.toString() === bidderId);
      const bidder = await User.findById(bid.bidder._id.toString());

      console.log("JOB   ",job)
      console.log("BID   ",bid)
      console.log("BIDDER   ",bidder)
      
      const contract = new ContractSchema({
        contractId: `CONTRACT-${Date.now()}`,
        contractCreatedBy: req.user.id,
        contractCreatedFor: bidderId,
        contractDate: Date.now(),
        bidderName: bidder.fullname,
        paymentId: Date.now(),
        jobTitle: job.title,
        job: req.body.jobId,
        amount: bid.bidPrice,
        location: bidder.location,
        paymentStatus: 'pending'
      });
  
      const savedContract = await contract.save();
      res.status(201).json(savedContract);
      res.status(201);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong Contract not created' });
    }
  };

  export const conGet = async (req, res) => {
    try {

      const contracts = await ContractSchema.find({ contractCreatedBy: req.user.id });
      res.json(contracts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error connot retreive contracts' });
    }
  }