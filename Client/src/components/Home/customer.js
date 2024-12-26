import React from 'react';
import { NavLink } from 'react-router-dom';
import Card from './card';

import PaidImg from '../img/paid.svg'
import PandingImg from '../img/panding.svg'
import GenerateImg from '../img/generate.svg'


function CustomerHome({ isCustomer }) {
    const titles = ["Genrate Bill","Post Order","Paid Order"];
    const images = [GenerateImg,PandingImg,PaidImg];
    const links = ["generateBill","postOrder","paidOrder"];
    const descriptions =[
        "Generate a detailed bill for the customer's order, including fuel type, quantity, and total.",
        "Post a new fuel order by specifying the customer, fuel type, and order details.",
        "View and manage orders that have been paid, including order history and payment details.",
      ];
    return (

        <div className="myCards">
            <div className="cards-container">
                {
                    titles.map((title, i) => (
                        <NavLink to={links[i]} key={i} style={{ textDecoration: 'none' }}>
                            <Card
                                title={title}
                                img={images[i]}
                                description={descriptions[i]}
                            />
                        </NavLink>
                    ))
                }
            </div>
        </div>
    );
}

export default CustomerHome;