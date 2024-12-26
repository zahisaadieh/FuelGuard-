
const Inventory = require('../Models/Inventory');
const FuelType = require('../Models/FuelType');


const addInventory = async (req, res) => {
  try {
    const { inventoryName, capacity,currentCapacity, fuelType } = req.body;

    if (!inventoryName || !capacity || !fuelType) {
      return res.status(400).json({ status: 'error', error: 'All fields are required' });
    }

    
    let fuelTypeRecord = await FuelType.findOne({ fuelName: fuelType });
    if (!fuelTypeRecord) {
   
      fuelTypeRecord = new FuelType({ fuelName: fuelType });
      await fuelTypeRecord.save();
    }

    
    const inventory = new Inventory({
      inventoryName,
      capacity,
      currentCapacity,
      fuelTypeID: fuelTypeRecord._id,
      
    });
    const savedInventory = await inventory.save();

    
    return res.json({ status: 'success', record: savedInventory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', error: error.message });
  }
};


const getInventoryData = async (req, res) => {
  try {
    const inventoryData = await Inventory.find().populate('fuelTypeID', 'fuelName');

    const formattedData = inventoryData.map((item) => ({
      current: item.currentCapacity,
      max: item.capacity,
      type: item.fuelTypeID ? item.fuelTypeID.fuelName : 'Unknown', 
    }));

    return res.json({ status: 'success', data: formattedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', error: error.message });
  }
};

const getInventory= async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.json(inventories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch inventories' });
  }
};

const updateInventoryQuantity = async (req, res) => {
  const { oldQuantity, newQuantity } = req.body;
  const { inventoryID } = req.params;

  try {
    const inventory = await Inventory.findById(inventoryID);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    inventory.quantity += oldQuantity - newQuantity;
 
    await inventory.save();

    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating inventory quantity' });
  }
};

module.exports = {updateInventoryQuantity,  addInventory,getInventoryData,getInventory };
