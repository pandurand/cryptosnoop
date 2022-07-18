# Cryptosnoops Privy Demo 

This demo allows you to 🌚 snoop 🌚 on Ethereum addresses. Youll receive an email anytime a non-zero amount goes to or from one of the specified accounts, with a link to the recent transaction.

## Privy features

This Privy demo showcases the following Privy API features:
- Privy integration with a third-party non-wallet auth system (Magic)
- Issuing access tokens from server-side to front-end
- The sendEmail API

`get` and `put` calls to Privy happen both in the frontend and backend. The frontend uses `privy-browser` npm package, and the backend uses the `privy-node` package. The backend additionally uses the `sendEmail` Privy functionality. 

Additionally, this demo uses two other resources: a Google Cloud Scheduler cron job, and a Serverless Redis instance for non-sensitive data (most recent account balance for an Ethereum address). This shows that Privy can be compatible with your existing databases, if you have them. With that in mind, if you're looking for a simple demo of Privy, you may want to start with one of the other [demos](https://demos.privy.io). 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Check out:

- `lib/hooks.js` for instantiating the Privy client with a custom session
- `/pages/api/update-subscription.ts` for getting all user data from Privy with `getBatch()`, and `sendEmail` usage after fetching the latest account balance via `ethers.js`
- `pages/api/privy/token.ts` for returning the token for the user authenticated via Magic
- `components/snoopForm.js` for `put()` Privy user data 
- `pages/snoops.js` for `get()` and `put()` Privy user data 

### Dependencies
In order to get an instance of cryptosnoops running fully, you must: 
- go to https://magic.link and create an acccount 
- port over the API keys from magic 
- Make a Google Cloud account (free) and create a job on Google Cloud Scheduler, hitting the url {your-app-url}/api/update-subscription
- Make an upstash.com account, create a serverless Redis database (credit card required). Integrate Upstash with your Vercel project, and port Redis url into your .env 

Remove instances of "${process.env.BASE_URL}" (it was used to put this demo on demos.privy.io)



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).