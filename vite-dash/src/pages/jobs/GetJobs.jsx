import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton, Container, Typography, Box, Grid, Button, TextField, Modal, Backdrop, Fade, Snackbar, Alert, Dialog, DialogTitle, DialogContent, TextareaAutosize, CircularProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers';
// import LocationOn from '@mui/icons-material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDropzone } from 'react-dropzone';
import SkeletonLoading from '../../components/SkeletonLoading';

const GetJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const now = new Date();
  const localtime = now.toLocaleString();
  const [bidDeliveryTime, setBidDeliveryTime] = useState('');
  const [bidSucessSnack, setBidSucessSnack] = useState(false);
  const [bidFailedSnack, setBidFailedSnack] = useState(false);
  const [proposal, setProposal] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null); // new state variable
  const [jobCount, setJobCount] = useState(10); // start with 10 jobs
  const [URLs, setUrls] = useState([]);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const userId = useSelector((state) => state.user._id);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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
    setFileUrl(null);
    setUploadedUrls([]);
  };
  //   console.log(selectedJobId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      jobId: selectedJobId, // use the selectedJobId state variable to get the selected job ID
      bidPrice,
      bidDeliveryTime,
      proposal,
      uploadedUrls,
    };
    console.log(data);

    // check if the user has already submitted a bid for this job
    const selectedJob = jobs.find((job) => job._id === selectedJobId);
    const hasSubmittedBid = selectedJob.bids.some((bid) => bid.bidder === userId);

    if (hasSubmittedBid) {
      alert('You have already submitted a bid for this job.');
    } else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/bids/post`, data, {
          headers: { 'x-auth-token': token },
        });
        console.log(response.data);
        setOpen(false);
        setBidSucessSnack(true);
        // }
        // const response = await axios.post('http://localhost:9002/bids/post', data, {
        //   headers: { 'x-auth-token': token },
        // });
        // console.log(response.data);
        // setOpen(false);
      } catch (error) {
        console.log(error);
        setOpen(false);
        setBidFailedSnack(true);
      }
    }
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

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setBidSucessSnack(false);
    setBidFailedSnack(false);
  };

  const handleFileUrlClose = (event, reason) => {
    if (reason === 'clickaway') {
      setFileUrl(null);
      return;
    }
    setFileUrl(null);
  };

  const Dropzone = () => {
    const onDrop = useCallback(async (acceptedFiles) => {
      setIsUploading(true);
      const URLs = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const formData = new FormData();
        const file = acceptedFiles[i];
        formData.append('file', file);
        formData.append('upload_preset', 'yjmnnmje');

        const response = await axios.post('https://api.cloudinary.com/v1_1/daz0bajhs/auto/upload', formData);

        URLs.push(response.data.secure_url);
      }
      setIsUploading(false);
      setUploadedUrls(URLs);
      setFileUrl(`${acceptedFiles.length} files uploaded`);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
      <div {...getRootProps()} sx={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'row' }}>
        <input {...getInputProps()} />

        <Button
          sx={{
            backgroundColor: '#ffffff',
            color: '#1976d2',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            mb: '1rem',
          }}
        >
          {isUploading ? (
            <CircularProgress sx={{ color: '#1976d2', mr: '0.5rem' }} size={20} />
          ) : (
            <AttachFileIcon sx={{ fontSize: '1.5rem', mr: '0.5rem' }} />
          )}
          {fileUrl ? (
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              {fileUrl}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Upload Documents
            </Typography>
          )}
        </Button>

        {/* <Button
          sx={{
            backgroundColor: '#ffffff',
            color: '#1976d2',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            mb: '1rem',
          }}
        >
          <AttachFileIcon sx={{ fontSize: '1.5rem', mr: '0.5rem' }} />
          Upload Documents
        </Button>

        {uploadedUrls.length > 0 && (
          <div>
            <Typography variant="body2" sx={{ mb: '0.5rem' }}>
              Uploaded Files:
            </Typography>
            {uploadedUrls.map((url, index) => (
              <Typography variant="body2" key={index} sx={{ textAlign: 'center' }}>
                {url}
              </Typography>
            ))}
          </div>
        )} */}
      </div>
    );
  };

  console.log('fileUrl', fileUrl);
  console.log('uploadedUrls', uploadedUrls);

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
          </Modal> */}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle
              sx={{ backgroundColor: themeMode === 'Dark' ? 'rgb(31 41 55)' : '#FFFFFF', color: themeMode === 'Dark' ? 'white' : 'rgb(31 41 55)' }}
            >
              Apply for Job
            </DialogTitle>
            <DialogContent
              sx={{
                backgroundColor: themeMode === 'Dark' ? 'rgb(31 41 55)' : '#FFFFFF',
                color: themeMode === 'Dark' ? 'white' : 'rgb(31 41 55)',
                '& .MuiTextField-root, & textarea': {
                  backgroundColor: themeMode === 'Dark' ? 'rgb(31 41 55)' : '#FFFFFF',
                  color: themeMode === 'Dark' ? 'white' : 'rgb(31 41 55)',
                  '& .MuiInputBase-input': {
                    color: inputTextColor,
                  },
                  '& .MuiFormLabel-root': {
                    color: inputTextColor,
                  },
                },
              }}
            >
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
                  onChange={handleDateChange}
                  className="w-full mb-4 p-2 border rounded"
                  disablePast
                  InputLabelProps={{
                    style: { color: inputTextColor },
                  }}
                  InputProps={{
                    style: { color: themeMode ? '#FFFFFF' : 'inherit' },
                  }}
                  sx={{ '& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root': { color: inputTextColor }, marginBottom: '1rem' }}
                />
                <TextareaAutosize
                  minRows={5}
                  placeholder="Enter your propsal..."
                  className="w-full mb-4 p-2 border rounded"
                  onChange={(e) => setProposal(e.target.value)}
                  InputLabelProps={{
                    style: { color: inputTextColor },
                  }}
                  InputProps={{
                    style: { color: themeMode ? '#FFFFFF' : 'inherit' },
                  }}
                  sx={{
                    backgroundColor: themeMode === 'Dark' ? 'rgb(31 41 55)' : '#d3d3d3',
                    color: themeMode === 'Dark' ? 'white' : 'rgb(31 41 55)',

                    '& textarea': {
                      color: inputTextColor,

                    },
                    '& .css-1xnpxhj-MuiDialogContent-root .MuiTextField-root, .css-1xnpxhj-MuiDialogContent-root textarea': {
                      borderColor: themeMode === 'Dark' ? 'orange' : '#FFFFFF',
                    },

                  }}
                />
                <Dropzone />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 4, py: 2, bgcolor: 'blue.500', '&:hover': { bgcolor: 'blue.600' } }}
                  onClick={handleSubmit}
                >
                  Submit Bid
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* <Button variant="contained" color="primary" onClick={handleOpen}>
            Apply
          </Button> */}
        </Box>
      </Container>
      <Snackbar open={bidSucessSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
          Bid placed successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={bidFailedSnack} autoHideDuration={5000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="error" sx={{ width: '100%' }}>
          Bid not placed Something went wrong!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GetJobs;
