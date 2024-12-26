const FuelDelivery = require('../Models/FuelDelivery');
const Supplier = require('../Models/Supplier');
const Inventory = require('../Models/Inventory');
const Invoice = require('../Models/Invoice');

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

const getInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventories' });
  }
};


const addFuelDelivery = async (req, res) => {
  const { supplierID, inventoryID, quantity, pricePerLiter } = req.body;

  try {
    if (!supplierID || !inventoryID || !quantity || !pricePerLiter) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const totalPrice = quantity * pricePerLiter;

    const date = new Date();
    const timestamp = date.getFullYear().toString() +
      ('0' + date.getSeconds()).slice(-2);

    const invoiceName = `IN${timestamp}`;

    const invoice = new Invoice({
      supplierID,
      totalAmount: totalPrice,
      invoiceName,
    });

    

    const newFuelDelivery = new FuelDelivery({
      supplierID,
      inventoryID,
      quantity,
      pricePerLiter,
      totalPrice,
      invoiceID: invoice._id,
    });

   

    const inventory = await Inventory.findById(inventoryID);
    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    inventory.currentCapacity += quantity;

    if (inventory.currentCapacity > inventory.capacity) {
      return res.status(400).json({ error: 'Inventory capacity exceeded' });
    }

    await inventory.save();
    await newFuelDelivery.save();
    await invoice.save();

    res.status(201).json({ message: 'Fuel delivery added successfully', totalPrice });
  } catch (error) {
    console.error('Error in adding fuel delivery:', error);
    res.status(500).json({ error: 'Failed to add fuel delivery' });
  }
};

const getFuelDeliveries = async (req, res) => {
  try {
    const fuelDeliveries = await FuelDelivery.find().populate('supplierID').populate('inventoryID');
    res.status(200).json(fuelDeliveries);
  } catch (error) {
    console.error('Error fetching fuel deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch fuel deliveries' });
  }
};


const updateFuelDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, pricePerLiter, inventoryID } = req.body;

    if (!quantity || quantity <= 0 || !pricePerLiter || pricePerLiter <= 0 || !inventoryID) {
      return res
        .status(400)
        .json({ message: 'Quantity, pricePerLiter, and inventoryID are required and must be positive.' });
    }

    const fuelDelivery = await FuelDelivery.findById(id).populate('invoiceID');
    if (!fuelDelivery) {
      return res.status(404).json({ message: 'Fuel delivery not found' });
    }

    const inventory = await Inventory.findById(fuelDelivery.inventoryID);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const invoice = fuelDelivery.invoiceID;
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    inventory.currentCapacity -= fuelDelivery.quantity;
    inventory.currentCapacity += quantity; 

    if (inventory.currentCapacity > inventory.capacity) {
      return res.status(400).json({ message: 'Exceeds inventory capacity.' });
    }
    if (inventory.currentCapacity < 0) {
      return res.status(400).json({ message: 'Insufficient inventory capacity.' });
    }

    const oldTotalPrice = fuelDelivery.quantity * fuelDelivery.pricePerLiter;
    const newTotalPrice = quantity * pricePerLiter;

    invoice.totalAmount += newTotalPrice - oldTotalPrice;

    const totalPayments = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    invoice.remainingAmount = invoice.totalAmount - totalPayments;

    invoice.paymentStatus = invoice.remainingAmount <= 0 ? 'Paid' : 'Unpaid';

    fuelDelivery.quantity = quantity;
    fuelDelivery.pricePerLiter = pricePerLiter;
    fuelDelivery.totalPrice = newTotalPrice;

    await Promise.all([inventory.save(), invoice.save(), fuelDelivery.save()]);

    return res.status(200).json({
      message: 'Fuel delivery updated successfully',
      fuelDelivery,
      invoice,
    });
  } catch (error) {
    console.error('Error updating fuel delivery:', error);
    res.status(500).json({ message: 'Error updating fuel delivery', error });
  }
};



const deleteFuelDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    const fuelDelivery = await FuelDelivery.findById(id).populate('invoiceID');
    if (!fuelDelivery) {
      return res.status(404).json({ message: 'Fuel delivery not found' });
    }

    const { quantity, inventoryID, invoiceID } = fuelDelivery;

    const inventory = await Inventory.findById(inventoryID);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    inventory.currentCapacity -= quantity;

    if (inventory.currentCapacity < 0) {
      return res.status(400).json({ message: 'Invalid inventory capacity' });
    }

    const invoice = await Invoice.findById(invoiceID);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    await Promise.all([inventory.save(), Invoice.findByIdAndDelete(invoiceID), FuelDelivery.findByIdAndDelete(id)]);

    return res.status(200).json({ message: 'Fuel delivery and invoice deleted successfully' });
  } catch (error) {
    console.error('Error in deleting fuel delivery:', error);
    res.status(500).json({ message: 'Error deleting fuel delivery', error });
  }
};





module.exports = {
  getSuppliers,
  getInventories,
  addFuelDelivery,
  getFuelDeliveries,
  updateFuelDelivery,
  deleteFuelDelivery,
};
