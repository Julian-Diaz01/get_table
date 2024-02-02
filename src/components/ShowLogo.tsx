// ShowLogo.tsx
import React from 'react';
import {Avatar} from '@mui/material';

interface ShowLogoProps {
    logo?: {
        directLink?: string;
    };
}

const ShowLogo: React.FC<ShowLogoProps> = ({logo}) => {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', width: '50px'}}>

            {logo && logo.directLink ? (
                <img src={logo.directLink} alt="Logo"
                     style={{height: '100%', width: 'auto', mixBlendMode: 'multiply',}}/>
            ) : (
                <Avatar sx={{height: '50px', width: '50px', backgroundColor: '#6caeff40'}}/>
            )}
        </div>
    );
};

export default ShowLogo;
