import React from 'react';
import './style.css';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button } from '@mui/material';

const Newsletter = () => {
    return (
        <div className='newsLetterBanner'>
            <SendOutlinedIcon />
            <input type='text' placeholder='Your email address' />
            <Button className='bg-g'>Subscribe</Button>
        </div>
    )
}

export default Newsletter;