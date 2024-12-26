const PumpTransaction = require('../Models/PumpTransaction'); // Ensure the path is correct

exports.getLastCurrentCounter = async (req, res) => {
  try {
    const { id: pumpId } = req.params;

    if (!pumpId) {
      return res.status(400).json({ message: 'Pump ID is required' });
    }

    const lastTransaction = await PumpTransaction.findOne({ pumpId })
      .sort({ transactionDate: -1 }) 
      .populate('pumpId', 'pumpName') 
      .populate('orderId', 'totalAmount'); 

    if (!lastTransaction) {
      return res.status(404).json({ message: 'No transactions found for this Pump ID' });
    }

    res.status(200).json({ 
      pumpId: lastTransaction.pumpId,
      currentCounter: lastTransaction.currentCounter,
      transactionDate: lastTransaction.transactionDate
    });
  } catch (error) {
    console.error('Error fetching the last currentCounter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
