const Invoice = require('../Models/Invoice');
const Supplier = require('../Models/Supplier');
const FuelDelivery = require('../Models/FuelDelivery');
const mongoose = require('mongoose');


exports.getInvoicesWithSuppliers = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('supplierID', 'name email')
      .exec();

    invoices.forEach((invoice) => {
      if (invoice.remainingAmount === 0) {
        invoice.paymentStatus = 'Paid';
        invoice.save();
      }
    });

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
};

exports.getUnpaidInvoices = async (req, res) => {
  const { supplierID } = req.params;

  try {
    console.log(`Fetching unpaid invoices for supplier ID: ${supplierID}`);

    if (!mongoose.Types.ObjectId.isValid(supplierID)) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }
    const unpaidInvoices = await Invoice.find({
      supplierID: supplierID,
      remainingAmount: { $gt: 0 },
    });

    console.log(`Unpaid invoices: ${JSON.stringify(unpaidInvoices)}`);

    if (unpaidInvoices.length === 0) {
      return res.status(404).json({ message: 'No unpaid invoices found' });
    }

    res.status(200).json(unpaidInvoices);
  } catch (error) {
    console.error('Error fetching unpaid invoices:', error);
    res.status(500).json({ message: 'Error fetching unpaid invoices', error });
  }
};
 
exports.payInvoice = async (req, res) => {
  try {
    const { invoiceID, paymentAmount } = req.body;

    console.log(`Received payment: invoiceID = ${invoiceID}, paymentAmount = ${paymentAmount}`);

    if (!invoiceID || !paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({ message: 'Invoice ID and a positive payment amount are required.' });
    }

    const invoice = await Invoice.findById(invoiceID);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    invoice.payments.push({ amount: paymentAmount });

    const totalPayments = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    invoice.remainingAmount = invoice.totalAmount - totalPayments;

    invoice.paymentStatus = invoice.remainingAmount <= 0 ? 'Paid' : 'Unpaid';

    await invoice.save();

    return res.status(200).json({
      message: 'Payment added successfully.',
      invoice,
    });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: 'Error adding payment.', error });
  }
};
