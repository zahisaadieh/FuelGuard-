const Order = require('../Models/Order');
const Customer = require('../Models/Customer');

exports.createOrder = async (req, res) => {
  try {
    const { customerId, fuelTypeId, litreOrdered, pricePerLiter, totalAmount } = req.body;

    const newOrder = new Order({
      customerId,
      fuelTypeId,
      litreOrdered,
      pricePerLiter,
      totalAmount,
      Status: 'Post',
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()

    res.status(200).json( orders );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.searchOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('fuelTypeId')
      .populate('customerId'); 

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.Status === 'Post') {
      const remainingLimit = order.customerId.remainingLimit;

      return res.status(200).json({
        litreOrdered: order.litreOrdered,
        status: order.Status,
        fuelName: order.fuelTypeId.fuelName,
        remainingLimit: remainingLimit,
        pricePerLiter: order.pricePerLiter,
      });
    } else {
      return res.status(400).json({ message: 'Order status is not Post' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error searching for order' });
  }
};

