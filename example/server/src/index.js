import express from "express";
import cors from "cors";
import "dotenv/config";
import axios from "axios";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

let token = null;
// let lastTokenTimestamp = null;
const speechKey = process.env.SPEECH_KEY;
const speechRegion = process.env.SPEECH_REGION;

const getToken = async () => {
  try {
    const headers = {
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);

    token = tokenResponse.data;
    // lastTokenTimestamp = Date.now();
    console.log("Token refreshed at:", new Date(lastTokenTimestamp).toLocaleString());
  } catch (error) {
    console.error("Error while getting token:", error);
  }
};

// const scheduleTokenRefresh = () => {
//   setInterval(async () => {
//     try {
//       await getToken();
//     } catch (error) {
//       console.error("Error while scheduling token refresh:", error);
//     }
//   }, 9 * 60 * 1000); // 9 minutes in milliseconds
// };

// // Initial token generation
// getToken()
//   .then(() => {
//     scheduleTokenRefresh();
//   })
//   .catch((error) => {
//     console.error("Error while generating initial token:", error);
//   });

app.get("/token", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    // When client asks for refresh token
    const refreshTheToken = req.query?.refresh;

    if (!token || refreshTheToken) {
      await getToken();
    }

    res.send({
      token: token,
      region: speechRegion,
    });
  } catch (error) {
    console.error("Error while handling /token request:", error);
    res.status(500).send({ error: "An error occurred while processing your request." });
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));
