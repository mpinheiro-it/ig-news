import { NextApiRequest, NextApiResponse } from "next";
import {query as q} from 'faunadb';
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string
    }
    data: {
        stripe_customer_id: string
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    
    const session = await getSession({ req })

    if (req.method == 'POST'){

    //getting the session user from the fauna database
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)                    
                )
            )
        )

        let customerId = user.data.stripe_customer_id //from the DB

            if (!customerId) {
                const stripeCustomer = await stripe.customers.create({
                    email: session.user.email,
                    //metadata
                })

                //adding the stripe customer into the database as well
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {//info sendo salva no DB
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )  

            customerId = stripeCustomer.id          
        }
               
       
        

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                {price: 'price_1KZlKgAgBRHwch2aMIRN7jIW', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })

    } else {
        res.setHeader('Allow','POST')
        res.status(405).end('Method not allowed')
    } 
}