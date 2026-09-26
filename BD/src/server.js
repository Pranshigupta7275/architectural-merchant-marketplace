import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import app from './app.js'; 
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// 2. Define middleware BEFORE starting the server
app.use((req, res, next) => {
  console.log(`📥 Incoming ${req.method} request to: ${req.url}`);
  next();
});

// 3. Connect to DB and then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Architectural Merchant Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });