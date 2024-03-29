import React, { useState, useEffect } from 'react';
import { Skeleton, Container, Typography, Box, Grid, Button, TextField, Modal, Backdrop, Fade } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers';
// import LocationOn from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SkeletonLoading from '../components/SkeletonLoading';

const GetJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const now = new Date();
  const localtime = now.toLocaleString();
  const [bidDeliveryTime, setBidDeliveryTime] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null); // new state variable
  const [jobCount, setJobCount] = useState(10); // start with 10 jobs
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const userId = useSelector((state) => state.user._id);
  //   const theme = useTheme();
  const themeMode = localStorage.getItem('themeMode');
  const inputTextColor = themeMode === 'Dark' ? '#fff' : undefined;

  //   console.log(userId);
  // console.log(localtime, bidDeliveryTime.toLocaleString());

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`${import.meta.env.VITE_BASE_URL}/job-post/get`, {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log(result);
      setJobs(result.data.jobs);
    };
    fetchData();
  }, []);
  console.log(jobs);

  const handleOpen = (jobId) => { // updated handleOpen function to receive the jobId as a parameter
    setSelectedJobId(jobId); // update the selectedJobId state variable with the jobId
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //   console.log(selectedJobId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      jobId: selectedJobId, // use the selectedJobId state variable to get the selected job ID
      bidPrice,
      bidDeliveryTime,
    };
    console.log(data);

    // check if the user has already submitted a bid for this job
    const selectedJob = jobs.find((job) => job._id === selectedJobId);
    const hasSubmittedBid = selectedJob.bids.some((bid) => bid.bidder === userId);

    // if (hasSubmittedBid) {
    //   alert('You have already submitted a bid for this job.');
    // } else {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/bids/post`, data, {
      headers: { 'x-auth-token': token },
    });
    console.log(response.data);
    setOpen(false);
    // }
    // const response = await axios.post('http://localhost:9002/bids/post', data, {
    //   headers: { 'x-auth-token': token },
    // });
    // console.log(response.data);
    // setOpen(false);
  };
  const handleDateChange = (newValue) => {
    setBidDeliveryTime(newValue);
  };

  let jobPostRole;

  switch (user.role) {
    case 'rawMaterialSupplier':
      jobPostRole = 'Manufacturer';
      break;
    case 'manufacturer':
      jobPostRole = 'Distributor';
      break;
    case 'distributor':
      jobPostRole = 'Pharmacist';
      break;
    default:
      jobPostRole = 'No Role';
      break;
  }

  // const defaultDate = bidDeliveryTime.trim() === '' ? new Date() : new Date(bidDeliveryTime);
  return (
    <Box>

      <Container maxWidth="md">
        <Box my={4}>
          <h1 className="text-3xl font-bold  text-gray-900 dark:text-white">Available Jobs</h1>
          <Grid container spacing={3}>
            {jobs.length === 0 && (
            <>
              {Array.from(Array(10).keys()).map((num) => (
                <Grid item xs={12} key={num}>
                  <Box p={1}>
                    <SkeletonLoading animation="wave" height={75} />
                  </Box>
                </Grid>
              ))}
            </>
            )}
            {jobs.slice(0, jobCount).map((job) => (

              <Grid item xs={12} key={job._id}>
                <Box p={2} onClick={() => handleOpen(job._id)}>

                  <div className="max-w-2xl px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-gray-600 dark:text-gray-400">Posted: {new Date(job.createdAt).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}<span className="ml-2"> {`${jobPostRole}: `}{job.postedBy.fullname}</span></span>
                      <p className="px-3 py-1 text-m font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500"><LocationOnIcon sx={{ fontSize: '1.3rem', marginRight: '3px' }} />{job.postedBy.location}</p>
                    </div>

                    <div className="mt-2">
                      {/* <a href="#" className="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline" role="link"> {job.title}</a> */}
                      <Button className="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline" tabIndex="0" role="link" sx={{ fontSize: '1.2rem' }}>{job.title}</Button>
                      <p className="mt-2 ml-2 text-gray-600 dark:text-gray-300"> {job.description}</p>
                    </div>
                    <div className="flex flex-col mt-3" />

                    <div className="flex items-center justify-between mt-4 flex-row">
                      {/* <Button variant="contained" color="primary">Apply</Button> */}

                      {/* <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline" tabIndex="0" role="link">Read more</a> */}
                      <p className="w-24 px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500" tabIndex="0">Price:{job.price}</p>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">Delivery Time: {new Date(job.deliveryTime).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>

                    </div>
                  </div>
                </Box>
              </Grid>
            ))}
            <Button justifyContent="center" alignItems="center" sx={{ top: '50%', left: '50%', marginTop: '2rem', transform: 'translate(-50%, -50%)' }} variant="outlined" color="primary" onClick={() => setJobCount(jobCount + 10)}>
              Load More
            </Button>
          </Grid>

          {/* <Modal
            open={open}
            onClose={handleClose}
          >
            {/* <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                    bgcolor: themeMode === 'Dark' ? '#1c2d38' : '#FFFFFF',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    overflow: 'scroll',
                  }}
                >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                bgcolor: themeMode === 'Dark' ? '#1c2d38' : '#FFFFFF',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                maxHeight: 500, // set a fixed height for the Box component
                overflow: 'auto !important', // add !important rule to the overflow property
              }}
            >
              <Typography variant="h5" component="h2" id="transition-modal-title">
                Apply for Job
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  id="bidPrice"
                  label="Bid Price"
                  type="number"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                {/* <TextField
                    id="bidDeliveryTime"
                    label="Bid Delivery Time"
                    // placeholder="YYYY-MM-DDTHH:MM"
                    type="datetime-local"
                    required
                    value={bidDeliveryTime}
                    onChange={(e) => setBidDeliveryTime(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                <DatePicker
                  fullWidth
                  id="deliveryTime"
                  name="deliveryTime"
                  label="Delivery Time"
                  value={bidDeliveryTime}
                  onChange={handleDateChange}
                  sx={{ '& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { color: inputTextColor } }}
                />
                <Button variant="contained" color="primary" type="submit">
                  Submit Bid
                </Button>
              </form>
            </Box>
          </Modal>
          */}
          <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center"
          >
            <div
              className=" rounded-lg w-96 max-h-500 p-8 overflow-auto"
              style={{ backgroundColor: themeMode === 'Dark' ? 'rgb(31 41 55)' : '#FFFFFF' }}
            >
              <h5
                className="text-2xl font-bold mb-4 dark:text-white text-gray-900"
                style={{ color: themeMode === 'Dark' ? 'white' : 'rgb(31 41 55)' }}
              >Apply for Job
              </h5>
              <form onSubmit={handleSubmit}>
                <TextField
                  id="bidPrice"
                  label="Bid Price"
                  type="number"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    style: { color: inputTextColor },
                  }}
                  InputProps={{
                    style: { color: inputTextColor },
                  }}
                  className="w-full mb-4 p-2 border rounded dark:bg-white dark:text-white"
                />
                <DatePicker
                  fullWidth
                  id="deliveryTime"
                  name="deliveryTime"
                  label="Delivery Time"
                  placeholder="2"
                  value={bidDeliveryTime || null}
                  // value={defaultDate}
                  onChange={handleDateChange}
                  className="w-full mb-4 p-2 border rounded"
                  disablepast
                  // inputFormat="dd/MM/yyyy"
                  InputLabelProps={{
                    style: { color: inputTextColor },
                  }}
                  InputProps={{
                    style: { color: themeMode ? '#FFFFFF' : 'inherit' },
                  }}
                  sx={{ '& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { color: inputTextColor } }}
                />
                <button
                  type="submit"
                  className="w-full mt-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                >
                  Submit Bid
                </button>
              </form>
            </div>
          </Modal>

          {/* <Button variant="contained" color="primary" onClick={handleOpen}>
            Apply
          </Button> */}
        </Box>
      </Container>

    </Box>
  );
};

export default GetJobs;
