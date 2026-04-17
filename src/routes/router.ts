import express from 'express';
import type {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { ensureAuthentification, ensureNotAuthentificated, initialize } from '../auth-utils/passport-config';
import { loginSchema, registerSchema } from '../auth-utils/validation';
import { UserModel } from '../models/User';
import { type User, type OrderRequest } from '../types';
import { OrderModel } from '../models/Order';
const router = express.Router();
let stripe = null;
/* vercel deploy la final vezi acolo intreaba localhost vezi baza de date etc */
if(process.env.STRIPE_KEY)
{
    stripe = new Stripe(process.env.STRIPE_KEY);
}
// front-end path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../../dist');
router.get('/register', ensureNotAuthentificated, (_req: Request, res: Response)=>{
    res.render('register', {title: 'Register'});
});
router.get('/login',  ensureNotAuthentificated, (_req: Request, res: Response)=> {
    res.render('login', {title : 'Login'});
})
initialize(passport);
router.post('/register', ensureNotAuthentificated, async(req: Request, res: Response, _next: NextFunction)=>{
    const {email, password, name, phone} = req.body as Omit<User, 'id'>;
    if(!email || !password || !name || !phone)
    {
        return res.status(400).render('error', {error: 'All fields required!'});
    }
    const {error} = registerSchema.validate(req.body);
    if(error)
    {
        return res.status(400).render('register', {title : 'Register', error :error.details[0].message});
    }
    try{
        let saltRounds = 10;
        let genSalted = await bcrypt.genSalt(saltRounds);
        let hashedPassword = await bcrypt.hash(password, genSalted);
        let savedUser = await UserModel.create({
            name : name,
            password : hashedPassword,
            email : email.toLowerCase(),
            phone : phone
        });
        console.log("User saved!" + savedUser);
        return res.status(201).redirect('/login?success=UserCreated!');
    }catch(err : any)
    {
        if(err.code = 11000)
        {
            return res.status(400).render('register', {
                title: 'register',
                error: 'Email is already being used by someone!'
            })
        }
        return res.status(500).render('error', {error: 'Internal server error!'});
    }
})
router.post('/login', ensureNotAuthentificated, (req : Request, res : Response, next: NextFunction) => {
    const {error} = loginSchema.validate(req.body);
    if(error)
    {
        return res.status(400).render('login', {
            title: 'Login',
            error: error.details[0].message
        })
    }
    next();
}, passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/confirm',
    failureFlash : true
}))
router.post('/logout', ensureAuthentification, (req : Request, res : Response, next : NextFunction)=>{    
    req.logOut((err)=>{
        if(err) return next(err);
        req.session.destroy((err)=>{
        if(err) return next(err);
        res.clearCookie('connect.sid');
        return res.status(200).json({message: 'Logged out successfully!'});
        })
    })
})
router.get('/', (_req, res)=>{
    return res.redirect('/confirm');
})
router.get('/confirm', ensureAuthentification, (_req: Request, res : Response)=>{
    res.sendFile(path.join(distPath, 'index.html'));
})

router.post('/api/order', ensureAuthentification, async(req: Request, res : Response)=>{
    try{
    const {addons, planBilling, planType, totalPrice} = req.body as OrderRequest;
    if(!planBilling || !planType || totalPrice === null)
    {
        return res.status(400).json({message: 'Some fields are missing', totalPrice, addons, planBilling, planType});
    }
    const orderCreated = await OrderModel.create({
        selectedPlan: planType,
        billingInterval: planBilling,
        selectedAddons: addons,
        totalPrice: totalPrice,
        UserId: (req.user as any).id
    });
    return res.status(201).json({orderId: orderCreated.id});
}catch(err)
{
    return res.status(500).json({message: 'Something bad happened!'});
}
})
    
router.get('/api/user',ensureAuthentification, (req: Request, res: Response)=>{
    const user = req.user as Omit <User, 'password'>;
    return res.json({
        id:user.id,
        name:user.name,
        email:user.email,
        phone:user.phone
    });
})
router.post('/api/create/checkout/session/:id', ensureAuthentification, async(req:Request, res:Response)=>{
    try{
        let orderId = req.params.id as string;
        let orderExists = await OrderModel.findOne({_id : orderId});
        if(!orderExists)
        {
            return res.status(404).json({message: `Order with the id ${orderId} not found!`});
        }
        let totalPrice = orderExists.totalPrice as number;
        let planChosen = orderExists.selectedPlan;
        const user = req.user as Omit <User, 'password'>;
        if(stripe && req.user && planChosen)
        {
            const session = await stripe.checkout.sessions.create({
                customer_email: user.email,
                mode: "payment",
                payment_method_types:['card'],
                metadata:{
                    order_id: orderId
                },
                line_items:[
                    {
                        price_data:{
                            currency: 'usd',
                            product_data:{
                                name: planChosen.charAt(0).toUpperCase() + planChosen.slice(1)
                            },
                            unit_amount: totalPrice * 100,
                        },
                        quantity: 1
                    }
                ],
                success_url: `${process.env.SERVER_URL}/success.html?orderId=${orderId}`,
                cancel_url: `${process.env.SERVER_URL}/cancel.html`
            })
            return res.json({url : session.url});
        }
    }catch(err)
    {
        return res.status(500).json({message: err});
    }
})
router.post('/api/orders', ensureAuthentification, async(req: Request, res: Response)=>{
    const user = req.user as Omit<User, 'password'>;
    try{
    let orders = await OrderModel.find({UserId: user.id});
    return res.status(200).json({orders});
    }catch(err)
    {
        return res.status(500).json({message: `Something bad happened! ${err}`});
    }
})
export {router};