const Order = require('../Models/Order');
const Customer = require("../Models/Customer");
const CustomerInvoice = require('../Models/CustomerInvoice ');


exports.getCustomerInvoices = async (req, res) => {
    try {
      const { customerId } = req.query;
  
      if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }
  
      const invoices = await CustomerInvoice.find({ CustomerID: customerId })
        .populate('OrderID', 'orderDate')     
        .populate('FuelTypeID', 'fuelName');   
  
      const formattedInvoices = invoices.map((invoice) => ({
        orderId: invoice.OrderID._id,
        fuelType: invoice.FuelTypeID.fuelName,
        litreOrdered: invoice.LitreOrdered,
        pricePerLiter: invoice.PricePerLiter,
        totalAmount: invoice.TotalAmount,
        orderDate: invoice.OrderID.orderDate,
        paidDate: invoice.InvoiceDate, 
      }));
  
      res.status(200).json({ invoices: formattedInvoices });
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      res.status(500).json({ error: 'Failed to fetch customer invoices' });
    }
  };