import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button, Divider, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog visibility

  const membership = location.state?.membership;
  const cardDetails = location.state?.cardDetails; // Retrieve card details
  const user = useSelector((state: RootState) => state.user);

  if (!membership || !cardDetails) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h5">No membership details found.</Typography>
        <Button variant="contained" onClick={() => navigate("/home")} style={{ marginTop: "20px" }}>
          Go to Home
        </Button>
      </Box>
    );
  }

  const handleConfirmPayment = () => {
    setOpenDialog(true); // Open the success dialog
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate("/home"); // Navigate to home on dialog close
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={3} style={{ padding: "20px", maxWidth: "400px", textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Confirm Your Payment
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Quickly and secure, free transactions.
        </Typography>
        <Divider style={{ margin: "20px 0" }} />
        <Box textAlign="left">
          <Typography variant="body1">
            <strong>Date:</strong> {new Date(membership.activatedAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>Payment Method:</strong> {cardDetails.cardBrand}
          </Typography>
          <Typography variant="body1">
            <strong>Card Number:</strong> **** **** **** {cardDetails.cardNumber}
          </Typography>
          <Typography variant="body1">
            <strong>Cardholder Name:</strong> {`${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            <strong>Total Amount:</strong> ${membership.payments?.[0]?.amount || "0.00"}
          </Typography>
        </Box>
        <Divider style={{ margin: "20px 0" }} />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" onClick={() => navigate("/home")}>
            Cancel Payment
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmPayment}>
            Confirm Payment
          </Button>
        </Box>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <DialogContentText>Your payment was successful!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfirmationPage;
