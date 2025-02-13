
import express from "express";

import mongoose from "mongoose";

import multer from "multer";

import helmet from "helmet";

import bodyParser from "body-parser";

import cors from "cors";

import dotenv from "dotenv";

import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import {createPost} from './controllers/posts.js'

import User from "./models/User.js"
import Post from "./models/Post.js"
import { users,posts } from "./data/index.js";

/*CONFIGURATION*/
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
app.use(express.json())
app.use("/assets",express.static(path.join(__dirname,"public/assets")))

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))

app.use(morgan("common"))

app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(bodyParser.json({limit:"30mb",extended:true}))

app.use(cors())


/*FILE STORAGE */
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload = multer({storage})

/*ROUTES WITH FILES*/
app.post("/auth/register",upload.single("Picture"),register);
app.post("/posts",verifyToken,upload.single("Picture"),createPost)

/*ROUTES */
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)

/*MONGOOSE SETUP */
const PORT = process.env.PORT  || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`server port : ${PORT}`))

    // /*ADD DATA ONE TIME*/
    // User.insertMany(users)
    // Post.insertMany(posts)
})
.catch((error) => console.log(`${error} the server did not connect`))
