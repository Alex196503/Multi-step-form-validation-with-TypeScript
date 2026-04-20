### This project is represented by a full-stack application that handles a multi step-user form, where users can make choices and complete each step of the sequence, and secures payments through Stripe. It's built with Node.js and Express, using MongoDB to keep track of user data and orders in real time.
# Key features: 
* Users can recieve different form validation messages if the form was not completed correctly
* Users can go back to a previous step to update their selections
* Users can see a summary of their selections on the final step and confirm their order
* Users can make payments using a secure Payment Integration via Stripe, handling payment status and transaction confirmation safely
* Reliable storage of user inputs and order details using MongoDB Atlas
* Fully adaptive interface that works perfectly on both desktop and mobile devices.
* A robust Node.js/Express server that manages data flow between the frontend, the database, and third-party services
* ***Automatic webhook handling***: Real-time synchronization between Stripe and the backend to instantly update order status and confirm payments without manual intervention.
* ***Production ready*** The application is deployed live via Render (a multi-cloud platform) with environment variabile kept in a .env file which was not posted in this github to secure API keys and database credentials
# Technologies used:
| Category  | Technologies |
| --------  | ------------ |
| Front-end | HTML5, CSS3, TailwindCSS, Vanilla JS(async/await, es6, import/export, high array methods, data structures like maps or sets), TypeScript, Vite(production tool used to speed up web development), EJS(template engine for rendering pages on the server) |
| Back-end  | Node.js, Express, Joi(for validating the user input), Passport.js(to import some strategies for the register & login system), Stripe.js(to connect with Stripe) |
| Data-base (non-relational) | MongoDB, Mongoose(to ensure creating the order and user model via schemas, and to make changes on the databases(update, creating) |
| Payments | Stripe API |
| Services | Nodemailer (to send the invoice to the buyer) |
| Deployment | Render |

# Setup & Installation
This project is built with TypeScript for logic and Tailwind CSS for styling. Since the browser cannot execute TypeScript or Tailwind directives directly, the project requires a local compilation step before previewing it with the Vite tool.
1. Clone this repository: ```git clone https://github.com/Alex196503/Full-Stack-Multi-Step-Form-with-TypeScript-Node.js-Stripe.git ```
2. Install dependencies: ``` npm install ```
3. Create an .env file in your root directory and add your credentials:
```
MONGO_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_key
PORT=3000
```
4. Start the project: ``` npm run dev:server ```
5. Open the project in your environment tool.

# Endpoints
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | /confirm | Renders the the initial step of the multi-step form |
| POST   | /register | Validates input and persists new user data to MongoDB |
| POST   | /login    |  Authenticates user credentials via Passport.js | 
| POST   | /api/create/checkout/session/:id | Initialises the stripe checkout session where user can pay for the chosen plan | 
| POST   | /api/webhook| Handles Stripe events (e.g., checkout.session, payment.intent) to confirm payments and update the order status |

# Workflow
1. **Authentication guard** : users are directed to the /confirm page, when a middleware checks for authentication, if not logged in, the user is automatically redirected to the login page.
2. **Form completion** : Once authenticated, the user can complete the multi-step form. Initial data is fetched from the database, while other selections are cached in localStorage to ensure a smooth transition between steps.
3. **Payment session** : Upon hitting confirm, the application triggers a Stripe checkout session where user can complete his card data to finalise the payment.
4. **Transaction handling** : If the payment was successful, the user is redirected to a success page where their order details are rendered from the database. If the payment was not successful, The user is redirected to a dedicated error page.
5. **Session management**: Users can securely logout, at the first step, from the SPA.

# Growth directions
* **OAuth Integration**: Adding Google and GitHub authentication to simplify the login process for users.
* **Modern framework**: Using a modern front-end framework like React to ensure high-performance Virtual DOM
* **Real-time Notifications**: Implementing WebSockets (Socket.io) to provide instant updates on payment status and order processing.
* **Subscription Management**: Adding a dedicated dashboard for users to upgrade, downgrade, or cancel their active subscriptions directly via Stripe Subscriptions.
  
# Documentation & resources
* [TailwindCSS documentation](https://tailwindcss.com/)
* [TypeScript documentation](https://www.typescriptlang.org/docs/handbook/utility-types.html)
* [Express documentation](https://expressjs.com/en/5x/api.html)
* [Stripe documentation](https://docs.stripe.com/webhooks)
* [Nodemailer documentation](https://nodemailer.com/message)
* [Joi.dev documentation](https://joi.dev/api/18.x.x)
* [Mongoose references](https://mongoosejs.com/docs/guide.html)
* [Passport.js guide](https://www.passportjs.org/features/)

## Project Status
- **Status** : Completed.
- This project was deployed via Render can be viewed using this link: https://multi-step-form-validation-with.onrender.com/confirm
- Author: Moldovan Alex-Cristian
