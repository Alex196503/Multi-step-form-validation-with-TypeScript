import 'dotenv/config';
import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.PASSWORD
    }
})
transporter.verify((err, _success)=>{
    if(err)
    {
        console.log('Error while connecting to the SMTP server! ' + err);
    }
    else{
        console.log("SMTP server ready to send messages!");
    }
})
export default async function sendEmailNotification(to : string, subject : string, text : string)
{
    try{
    let message = await transporter.sendMail({
        from: '"alexmoldovan2009@gmail.com"',
        to,
        subject,
        text
    })
    console.log(`Message with the id: ${message.messageId} was sent`);
    
    }catch(err)
    {
        console.log(`Message could not be sent!`);
    }
}