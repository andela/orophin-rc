import dotenv from "dotenv";

dotenv.config();

const config = {
  apiKey: process.env.API_KEY,
  downloadUrl: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: "orophoin-rc.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDING_ID
};

export default config;
