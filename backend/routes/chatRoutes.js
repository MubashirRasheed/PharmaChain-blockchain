import express from "express";
import axios from "axios";

const router = express.Router()

router.post("/login", async (req, res) => {
    try {
      
        const {fullname, chatId} = req.body
        console.log('At server side',fullname, chatId);

        const chatEngineResponse = await axios.get(
            "https://api.chatengine.io/users/me",
            {
                headers: {
                    "Project-ID": process.env.PROJECT_ID,
                    "User-Name": fullname,
                    "User-Secret": chatId,
                  },
            }
        )
  
      res.status(200).json({response: chatEngineResponse.data});
      // res.status(200)
    } catch (error) {
      console.error("error: ", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
router.post("/signup", async (req, res) => {
    try {
      
        const {fullname, chatId} = req.body
        console.log(fullname, chatId);
  
        const chatEngineResponse = await axios.post(
            "https://api.chatengine.io/users/",{
                username: fullname,
                secret: chatId
            },
            {
                headers: {"Private-Key": process.env.PRIVATE_KEY}
            }
        )


      res.status(200).json({ response: chatEngineResponse.data });
    } catch (error) {
      console.error("error: ", error.message);
      res.status(500).json({ error: error.message });
    }
  });

export default router