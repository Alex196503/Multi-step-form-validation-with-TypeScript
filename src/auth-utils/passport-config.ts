import {Strategy as localStrategy} from 'passport-local';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
export function initialize(passport : any)
{
    const authenticateUser = async(email : string, password : string, done : any) =>{
        let user = await getUserByEmail(email);
        if(!user)
        {
            return done(null, false, {message: 'User not found!'});
        }
        try{
            let result = await bcrypt.compare(password, user.password);
            if(result === true)
            {
                return done(null, user);
            }
            else{
                return done(null, false, {message: 'Wrong password!'});
            }
        }catch(err)
        {
            return done(err);
        }
        
    }
    passport.use(new localStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user: any, done: any)=>{return done(null, user.id) });
    passport.deserializeUser(async(id: string, done: any)=>{
        return done(null, await getUserById(id));
    })
}
const getUserByEmail = async(email : string) =>{
    let myUser = await UserModel.findOne({email});
    return myUser;
}
const getUserById = async(id : string) => {
    let myUser = await UserModel.findById(id);
    return myUser;
}
export const ensureAuthentification = (req: Request, res: Response, next: NextFunction) =>
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/login');
}
export const ensureNotAuthentificated = (req: Request, res: Response, next: NextFunction)=>{
    if(req.isAuthenticated())
    {
        return res.redirect('/confirm');
    }
    next();
}