const FuelType = require('../Models/FuelType');

exports.getFuelType = async (req, res) => {
    try {
        const fuelTypes = await FuelType.find();
        res.json(fuelTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatedFuelType = async (req, res) => {
    try {
        const { pricePerLiter } = req.body;
        const updatedFuelType = await FuelType.findByIdAndUpdate(
            req.params.id,
            { pricePerLiter },
            { new: true }
        );

        if (!updatedFuelType) {
            return res.status(404).json({ error: 'Fuel type not found' });
        }

        res.json(updatedFuelType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
