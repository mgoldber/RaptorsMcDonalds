import React from 'react';
import rapLogo from '../images/raplogo.png';
import mcLogo from '../images/McDonalds.png';

const Header = (props) => {    
    return (
        <header className="Header__Component">
            <h1>{props.title}</h1>

            <nav>
                <ul>
                    <li><img src={rapLogo}  alt="Raptors Logo" /></li>
                    <li><img src={mcLogo} alt="McDonalds Logo" /></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;