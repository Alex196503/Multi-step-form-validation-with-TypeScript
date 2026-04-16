import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import type {Request, Response, NextFunction} from 'express';
import { router } from '../routes/router';
import path from 'path';
import { fileURLToPath } from 'url';
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(flash());
app.use(session({secret: process.env.SECRET_KEY || 'keyboard_cat_default_secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        maxAge: 24*60*60*1000
    }
}))
const distPath = path.join(__dirname, '../../dist');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(distPath));
const port = process.env.PORT || 3000;
app.use(router);
app.use((req: Request, res: Response)=>{
    console.log(`File not found! ${req.url}`);
    return res.status(404).render('error', {error: 'File not found! Go back to the main file!'});
})
if(process.env.MONGO_URL){
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log(`Succesfully connected to database`)
}).catch((err)=>{
    throw new Error(`Something bad happened! ${err}`);
})
}
app.use((error: Error, _req: Request, res : Response, _next: NextFunction)=>{
    console.log(error.stack);
    res.status(500).send("Something bad happened!");
})

app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
    console.log(`Access http://localhost:${port}/confirm to begin the login process!`);
})