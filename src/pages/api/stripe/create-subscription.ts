import type { NextApiRequest, NextApiResponse } from "next";
import { createStandardSubscription } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateSubscriptionData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateSubscriptionData>({
    req,
    res,
    functionToRun: createStandardSubscription,
    requiredVars: ["customerId"],
    canCreateNewStripeAccount: true,
    requiresStripeAccount: true,
    method: "POST",
    addBackendVars: ["userId"],
    errorMessage: "Failed to create a subscription.",
  });
}

// import { taxRate } from "@/src/client-functions/client-stripe/utils";
// import { getTotalUsersOfInstitution } from "@/src/server/functions/server-role";
// import { validatePromoCode } from "@/src/server/functions/server-stripe";
// import { getCurrentInstitutionCustomerId } from "@/src/server/functions/server-stripe/db-requests";
// import { getStripeAccountIfAuthorized, handleStripeError } from "@/src/server/functions/server-stripe/utils";
// import { stripe } from "@/src/server/singletons/stripe";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextApiRequest, NextApiResponse } from "next";
// import type Stripe from "stripe";

// export type CreateSubscription = {
//     priceId: string;
//     quantity: number;
//     promoCode?: string; //coupon Name
// }

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     const data: CreateSubscription = JSON.parse(req.body);
//     const { userId } = getAuth(req);
//     const {promoCode} = data;

//     const {status, message, stripeAccount} = await getStripeAccountIfAuthorized(userId!)
//     if (!stripeAccount || !stripeAccount.customerId) return res.status(400).json({ message: "No stripe account." });
//     if (status || message) res.status(status).json({ message })

//     if (userId) {

//     const totalUsers = await getTotalUsersOfInstitution(req.query.institution as string)
//         const customerId = await getCurrentInstitutionCustomerId(userId!);
//         if (totalUsers > data.quantity) {
//             res.status(400).json({ message: "You cannot create a plan with fewer users than the amount of members in your institution." });
//             return;
//         }
//         if (!customerId) {
//             throw new Error("Could not create customer");
//         }
//         try {
//             // Create the subscription. Note we're expanding the Subscription's
//             // latest invoice and that invoice's payment_intent
//             // so we can pass it to the front end to confirm the payment
//             const coupon = data.promoCode && await validatePromoCode({promoCode});

//             const subscription = await stripe.subscriptions.create({
//                 customer: customerId,
//                 items: [{
//                     price: data.priceId,
//                     // price: "price_1N5sN8EwHpTUe8W7mjL7lHqF",
//                     quantity: data.quantity,

//                 }],
//                 default_tax_rates:[taxRate],
//                 metadata: {
//                     institutionId: stripeAccount.institutionId,
//                     userId: userId,
//                     hasReceived5PercentNotification: "false",
//                     hasReceived10PercentNotification: "false",
//                     hasReceived20PercentNotification: "false",
//                     hasReceivedOverageNotification: "false",
//                     hasReceivedMaxUserNotification: "false",
//                 },
//                 payment_behavior: 'default_incomplete',
//                 payment_settings: {
//                     payment_method_types: ['card', 'sepa_debit', 'paypal'],
//                     save_default_payment_method: 'on_subscription',
//                 },
//                 ...((data.promoCode && coupon) ?
//                     { coupon: coupon.id }
//                     : {}),
//                 expand: ['latest_invoice.payment_intent', "latest_invoice.total_tax_amounts.tax_rate"],
//             });
//             if (isStripeInvoice(subscription.latest_invoice) && isStripePaymentIntent(subscription.latest_invoice.payment_intent)) {
//                 res.send({
//                     latestInvoice: subscription.latest_invoice,
//                     subscriptionId: subscription.id,
//                     clientSecret: subscription?.latest_invoice?.payment_intent.client_secret,
//                 });
//             }
//         } catch (e) {
//             const { message, status } = handleStripeError(e)
//             res.status(status).json({ message })
//         }

//     } else {
//         res.status(403).json({ message: "Unauthorized" })
//     }

// }
