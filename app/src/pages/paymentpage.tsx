import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const PaymentPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const user = useSelector((state: RootState) => state.user);

  // Pre-fill the name from Redux
  useEffect(() => {
    if (user.firstName && user.lastName) {
      setName(`${user.firstName} ${user.lastName}`);
    }
  }, [user]);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet. Please try again.");
      return;
    }

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setMessage("Card details are missing. Please try again.");
        setLoading(false);
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name },
      });

      if (error) {
        setMessage(error.message || "Payment method creation failed.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/memberships/${user.id}/subscribe`,
        {
          paymentMethodId: paymentMethod?.id,
          amount: 10, // Example amount in USD
        }
      );

      if (response.data.success) {
        navigate("/confirmation", {
          state: {
            membership: response.data.membership,
            cardDetails: {
              cardBrand: paymentMethod?.card?.brand,
              cardNumber: paymentMethod?.card?.last4,
            },
          },
        });
      } else {
        setMessage("Subscription failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Subscription Error:", error);
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f0f4f8" }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          borderRadius: "12px",
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1a73e8" }}
        >
          Enter Payment Details
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please provide your payment details to subscribe.
        </Typography>
        <Divider sx={{ margin: "20px 0" }} />
        <Box>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#f9f9f9",
              },
            }}
          />
          <Box
            sx={{
              padding: "10px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              marginBottom: "20px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#333",
                    "::placeholder": {
                      color: "#888",
                    },
                  },
                  invalid: {
                    color: "#ff5252",
                  },
                },
              }}
            />
          </Box>
          {message && (
            <Typography
              variant="body2"
              color={message.includes("successful") ? "green" : "red"}
              gutterBottom
              sx={{ marginTop: "10px" }}
            >
              {message}
            </Typography>
          )}
          {loading && (
            <CircularProgress
              sx={{
                margin: "20px auto",
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayment}
            disabled={loading}
            sx={{
              marginTop: "20px",
              backgroundColor: "#1a73e8",
              "&:hover": {
                backgroundColor: "#1558b1",
              },
              borderRadius: "8px",
              padding: "10px",
              fontSize: "16px",
            }}
          >
            Pay $10
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentPage;
