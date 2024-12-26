const Order = require('../Models/Order');

exports.getPostOrders = async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const postOrders = await Order.find({
      customerId,
      Status: { $in: ['Post', 'Released'] },
    });

    res.status(200).json({ orders: postOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
