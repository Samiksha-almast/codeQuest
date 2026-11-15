import express from "express";
import cors from "cors";
import 'dotenv/config';
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT =  4000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//DB
connectDB()

//ROUTES
app.use('/api/auth', userRoutes);

app.get('/' , (req,res) => {
    res.send('API is running');
});


//App Listening
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})