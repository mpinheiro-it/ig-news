import {query as q} from 'faunadb';
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
){

    //searching the user in the Fauna DB by the customer ID
    //and getting the "ref" field data
    const userRef = await fauna.query(
        q.Select(
            "ref", //if wanted more field could be included here
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )
    
    //obtaining all data from subscription since it did not come in the webhook
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    //data that I want to save in the DB
    const subscriptionData = {
        id: subscription.id,
        user_Id: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
    }

    //saving in the DB
    await fauna.query(
        q.Create(
            q.Collection('subscriptions'),
            {data: subscriptionData}
        )
    )


}