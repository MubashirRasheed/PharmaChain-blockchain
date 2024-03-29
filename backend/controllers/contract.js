import ContractSchema from '../models/ContractSchema.js';
import {User} from '../models/UserModel.js';
import {Job} from '../models/UserModel.js';
import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe('sk_test_51N8RKnDCzgmS78jlJ4i3BgvQs3yebMnTajwncCbkmAzfOQe1leZBSBgAbataDg4Jh7Qjiq18e4SMxnKTMkXm3QVD00e5OYyOpw');

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
        contractCreatedFor: bidder._id.toString(),
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

       // Save contract to the user who created the contract
    const userCreatedContract = await User.findByIdAndUpdate(req.user.id, {
      $push: { contracts: savedContract._id }
    });

    // Save contract to the user for whom the contract is created
    const userForCreatedContract = await User.findByIdAndUpdate(
      bidder._id.toString(),
      { $push: { contracts: savedContract._id } }
    );
      res.status(201).json(savedContract);
      res.status(201);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong Contract not created' });
    }
  };

  export const conGet = async (req, res) => {
    try {

      // const contracts = await ContractSchema.find({ contractCreatedBy: req.user.id });
      const contracts = await ContractSchema.find({
        $or: [
          { contractCreatedBy: req.user.id },
          { contractCreatedFor: req.user.id }
        ]
      });
      res.json(contracts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error connot retreive contracts' });
    }
  }

  export const updateContract = async (req, res) => {
    const { contractId, paymentStatus, revenue } = req.body;
  
    try {
      const contract = await ContractSchema.findById(contractId);
  
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
  
      contract.paymentStatus = paymentStatus;
      contract.revenue = revenue;
      await contract.save();
  
      res.json({ message: 'Contract updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error, failed to update contract' });
    }
  };


  export const makePayment = async (req, res) => {
    const { contractId } = req.params;
  
    try {
      // Retrieve the contract from the database
      const contract = await ContractSchema.findById(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Contract not found' });
      }
  
      // Create a payment intent with Stripe
      console.log("CONTRACT",contract)

      const paymentIntent = await stripe.paymentIntents.create({
        amount: contract.amount * 100,
        currency: 'usd',
        payment_method_types: ['card', 'link'],
        metadata: { contract: JSON.stringify(contract)},
        // automatic_payment_methods: {
        //   enabled: true,
        // },
      });
  console.log("PAYMENT INTENT",paymentIntent)
      // Update the contract with the payment ID
      contract.paymentId = paymentIntent.id;
      contract.paymentStatus = 'pending';
      await contract.save();
      
  
      res.json({ message: 'Payment initiated', paymentId: paymentIntent.id ,clientSecret: paymentIntent.client_secret,});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong. Payment not initiated.' });
    }
  };
  

  // export const  retrieveReceipt = async (req, res) => {

  //   const {paymentId} = req.params;
  //   const charge = await stripe.paymentIntents.retrieve(paymentId);
  //   console.log("CHARGE",charge)
  //   const config = {
  //     method: 'get',
  //     maxBodyLength: Infinity,
  //     url: 'https://dashboard.stripe.com/ajax/emails/get_customer_receipt_link?include_only[]=last_sent_time,path,url&charge=ch_3N9n2UDCzgmS78jl0IOGLny3',
  //     headers: { 
  //       'x-requested-with': 'XMLHttpRequest', 
  //       'x-stripe-csrf-token': 'Dol-_n1FTMKENtldqVZ56dDWTGvA_gxckc-cBAcQTbM_uy3cCZNcnzK_XH-jxw5DbyBcsTVOmw_HTciJJxtKTzw-AYTZVJxtC3NzjlsMs9gm3yps0GIOzTw9ZE1th_90cj-ItIJ3nw==', 
  //       'x-stripe-manage-client-revision': '9b8c5d2768c0f3bf684ffb4583d044c6fbfa44c6', 
  //       'accept': 'application/json', 
  //       'accept-language': 'en-US,en-US,en', 
  //       'content-type': 'application/x-www-form-urlencoded', 
  //       'dnt': '1', 
  //       'referer': 'https://dashboard.stripe.com/test/payments/pi_3N9n2UDCzgmS78jl0ddI9kvh', 
  //       'sec-ch-ua': '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"', 
  //       'sec-ch-ua-mobile': '?1', 
  //       'sec-ch-ua-platform': '"Android"', 
  //       'sec-gpc': '1', 
  //       'stripe-account': 'acct_1N8RKnDCzgmS78jl', 
  //       'stripe-livemode': 'false', 
  //       'stripe-version': '2022-08-01', 
  //       'Cookie': '__stripe_orig_props=%7B%22referrer%22%3A%22https%3A%2F%2Fdashboard.stripe.com%2Ftest%2Fpayments%2Fpi_3N9n2UDCzgmS78jl0ddI9kvh%22%2C%22landing%22%3A%22https%3A%2F%2Fdashboard.stripe.com%2Fajax%2Femails%2Fget_customer_receipt_link%3Finclude_only%5B%5D%3Dlast_sent_time%2Cpath%2Curl%5Cu0026charge%3Dch_3N9n2UDCzgmS78jl0IOGLny3%22%7D; cid=7301f0da-a36d-403a-97e1-e8a80afcd779; machine_identifier=48EZVdqqVFPizQUq9LN4Q2miC5xybd0Xlgn7dcfMEf6TxvXPYqKxQHQ2%2FmcwZ2aF3Bg%3D; private_machine_identifier=DuBde09frNS%2FN%2BwuE4i83y17Wz8j8SwZFOdS8CaHgJp9exDKwam%2FMPIAUHURjV2gSIc%3D; site-auth=1; stripe.csrf=OGWOB0YmI1Clt8Rc-QTY3pSQ0rgtEBXHhQb4s6lxl5QJV90lMvAzDRM-QX7zla90K2bCYtiggpTThKw-iXqQaDw-AYTZVJzeqIfovE9d2AyodSQjfTYLvivohlO5QBQ_JfkJaReJBQ%3D%3D; __Host-session=snc_dash_1NuFqcsizFmjT4MNuFq1DsmR92SPzwhaQS3rbCdNzmLcJJW00U5KEP1gEqC2ie_2BULgGZqosgD5S5yEH6PLFnnTOJjc; __stripe_mid=03893767-f74c-426b-b309-49920d51ef8552748a; __stripe_sid=1b8ff151-c4b6-40ce-a202-ed60f5bca1755d48ec; user=usr_NuFqcsizFmjT4M'
  //     }
  //   };
  
  //   try {
  //     const response = await axios(config);
  //     console.log(response.data);
  //     // Handle the response data here
  //   } catch (error) {
  //     console.error(error);
  //     // Handle the error here
  //   }
  // };


  export const  retrieveReceipt = async (req, res) => {


    const {paymentId} = req.params;
    console.log("PAYMENT ID in receipt",paymentId)
    try{
    const charge = await stripe.paymentIntents.retrieve(paymentId);
    console.log("CHARGE",charge.latest_charge)
    const chargeId = charge.latest_charge;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://dashboard.stripe.com/ajax/emails/get_customer_receipt_link?include_only[]=last_sent_time,path,url&charge=${chargeId}`,
      headers: { 
        'x-requested-with': 'XMLHttpRequest', 
        'x-stripe-csrf-token': 'Dol-_n1FTMKENtldqVZ56dDWTGvA_gxckc-cBAcQTbM_uy3cCZNcnzK_XH-jxw5DbyBcsTVOmw_HTciJJxtKTzw-AYTZVJxtC3NzjlsMs9gm3yps0GIOzTw9ZE1th_90cj-ItIJ3nw==', 
        'x-stripe-manage-client-revision': '9b8c5d2768c0f3bf684ffb4583d044c6fbfa44c6', 
        'accept': 'application/json', 
        'accept-language': 'en-US,en-US,en', 
        'content-type': 'application/x-www-form-urlencoded', 
        'dnt': '1', 
        'referer': `https://dashboard.stripe.com/test/payments/${paymentId}`, 
        'sec-ch-ua': '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"', 
        'sec-ch-ua-mobile': '?1', 
        'sec-ch-ua-platform': '"Android"', 
        'sec-gpc': '1', 
        'stripe-account': 'acct_1N8RKnDCzgmS78jl', 
        'stripe-livemode': 'false', 
        'stripe-version': '2022-08-01', 
        'Cookie': '__stripe_orig_props=%7B%22referrer%22%3A%22https%3A%2F%2Fdashboard.stripe.com%2Ftest%2Fpayments%2Fpi_3N9n2UDCzgmS78jl0ddI9kvh%22%2C%22landing%22%3A%22https%3A%2F%2Fdashboard.stripe.com%2Fajax%2Femails%2Fget_customer_receipt_link%3Finclude_only%5B%5D%3Dlast_sent_time%2Cpath%2Curl%5Cu0026charge%3Dch_3N9n2UDCzgmS78jl0IOGLny3%22%7D; cid=ce4215d3-c74e-4d19-a4ac-0e652c7b78f7; machine_identifier=oZ795tL2zCzdLrYQ5owPMSLBRV8rnBbNAwSbQntNFPFwZOzGpOuYRe1%2BH52uyFXVTu0%3D; private_machine_identifier=PVP3jkitnCHXVjy7ReTqH5I3R6wQUId8KKVxxeH85qnZSjqeYedryOWvykBXTKiREDY%3D; site-auth=1; stripe.csrf=Uj31o-0im9DpA3k4X5Nds3kfXDOcy9SumC7WCKWlb_Th2yolDiR7h6bNelOBZ1fOpQtmPr3U7Z6JAK5zJv1Z3Tw-AYTZVJxS8Twad_T8Fp3V3cdvDubyN1hVBtzJ6olzx7od53HfKA%3D%3D; __Host-auth_token=keyinfo_live_0950FT0FP0bP25c0smbk188Ddlr4OM1bO8ns4Pl6wx6lI1AN0Gw5Fs5RX73W0cO1ed7GG6lw7Oe7yb7Gx88S7hM5BG58C1Jugzr9vSboR2gF7GC6lx5L03yF3O87WG4WY3OD5nFggKgfu3gQ8ki3pj4RrahO2q8dKc8p0fDNgr9eFp2iX9nC1Bvh1G8DXaTL6Ub12kdK1aKy55K39Iehk1aR4Fr44A7I65o705; __Host-session=snc_dash_1NuFqcsizFmjT4MOVv5BJuY2o1JNrnzcOt79sOLtiYuU8Rr008pcz5CYY-lhD7cLGK1zJZEocYfAmX5aNCVB1q6szMDw; __stripe_mid=5dbd2eab-c4ac-4ce4-86b5-0710aef8120879b083; __stripe_sid=cac416e2-87a3-4c03-9396-83c8312d7eed8c6119; user=usr_NuFqcsizFmjT4M'
      }
    };
    
    const response = await axios(config);
    console.log(response.data);

    res.json(response.data);

}catch(error){
  console.log(error)
}
}

  //   const config = {
  //         method: 'get',
  //         maxBodyLength: Infinity,
  //         url: `https://dashboard.stripe.com/ajax/emails/get_customer_receipt_link?include_only[]=last_sent_time,path,url&charge=${chargeId}`,
  //         headers: { 
  //           'x-requested-with': 'XMLHttpRequest', 
  //           'x-stripe-csrf-token': 'Dol-_n1FTMKENtldqVZ56dDWTGvA_gxckc-cBAcQTbM_uy3cCZNcnzK_XH-jxw5DbyBcsTVOmw_HTciJJxtKTzw-AYTZVJxtC3NzjlsMs9gm3yps0GIOzTw9ZE1th_90cj-ItIJ3nw==', 
  //           'x-stripe-manage-client-revision': '9b8c5d2768c0f3bf684ffb4583d044c6fbfa44c6', 
  //           'accept': 'application/json', 
  //           'accept-language': 'en-US,en-US,en', 
  //           'content-type': 'application/x-www-form-urlencoded', 
  //           'dnt': '1', 
  //           'referer': `https://dashboard.stripe.com/test/payments/${paymentId}`, 
  //           'sec-ch-ua': '"Microsoft Edge";v="113", "Chromium";v="113", "Not-A.Brand";v="24"', 
  //           'sec-ch-ua-mobile': '?1', 
  //           'sec-ch-ua-platform': '"Android"', 
  //           'sec-gpc': '1', 
  //           'stripe-account': 'acct_1N8RKnDCzgmS78jl', 
  //           'stripe-livemode': 'false', 
  //           'stripe-version': '2022-08-01', 
  //           'Cookie': '__stripe_orig_props=%7B%22referrer%22%3A%22https%3A%2F%2Fdashboard.stripe.com%2Ftest%2Fpayments%2Fpi_3N9n2UDCzgmS78jl0ddI9kvh%22%2C%22landing%22%3A%22https%3A%2F%2Fdashboard.stripe.com%2Fajax%2Femails%2Fget_customer_receipt_link%3Finclude_only%5B%5D%3Dlast_sent_time%2Cpath%2Curl%5Cu0026charge%3Dch_3N9n2UDCzgmS78jl0IOGLny3%22%7D; cid=ce4215d3-c74e-4d19-a4ac-0e652c7b78f7; machine_identifier=oZ795tL2zCzdLrYQ5owPMSLBRV8rnBbNAwSbQntNFPFwZOzGpOuYRe1%2BH52uyFXVTu0%3D; private_machine_identifier=PVP3jkitnCHXVjy7ReTqH5I3R6wQUId8KKVxxeH85qnZSjqeYedryOWvykBXTKiREDY%3D; site-auth=1; stripe.csrf=OFDuPCjIkas9fRJjjVNI0MuwYaWdCzVWq9DnR4pIb96TCf98VX3SLQXVlmnTamq4jOAhaKf8mnavEzWU8M8oszw-AYTZVJxak1norfojr0FHViNs_EXhMP9l4uLSE-b0e-joswjYig%3D%3D; __Host-session=snc_dash_1NuFqcsizFmjT4MO6QxVpQhDrPtbZTj4rz4qhmeV8Jf4gRH00r-3GQVkodsmqGYbYoOb1YETLZEOvf-wcuvud-CAZncE; __stripe_mid=5dbd2eab-c4ac-4ce4-86b5-0710aef8120879b083; __stripe_sid=ee72c756-c431-449b-b614-08fdb03c27e46ee14e; user=usr_NuFqcsizFmjT4M'
  //         }
  //       };

  //       const response = await axios(config);
  //       console.log(response.data);

  //       res.json(response.data);

  //   }catch(error){
  //     console.log(error)
  //   }
  // }