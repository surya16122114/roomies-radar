import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import CreatePost from './pages/createpost';
import LandingPage from './pages/landingpage';
import ChatPage from './pages/chatpage';
import { Login } from './pages/loginpage';
import  Signup  from './pages/signup';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store'; // Import `persistor` from the store configuration
import ProtectedRoute from './route/protectedroute';
import ProfilePage from './pages/profilepage';
import ProfileUpdate from './pages/updateprofile';
import PostDetailsPage from './pages/postdetailspage';
import UserProfile from './pages/userprofile';
import ProfileForm from './pages/profileform';
import EditProfile from './pages/editprofile';
import UserPosts from './pages/userposts';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './materialui/theme';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ConfirmationPage from './pages/confirmationpage';
import PaymentPage from './pages/paymentpage';
import SubscribeButton from './components/subscribebutton'


//Initialize Stripe  publishable key
const stripePromise = loadStripe("pk_test_51QORwP2LqEPVDy28rbCmzdQ4ZUZCUKpzIddZ9lug71YcITM50gzJgEQ2MoNDWiNGG6KO4HAJ5BN9y9SKnBCwC7WF00Qc7imNrD");

const App: React.FC = () => {
  return (
    <Provider store={store}>
      {/* Wait for persisted state to load */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} /> {/* LandingPage with Navbar */}
              {/* Protect home route */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inbox"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscribe"
                element={
                  <Elements stripe={stripePromise}>
                    <PaymentPage />
                  </Elements>
                }
              />
              <Route
                path="/confirmation"
                element={
                  <ProtectedRoute>
                    <ConfirmationPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/pp" element={<ProfileUpdate />} />
              <Route path="/profilepage" element={<ProfilePage />} />
              {/* <Route path="/profile" element={<Profile />} /> */}
              <Route path="/create-post" element={<CreatePost />} />
              
              <Route path="/inbox" element={<ChatPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/subscribe" element={<SubscribeButton />} />

              {/* Add ProfileForm route */} 
              <Route path="/profileform/:userId" element={<ProfileForm />} />
              <Route path="/edit-profile/:userId" element={<EditProfile />} />

              {/* Add PostDetails route */}
              <Route path="/edit-post/:postId" element={<CreatePost isEditMode />} />
              <Route path="/posts/:postId" element={<PostDetailsPage />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/user-posts/:userId" element={<UserPosts />} />

            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;


