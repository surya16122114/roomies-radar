import React, { useState } from "react";
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useTranslation } from "react-i18next";
 
const SubscribeButton: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.user.id);
  const { t } = useTranslation();
  const handleSubscribeClick = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/memberships/${userId}/status`);
      console.log("Subscription Status:", response.data);
 
      if (response.data.membershipStatus === "active") {
       
        setIsDialogOpen(true); // Open the dialog
      } else {
        navigate("/subscribe");
      }
    } catch (error: any) {
      console.error("Error checking subscription status:", error.message);
      setStatusMessage("Unable to verify subscription status. Please try again.");
    }
  };
 
  const handleDialogClose = () => {
    setIsDialogOpen(false); // Close the dialog
    navigate("/home"); // Navigate to the home page
  };
 
  return (
    <>
      {/* Subscribe Button */}
      <Button
        onClick={handleSubscribeClick}
        sx={{
          color: location.pathname === '/' ? '#5C5470' : 'Black',
          fontSize: '1.2rem',
          fontWeight: location.pathname === '/' ? 'bold' : '600',
          textTransform: 'none',
          borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
          fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
          '&:hover': { textDecoration: 'underline' , color:'#5C5470'},
        }}
      >
       {t('subscribe')}
      </Button>
 
      {/* Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
           You are already subscribed
          </Typography>
          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>{statusMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="primary">
            Go to Home
          </Button>
        </DialogActions>
      </Dialog>
 
      {/* Optional Error Message */}
      {statusMessage && !isDialogOpen && (
        <Typography
          variant="body2"
          color="error"
          sx={{ textAlign: "center", marginTop: "10px" }}
        >
          {statusMessage}
        </Typography>
      )}
    </>
  );
};
 
export default SubscribeButton;
 
