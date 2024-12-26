import React from 'react';
import { NavLink } from 'react-router-dom';
import Card from './card';

import AdminImg from '../img/adminn.svg'
import ManagerImg from '../img/managerr.svg'


function AdminHome({ isAdmin }) {
    const titles = ["Add Manager", "Add Admin"];
    const images = [AdminImg, ManagerImg];
    const links = ["userInter", "adminInter"];
    const descriptions = [
        "Manage manager profiles, details, and service records.",
        "Manage Admin profiles, details, and service records.",
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

export default AdminHome;