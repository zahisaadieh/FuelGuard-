const Supplier = require('../Models/Supplier'); 


const AddSupplier = async (req, res) => {
  try {
    const { email, phoneNumber, name } = req.body;

 
    if (!email || !name || !phoneNumber) {
      return res.status(400).json({ status: "error", error: "All fields are required" });
    }


    const existingSupplier = await Supplier.findByEmail(email);
    if (existingSupplier) {
      return res.status(400).json({ status: "error", error: "Email already exists" });
    }


    const supplier = new Supplier({ name, phoneNumber, email });
    const savedSupplier = await supplier.save();

   
    return res.json({ status: "success", record: savedSupplier });
  } catch (error) {
    console.error(error);  
    return res.status(500).json({ status: "error", error: error.message });
  }
};


const GetSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find(); 
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

const GetSupplier = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};


module.exports = {
  AddSupplier,
  GetSuppliers,
  GetSupplier
};
