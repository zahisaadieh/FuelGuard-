import React from 'react';
import { NavLink } from 'react-router-dom';
import Card from './card';

import DailyAccountImg from '../img/dailyAccount.svg'
import CostumerImg from '../img/costumer.svg'
import employeeImg from '../img/employee.svg'
import PumpImg from '../img/pump.svg'
import supplierImg from '../img/supplier.svg'
import FuelDeliveryImg from '../img/fuelDelivery.svg'
import InvoiceImg from '../img/invoice.svg'
import InventoryImg from '../img/inventory.svg'
import cpaid from '../img/cpaid.svg'

function ManagerHome() {
    const titles = ["Daily Account", "Inventory", "Petrol Pump", "Suppliers", "Customers", "Employees", "Fuel Delivery", "Invoices", "Customer Invoices"];
    const images = [DailyAccountImg, InventoryImg, PumpImg, supplierImg, CostumerImg, employeeImg, FuelDeliveryImg, InvoiceImg, cpaid];
    const links = ["/dailyAccount", "/inventory", "/petrolPump", "/suppliers", "/customers", "/employees", "/fuelDelivery", "/invoices", "/customerInvoices"];
    const descriptions = [
        "View and manage daily accounts, track expenses, and monitor balances.",
        "Monitor and manage inventory levels, orders, and stocks.",
        "Track petrol pump operations, sales, and fuel levels.",
        "Manage supplier profiles, orders, and delivery records.",
        "Manage customer profiles, details, and service records.",
        "View and manage employee profiles and track their information.",
        "Monitor and record fuel deliveries and supplier details.",
        "View and manage invoices, payments, and transaction history.",
        "View and manage invoices for customer, payments, and transaction history.",
    ];

    return (

        <div className="myCards">
            <div className="cards-container">
                {
                titles.map((title, i) => {
                    return (
                        <NavLink to={links[i]} key={i} style={{ textDecoration: 'none' }}>
                            <Card
                                title={title}
                                img={images[i]}
                                description={descriptions[i]}
                            />
                        </NavLink>
                    )
                })}
            </div>
        </div>
    );
}

export default ManagerHome;
