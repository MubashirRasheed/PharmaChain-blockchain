import {User} from '../models/UserModel.js';
import {Job} from '../models/UserModel.js';


export const jobPost = async (req, res) => {
    try {
        const { title, description, price, deliveryTime } = req.body;
  
        const job = new Job({
          title,
          description,
          price,
          deliveryTime,
          postedBy: req.user.id,
        });
  
        await job.save();
        // Push new job post into the postedJobs array of the user who posted it
    const user = await User.findByIdAndUpdate(req.user.id, {
        $push: { postedJobs: job._id }
      });
      console.log(user);
  
        res.json({ job });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        }
    };

export const jobGet = async (req, res) => {
    
        // try {
        //     console.log('inside job get',req.user.id, req.params.jobId);

        //   const job = await Job.findById(req.params.jobId).populate('postedBy', 'role');
        //   console.log('after finding job',job);
        //   const user = await User.findById(req.user.id);
      
        //   if (!job) {
        //     return res.status(404).json({ error: 'Job not found' });
        //   }
      
        //   if (
        //     (job.postedBy.role === 'manufacturer' && user.role === 'rawMaterialSupplier') ||
        //     (job.postedBy.role === 'distributor' && user.role === 'manufacturer') ||
        //     (job.postedBy.role === 'pharmacist' && user.role === 'distributor')
        //   ) {
        //     return res.json(job);
        //   } else {
        //     return res.status(401).json({ error: 'Unauthorized access' });
        //   }
        // } catch (err) {
        //   console.error(err);
        //   return res.status(500).json({ error: 'Server error' });
        // }
        // try {
        //     const jobs = await Job.find({ postedBy: req.user.id });
        //     res.json(jobs);
        //   } catch (err) {
        //     console.error(err.message);
        //     res.status(500).send("Server Error");
        //   }
       
            // try {
            //   const jobs = await Job.find({}).populate({
            //     path: 'postedBy',
            //     match: { role: 'manufacturer' },
            //     select: '-password', // Exclude password field from user object
            //   });
            //     res.json(jobs);
            //     } catch (err) {
            //     console.error(err.message);
            //     res.status(500).send("Server Error");
            //     }

            
                try {
                  let jobs;
                  const user = await User.findById(req.user.id);
                  const role = user.role
                  console.log("🚀 ~ file: jobPostController.js:82 ~ jobGet ~ role:", role)
              
                  if (role === "rawMaterialSupplier") {
                    // Get jobs posted by all rawMaterialSuppliers
                    jobs = await Job.find({
                      postedBy: { $in: await User.find({ role: "manufacturer" }) }, status: "open"
                    });
                  } else if (role === "manufacturer") {
                    // Get jobs posted by the user's postedJobs array (i.e., jobs that the user posted)
                    jobs = await Job.find({
                        postedBy: { $in: await User.find({ role: "distributor" }) }, status: "open"
                      }).populate({
                        path:"postedBy", 
                        select:"fullname email location"})
                  } else if (role === "distributor") {
                    // Get jobs posted by the user's distributors
                    jobs = await Job.find({
                        postedBy: { $in: await User.find({ role: "pharmacist" }) }, status: "open"
                      }) 
                      .populate({
                        path:"postedBy", 
                        select:"fullname email location"})
                  } else {
                    res.status(400).json({ error: "Invalid user role" });
                    return;
                  }
              
                  res.json({ jobs });
                } catch (err) {
                  console.error(err.message);
                  res.status(500).send("Server Error");
                }
              
              
              
        };


        // GET /jobs
export const getAllJobsManu = async (req, res) => {
    // try {

    //   const jobs = await Job.find().populate('bids.bidder');
    //   res.status(200).json(jobs);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ message: 'Server error' });
    // }

    try {
        const manufacturerId = req.user.id;
        
        // Find all jobs posted by the manufacturer
        const jobs = await Job.find({ postedBy: manufacturerId })
        
          // Populate the `bids` field with the corresponding `bidder` information
          .populate({
            path: 'bids',
            populate: {
              path: 'bidder',
              options: { strictPopulate: false },
            },
          });
          
        console.log('jobs:', jobs);
        
        // Send the retrieved jobs as a response
        res.status(200).json(jobs);
        
      } catch (error) {
        console.log('Error fetching jobs:', error.message);
        res.status(500).json({ message: 'Error fetching jobs' });
      }
      
  }


  export const getAllJobsDist = async (req, res) => {
    // try {

    //   const jobs = await Job.find().populate('bids.bidder');
    //   res.status(200).json(jobs);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ message: 'Server error' });
    // }

    try {
        const distributorId = req.user.id;
        
        // Find all jobs posted by the manufacturer
        const jobs = await Job.find({ postedBy: distributorId })
        
          // Populate the `bids` field with the corresponding `bidder` information
          .populate({
            path: 'bids',
            populate: {
              path: 'bidder',
              options: { strictPopulate: false },
            },
          });
          
        console.log('jobs:', jobs);
        
        // Send the retrieved jobs as a response
        res.status(200).json(jobs);
        
      } catch (error) {
        console.log('Error fetching jobs:', error.message);
        res.status(500).json({ message: 'Error fetching jobs' });
      }
      
  }


  export const getAllJobsPharma = async (req, res) => {
    // try {

    //   const jobs = await Job.find().populate('bids.bidder');
    //   res.status(200).json(jobs);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ message: 'Server error' });
    // }

    try {
        const pharmacistId = req.user.id;
        
        // Find all jobs posted by the manufacturer
        const jobs = await Job.find({ postedBy: pharmacistId })
        
          // Populate the `bids` field with the corresponding `bidder` information
          .populate({
            path: 'bids',
            populate: {
              path: 'bidder',
              options: { strictPopulate: false },
            },
          });
          
        console.log('jobs:', jobs);
        
        // Send the retrieved jobs as a response
        res.status(200).json(jobs);
        
      } catch (error) {
        console.log('Error fetching jobs:', error.message);
        res.status(500).json({ message: 'Error fetching jobs' });
      }
      
  }