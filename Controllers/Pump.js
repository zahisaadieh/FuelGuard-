const Inventory = require('../Models/Inventory');
const Pump = require('../Models/Pump');
const PumpTransaction = require('../Models/PumpTransaction');
const Order = require('../Models/Order');
const Customer = require('../Models/Customer'); 


exports.addPump = async (req, res) => {
  const { pumpName, inventoryID } = req.body;
  console.log('Received pump data:', { pumpName, inventoryID });

  if (!pumpName || !inventoryID) {
    return res.status(400).json({ message: 'Pump name and inventory ID are required.' });
  }

  try {
    const inventory = await Inventory.findById(inventoryID);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found.' });
    }
    const existingPump = await Pump.findOne({ pumpName });
    if (existingPump) {
      return res.status(400).json({ message: 'Pump with this name already exists.' });
    }

    const newPump = new Pump({
      pumpName,
      inventoryID
    });

    await newPump.save();

    return res.status(201).json({ message: 'Pump added successfully', pump: newPump });
  } catch (error) {
    console.error('Error adding pump:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getPumps = async (req, res) => {
  try {
    const pumps = await Pump.find().populate('inventoryID');
    return res.status(200).json(pumps);
  } catch (error) {
    console.error('Error fetching pumps:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}; 



exports.stopPumpTransaction = async (req, res) => {
  try {
    const { pumpId, orderId, oldCounter, currentCounter, pricePerLiter } = req.body;

    if (!pumpId || oldCounter === undefined || currentCounter === undefined || !pricePerLiter) {
      return res.status(400).json({
        status: 'error',
        message: 'Pump ID, counters, and price per liter are required.',
      });
    }

    const soldLitre = parseFloat((currentCounter - oldCounter).toFixed(2));

    const transaction = new PumpTransaction({
      pumpId,
      orderId: orderId || null,
      oldCounter,
      currentCounter,
      pricePerLiter,
      soldLitre,
    });

    await transaction.save();

    const pump = await Pump.findById(pumpId).populate('inventoryID');
    if (!pump || !pump.inventoryID) {
      return res.status(404).json({
        status: 'error',
        message: 'Pump or inventory not found.',
      });
    }

    const inventory = pump.inventoryID;
    try {
      await inventory.updateCurrentCapacity(soldLitre);
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message, 
      });
    }

    if (orderId) {
      console.log('Updating order with ID:', orderId);

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          litreOrdered: soldLitre,
          Status: 'Released',
          totalAmount: soldLitre * pricePerLiter,
        },
        { new: true }
      );

      console.log('Updated order:', order);
      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'Order not found.',
        });
      }

      const customer = await Customer.findById(order.customerId);

      if (!customer) {
        return res.status(404).json({
          status: 'error',
          message: 'Customer not found.',
        });
      }

      const totalCost = soldLitre * pricePerLiter;
      const updatedRemainingLimit = (customer.remainingLimit - totalCost).toFixed(2);

      if (updatedRemainingLimit < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient remaining limit.',
        });
      }

      customer.remainingLimit = updatedRemainingLimit;
      await customer.save();
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Transaction saved successfully, and order status updated.',
      transaction,
    });
  } catch (error) {
    console.error('Error saving pump transaction:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error saving pump transaction',
      error: error.message,
    });
  }
};
