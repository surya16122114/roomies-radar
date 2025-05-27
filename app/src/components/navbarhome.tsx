import { Button, Link } from '@mui/material';
import React from 'react';


const NavbarHome: React.FC = () => {
  return (
    <>
      {/* Subscribe Button */}
      <Button
            component="a"
            href="/"
            sx={{
              color:'Black',
              fontSize: '1.2rem',
              fontWeight: location.pathname === '/' ? 'bold' : '600',
              textTransform: 'none',
              borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
              fontFamily: 'Cambria, Cochin, Georgia, Times, Times New Roman, serif',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' , color:'#5C5470'},
            }}
          >
            Home
        </Button>
    </>
  );
}

export default NavbarHome;
