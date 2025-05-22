import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  transactionId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "completed" },
});

const MembershipSchema = new mongoose.Schema({
  
  membershipId: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  activatedAt: { type: Date, default: null },
  payments: [PaymentSchema],
});

export default mongoose.model("Membership", MembershipSchema);
