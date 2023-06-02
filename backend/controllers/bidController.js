import {User} from '../models/UserModel.js';
import {Job} from '../models/UserModel.js';


export const bidPost = async (req, res) => {
    try {
        const { jobId, bidPrice, bidDeliveryTime, proposal, uploadedUrls } = req.body;
        const  userId  = req.user.id; // assuming user is authenticated

console.log('inside bidpost userid', userId)
        const userd = await User.findById(userId);
        console.log(userd);


        const role = userd.role;
    
        // if (role !== 'rawMaterialSupplier') {
        //   return res.status(403).json({ message: 'Forbidden' });
        // }
    
        const job = await Job.findById(jobId);
        if (!job) {
          return res.status(404).json({ message: 'Job not found' });
        }
    
        const bid = {
          bidPrice,
          bidDeliveryTime,
          bidder: userId,
          proposal,
          uploadedUrls
        };
    
        job.bids.push(bid);
        await job.save();
    
        const user = await User.findById(job.postedBy);
        user.bids.push({
          jobId: job._id,
          bidPrice,
          bidDeliveryTime,
        });
        await user.save();
console.log('inside bidpost userd', job.id)
       
        userd.appliedJobs.push({
          job: job._id, 
          bidPrice,
          bidDeliveryTime,
          status: 'applied', 
          proposal,
          uploadedUrls
        });
        await userd.save();
    
        res.status(201).json({ message: 'Bid submitted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }


    export const bidAccepts = async (req, res) => {
      try{
        console.log(req.body.bidId, red.body.JobId)
      const user = await User.findById(req.user.id);
      const job = await Job.findById(req.body.bidId);
      console.log(job);
      const bid = job.bids.find((bid) => bid._id.toString() === req.params.bidId);
      if (!bid) {
        return res.status(404).json({ message: 'Bid not found' });
      }
      if (bid.bidder.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      job.status = 'closed';
      job.bids = job.bids.filter((bid) => bid._id.toString() !== req.params.bidId);
      job.acceptedBid = bid;
      await job.save();
      user.bids = user.bids.filter((bid) => bid._id.toString() !== req.params.bidId);
      await user.save();
      res.status(200).json({ message: 'Bid accepted successfully' });

    }catch(error){
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }

    }

    export const bidAccept = async (req, res) => {
      // const acceptBid = async (jobId, bidderId) => {
        console.log(req.body.bidId, req.body.jobId)
        const jobId = req.body.jobId;
        const bidderId = req.body.bidId;
        try {
          const job = await Job.findById(jobId);
          const bid = job.bids.find((bid) => bid._id.toString() === bidderId);
          const bidder = await User.findById(bid.bidder._id.toString());

console.log('job', job)
            
            // Update job status to closed
            job.status = 'closed';
            await job.save();
          
            // Update user's appliedJobs status to accepted
            console.log('bidderApplied jobs', bidder.appliedJobs)
            const appliedJob = bidder.appliedJobs.find((job) => job.job.toString() === jobId);
            console.log('appliedJob', appliedJob)
            appliedJob.status = 'accepted';
            await bidder.save();
          
            return res.json({ success: true, job, bidder });
          } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'An error occurred.' });
          }
          
          
          // const bidder = await User.findById(bidderId);
          // res.status(200).json({ message: 'Bid accepted successfully',  bidder });
      
          // if (!job) {
          //   return { success: false, message: 'Job not found.' };
          // }
      
          // if (!bidder) {
          //   return { success: false, message: 'Bidder not found.' };
          // }
      
          // const selectedBid = job.bids.find(
          //   (bid) => bid.bidder.toString() === bidderId.toString()
          // );
      
          // if (!selectedBid) {
          //   return { success: false, message: 'Bid not found.' };
          // }
      
          // if (job.status !== 'open') {
          //   return { success: false, message: 'Job is not open for bids.' };
          // }
      
          // job.status = 'closed';
          // job.bids.forEach((bid) => {
          //   if (bid.bidder.toString() !== bidderId.toString()) {
          //     bid.status = 'rejected';
          //   }
          // });
          // selectedBid.status = 'accepted';
          // await job.save();
      
        
      
    }