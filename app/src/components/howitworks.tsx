import React from 'react';
import { Container, Typography, List, ListItem, Paper } from '@mui/material';
// import '../styles/howitworks.css'

// Define a functional component
const Howitworks: React.FC = () => {
  const heading: string = "How it works?";

  const Sentence = [
    "Sign-up and Login: Users begin by creating an account with their personal details like name, email, and password. Once registered, they can log in securely to access the platform.",
    "Profile Setup: After logging in, users can complete their profile by providing information about their preferences, lifestyle habits, and other relevant details that will help match them with potential roommates.",
    "Roommate Search: Users can browse through available rooms, search for listings based on location, price, and other criteria, and also create their own room listings for others to view.",
    "Matching and Communication: Based on shared preferences, users can connect with other members, send messages, and explore potential roommate options.",
    "Secure and Easy Experience: The entire process ensures data security, smooth user experience, and privacy protection, allowing users to find a suitable roommate and housing situation with ease."
  ];

  return (
    <div className='HowitWorks' id='howitworks'>
      <Typography variant="h1" style={{ 
        fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', 
        fontSize: '2.5rem', 
        fontWeight: 700, 
        textAlign: 'center', 
        paddingTop: '5rem' 
      }}>
        {heading}
      </Typography>
      <Container>
        <Paper elevation={3} style={{ backgroundColor: '#FFEBE2', 
          borderTopLeftRadius: '180px', 
          borderBottomRightRadius: '180px', 
          padding: '2rem',
          
           }}>
          <List>
            {Sentence.map((feature, index) => (
            <ListItem key={index} style={{     marginLeft: '10rem',     textAlign: 'center', 
                fontSize: '1.3rem', fontWeight: 550, fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', width: '55rem' }}>
                {feature}
              </ListItem>
            ))}
          </List>
          
        </Paper>
      </Container>
    </div>
  );
};

export default Howitworks;
