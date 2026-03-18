import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Donation from './donation.model.js';
import Program from '../program/program.model.js';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, programId, donorDetails, isAnonymous } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Donation.create({
      programId,
      amount,
      orderId: order.id,
      donorDetails,
      isAnonymous,
      status: 'pending'
    });

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const donation = await Donation.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentId: razorpay_payment_id, 
          signature: razorpay_signature, 
          status: 'completed' 
        },
        { new: true }
      );

      if (donation) {
        // Update raised amount in Program
        await Program.findByIdAndUpdate(donation.programId, {
          $inc: { raisedAmount: donation.amount }
        });
      }

      res.json({ message: "Payment verified successfully", donation });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
