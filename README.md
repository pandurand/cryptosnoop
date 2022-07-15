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


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).