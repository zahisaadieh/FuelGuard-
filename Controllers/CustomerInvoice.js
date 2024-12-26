const Order = require('../Models/Order');
const Customer = require("../Models/Customer");
const CustomerInvoice = require('../Models/CustomerInvoice ');

exports.getReleasedOrdersByCustomer = async (req, res) => {
    try {
        const { userId } = req.params; 

        const orders = await Order.find({ customerId: userId, Status: 'Released' })
            .populate({
                path: 'customerId', 
                select: 'userId',  
                populate: {
                    path: 'userId',  
                    select: 'firstName lastName'  
                }
            })
            .populate('fuelTypeId', 'fuelName'); 

        if (!orders.length) {
            return res.status(404).json({ message: 'No Released orders found for this customer' });
        }

        return res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching Released orders for customer:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.markOrdersAsPaid = async (req, res) => {
  const { orderIds, totalPaidAmount } = req.body;

  try {
    const orders = await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { Status: "Paid" } }
    );

    if (orders.modifiedCount === 0) {
      return res.status(400).json({ message: "No orders were updated" });
    }

    const order = await Order.findById(orderIds[0]);
    const customer = await Customer.findById(order.customerId);

    customer.remainingLimit += totalPaidAmount;

    await customer.save();

    for (const orderId of orderIds) {
      const order = await Order.findById(orderId).populate("fuelTypeId");

      const customerInvoice = new CustomerInvoice({
        CustomerID: order.customerId,
        FuelTypeID: order.fuelTypeId._id,
        OrderID: order._id,
        LitreOrdered: order.litreOrdered,
        PricePerLiter: order.pricePerLiter,
        TotalAmount: order.totalAmount,
      });

      await customerInvoice.save();
    }

    res.status(200).json({ message: "Orders marked as paid and invoices created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking orders as paid" });
  }
};