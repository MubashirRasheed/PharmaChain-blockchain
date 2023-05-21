import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Button, TextField, Modal, Backdrop, Fade, CardContent, Card, CardActions, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DoneIcon from '@mui/icons-material/Done';
import SkeletonLoading from '../../components/SkeletonLoading';

const AllPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [selectedJobBid, setSelectedJobBid] = useState(null);
  const [jobCount, setJobCount] = useState(10); // start with 10 jobs
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(false);
  const userRole = useSelector((state) => state.user.role);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      let url;
      if (userRole === 'manufacturer') {
        url = 'http://localhost:9002/job-post/getManu';
      } else if (userRole === 'distributor') {
        url = 'http://localhost:9002/job-post/getDist';
      } else if (userRole === 'pharmacist') {
        url = 'http://localhost:9002/job-post/getPharma';
      }
      const result = await axios.get(url, {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log(result);
      setJobs(result.data);
    };
    fetchData();
    console.log(jobs);
  }, []);
  console.log(jobs);
  //   console.log(selectedBid);

  const handleAcceptBid = async () => {
    setLoading(true);
    console.log('bid._id', selectedBid);
    console.log('job._id', selectedJobBid);
    const response = await axios.post('http://localhost:9002/bids/accept', { bidId: selectedBid, jobId: selectedJobBid }, { headers: { 'x-auth-token': token } });
    console.log(response);
    const Chatdata = {
      title: response.data.job.title,
      is_direct_chat: false,
    };
    const bidderName = {
      username: response.data.bidder.fullname,
    };

    const newChat = await axios.post('https://api.chatengine.io/chats/', Chatdata, {
      headers: {
        'Project-ID': import.meta.env.VITE_CHAT_PROJECT_ID,
        'User-Name': user.fullname,
        'User-Secret': user.chatId,
      },
    });
    console.log('newchat response', newChat);
    const chatRoom_id = newChat.data.id;

    // eslint-disable-next-line camelcase
    const newMember = await axios.post(`https://api.chatengine.io/chats/${chatRoom_id}/people/`, bidderName, {
      headers: {
        'Project-ID': import.meta.env.VITE_CHAT_PROJECT_ID,
        'User-Name': user.fullname,
        'User-Secret': user.chatId,
      },
    });

    console.log('newmember response', newMember);

    // const chatMessage = {
    //   text: `
    //   \uD83D\uDCDD Job Details:
    //   \uD83D\uDCAC Title: *${response.data.job.title}*
    //   \uD83D\uDCCB Description: ${response.data.job.description}
    //   \uD83D\uDCB5 Price: $${response.data.job.price}
    //   \uD83D\uDCC5 Delivery Time: ${response.data.job.deliveryTime} days
    //   \uD83D\uDCD1 Status: ${response.data.job.status}
    //   \uD83D\uDC64 Posted By: ${response.data.job.postedBy}

    //   \uD83D\uDCD1 Bid Details:
    //   \uD83D\uDCB0 Bid Price: $${response.data.bidPrice}
    //   \uD83D\uDCDA Bid Delivery Time: ${response.data.bidDeliveryTime} days
    //   \uD83D\uDCD1 Bid Status: ${response.data.status}
    //   \uD83D\uDC64 Bid Posted By: ${response.data.bidder.fullname}

    //   \uD83D\uDC65 Bid Accepted By: ${user.fullname}
    //   \uD83D\uDC5B Bid Accepted On: ${response.data.acceptedOn}
    //   `,
    // };

    const chatMessage = {
      text: `
      ╔══════════════════════════════════════════════════════════════════════╗ 
      ║ 📝 Job Details:                                                     
      ╠══════════════════════════════════════════════════════════════════════╣
      ║ 💬 Title: *${response.data.job.title}*                     ║
      ║ 📋 Description: ${response.data.job.description} ║
      ║ 💵 Price: $${response.data.job.price}                              ║
      ║ 📅 Delivery Time: ${response.data.job.deliveryTime} days        ║
      ║ 📑 Status: ${response.data.job.status}                               ║
      ║ 👤 Posted By: ${response.data.job.postedBy}                ║
      ║                                   ║
      ╠═══════════════════════════════╣
      ║ 📑 Bid Details:                 ║
      ╠═══════════════════════════════╣
      ║ 💰 Bid Price: $${response.data.bidPrice}                            ║
      ║ 📚 Bid Delivery Time: ${response.data.bidDeliveryTime} days   ║
      ║ 📑 Bid Status: ${response.data.status}                            ║
      ║ 👤 Bid Posted By: ${response.data.bidder.fullname}        ║
      ║                                   ║
      ╠═══════════════════════════════╣
      ║ 👥 Bid Accepted By: ${user.fullname}                    ║
      ║ 👛 Bid Accepted On: ${response.data.acceptedOn}             ║
      ╚═══════════════════════════════╝
      `,
    };

    const newMessage = await axios.post(`https://api.chatengine.io/chats/${chatRoom_id}/messages/`, chatMessage, {
      headers: {
        'Project-ID': import.meta.env.VITE_CHAT_PROJECT_ID,
        'User-Name': user.fullname,
        'User-Secret': user.chatId,
      },
    });

    const contractResponse = await axios.post('http://localhost:9002/contract/post', { bidId: selectedBid, jobId: selectedJobBid }, { headers: { 'x-auth-token': token } });
    console.log(contractResponse);

    navigate('/chat');
    // console.log('selectedBid', selectedBid);
    // const response = await axios.post('http://localhost:9002/bids/accept', { bidId: selectedBid }, { headers: { 'x-auth-token': token } });
    // console.log(response);
  };

  const handleRejectBid = () => {
    // TODO: Implement reject bid logic
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
  console.log('selectedBid', selectedBid);
  console.log('selectedJobBid', selectedJobBid);

  const getBidderInfo = (jobId, bidId) => {
    const selectedJobd = jobs.find((job) => job._id === jobId);

    const selectedBidd = selectedJobd && selectedJobd.bids.find((bid) => bid._id === bidId);

    if (selectedBidd) {
      const { bidPrice, bidDeliveryTime } = selectedBidd;
      const bidderName = selectedBidd.bidder && selectedBidd.bidder.fullname;
      return { bidderName, bidPrice, bidDeliveryTime };
    }
    return { bidderName: '', price: '', deliveryTime: '' };
  };

  const SelectedtoApply = getBidderInfo(selectedJobBid, selectedBid);

  return (
    <Box>

      {jobs.length === 0 && (
      <Box className="flex   flex-col " sx={{ top: '50%', left: '50%', transform: 'translate(10%, 1.5%)' }}>
          {Array.from(Array(10).keys()).map((num) => (
            <Grid item xs={12} key={num}>
              <Box p={1} width="100%" marginBottom={4}>
                <SkeletonLoading animation="wave" height="75vh" sx={{ width: '100% !important', height: '60vh !important' }} />
              </Box>
            </Grid>
          ))}
      </Box>

      )}

      {jobs.slice(0, jobCount).map((job) => (
        <Box>

          <Box key={job._id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="max-w-6xl w-5/6 px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-light text-gray-600 dark:text-gray-400">Posted: {new Date(job.createdAt).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}<span className="ml-2"> {`${jobPostRole}: `}{job.postedBy.fullname}</span></span>
                <p className="px-3 py-1 text-m font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500"><MoreHorizIcon sx={{ fontSize: '1.3rem', marginRight: '3px' }} />{job.status}</p>
              </div>

              <div className="mt-2">

                <Button className="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline" tabIndex="0" role="link" sx={{ fontSize: '1.2rem' }}>{job.title}</Button>
                <p className="mt-2 ml-2 text-gray-600 dark:text-gray-300"> {job.description}</p>
              </div>
              <div className="flex flex-col mt-3" />

              <div className="flex items-center justify-between mt-4 flex-row">

                <p className="w-30 px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500">Price: ${job.price}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Delivery Time: {new Date(job.deliveryTime).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>

              </div>

              <div className="flex flex-col mt-3">
                <div className="bg-gray-100 rounded-lg p-4 mt-4 dark:bg-gray-900">
                  <div className="flex justify-between items-center border-b-2 py-2 dark:border-b-slate-700">
                    <h2 className="font-bold text-gray-800 text-xl mb-2 dark:text-gray-200">Bids:</h2>
                    <h3 className="font-semibold text-gray-800 text-base mb-2 mr-8 dark:text-gray-200">Price</h3>
                  </div>
                  <div className="max-h-60 overflow-y-scroll mt-4">
                    {job.bids != 0 ? (job.bids.map((bid) => (
                      <div key={bid._id} className="flex justify-between items-center border-b-2 py-2 dark:border-b-slate-700">
                        <div className="flex ">
                          <Avatar src={bid.bidder.picturePath} />
                          <div className="ml-3">
                            <h3 className="text-gray-800 dark:text-gray-200 font-bold">{bid.bidder.fullname}</h3> {/* Heading for bidder name */}
                            <p className="text-gray-600 dark:text-gray-500">Delivery Time: {new Date(bid.bidDeliveryTime).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} </p> {/* Heading for delivery time */}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-gray-800 font-bold dark:text-gray-200">${bid.bidPrice}</h3> {/* Heading for price */}
                          <Button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                              setSelectedBid(bid._id);
                              setSelectedJobBid(job._id);
                            }}
                            // onClick={handleBidClick(job._id, bid._id)}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    ))) : (
                      <div className="flex justify-center  items-center border-b-2 py-2 dark:border-b-slate-700">
                        <div className="flex">
                          <div className="ml-3 ">
                            <h3 className="text-gray-800 dark:text-gray-200 font-bold ">No bids yet</h3>
                          </div>
                        </div>
                      </div>

                    )}
                  </div>
                </div>
              </div>

              {console.log('selectedBid', selectedBid)}

              {selectedBid && selectedJobBid === job._id && (
              <div className="flex items-center justify-between mt-4">

                <p className="text-gray-600 dark:text-gray-300">{`Selected bid: ${SelectedtoApply.bidderName} - $${SelectedtoApply.bidPrice} - ${new Date(SelectedtoApply.bidDeliveryTime).toLocaleString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}`}</p>
                {/* <Button color="success" variant="contained" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAcceptBid}>Accept Bid</Button> */}
                <Button
                  color="success"
                  variant="contained"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleAcceptBid}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#4caf50' : '',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Accept Bid'
                  )}
                </Button>
              </div>
              )}
            </div>
          </Box>

        </Box>
      ))}
      <Button variant="contained" color="primary" sx={{ top: '50%', left: '50%', transform: 'translate(-40%, -13%)', marginBottom: '1rem' }} onClick={() => setJobCount(jobCount + 10)}>
        Load More
      </Button>
    </Box>
  );
};

export default AllPostedJobs;
