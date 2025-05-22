import * as membershipService from "../services/membershipService.js";
 
 
 
export const subscribeController = async (req, res) => {
    const { userId } = req.params; // Get user ID from the URL
    console.log("Request Params:", req.params);
    console.log(userId);
    const { paymentMethodId, amount } = req.body; // Extract payment method and amount
  
    try {
      // Call the service function to process payment and update membership
      const result = await membershipService.subscribeAndProcessPayment(userId, paymentMethodId, amount);
  console.log("inside");
      // Respond with success and membership details
      res.status(200).json({ success: true, membership: result });
    } catch (error) {
      // Handle errors and respond with failure message
      res.status(500).json({ success: false, message: error.message });
    }
  };
 
 
export const checkMembershipStatusController = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await membershipService.checkMembershipStatus(userId);
      return res.status(200).json({ membershipStatus: result });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };