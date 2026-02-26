import 'dotenv/config'; // load .env immediately
import app from './app.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

console.log("JWT_SECRET_KEY loaded:", process.env.JWT_SECRET_KEY); 

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});