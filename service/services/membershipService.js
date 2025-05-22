import Membership from "../models/membershipModel.js";
import { User } from "../models/UserModel.js";
import mongoose from "mongoose";
import stripe from "stripe";
 

 
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
 
/**
 * Subscribes a user to a membership plan and processes a payment.
 *
 * @param {string} userId - The ID of the user subscribing to the membership.
 * @param {string} paymentMethodId - The Stripe payment method ID to use for the payment.
 * @param {number} amount - The payment amount in dollars.
 * @returns {Object} The updated membership object if the subscription succeeds.
 * @throws Will throw an error if the user is not found, payment fails, or saving to the database encounters issues.
 */
export const subscribeAndProcessPayment = async (userId, paymentMethodId, amount) => {
 
 
 
  try {
    const user = await User.findById(userId).populate("membership");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
 
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
  automatic_payment_methods: {
    enabled: true, // Enable automatic payment methods
    allow_redirects: "never", // Disable redirect-based payment methods
  },
  
    });
 
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ success: false, message: "Payment failed." });
    }
 
    let membership = user.membership;
    if (!membership) {
      membership = new Membership({ membershipId: `MEM-${Date.now()}`, payments: [], status: "inactive" });
      user.membership = membership._id;
    }
 
    membership.payments.push({
      amount,
      method: "Stripe",
      transactionId: paymentIntent.id,
      status: "completed",
    });
    membership.status = "active";
    membership.activatedAt = new Date();
 
    await membership.save();
    await user.save();
 
    return membership;
  } catch (error) {
    throw new Error(error.message);
  }
};
 

/**
 * Checks the membership status of a user.
 *
 * @param {string} userId - The ID of the user to check.
 * @returns {string} The membership status ("active" or "inactive").
 * @throws Will throw an error if the user is not found or the database query fails.
 */
export const checkMembershipStatus = async (userId) => {
  try {
    console.log(`Checking membership status for userId: ${userId}`);
    const user = await User.findById(userId).populate("membership");
 
    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }
 
    if (!user.membership) {
      return "inactive";
    }
 
    const membership = user.membership;
    return membership.status;
  } catch (error) {
    throw new Error(error.message);
  }
};
 
  
 