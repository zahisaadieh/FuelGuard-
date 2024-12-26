const mongoose = require('mongoose');
const Inventory = require('../Models/Inventory');
const Pump = require('../Models/Pump');
const PumpTransaction = require('../Models/PumpTransaction');

exports.getAllInventoriesAndTransactions = async (req, res) => {
  try {
    const inventories = await Inventory.find();

    const result = await Promise.all(
      inventories.map(async (inventory) => {
        const pumps = await Pump.find({ inventoryID: inventory._id });

        const pumpsWithTransactions = await Promise.all(
          pumps.map(async (pump) => {
            const transactions = await PumpTransaction.aggregate([
              { $match: { pumpId: pump._id } },
              { 
                $project: { 
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" } },
                  soldLitre: 1,
                  pricePerLiter: 1 
                }
              },
              { 
                $group: { 
                  _id: "$date", 
                  totalSoldLitre: { $sum: "$soldLitre" },
                  pricePerLiter: { $first: "$pricePerLiter" } 
                }
              },
              { $sort: { _id: 1 } }
            ]);

            const dailyTransactions = transactions.map(transaction => ({
              date: transaction._id,
              totalSoldLitre: transaction.totalSoldLitre,
              pricePerLiter: transaction.pricePerLiter
            }));

            return {
              pump,
              dailyTransactions
            };
          })
        );

        let totalSoldLitres = 0;

        pumpsWithTransactions.forEach(({ dailyTransactions }) => {
          dailyTransactions.forEach(({ totalSoldLitre }) => {
            totalSoldLitres += totalSoldLitre;
          });
        });

        const remainingCapacity = inventory.currentCapacity - totalSoldLitres;

        return {
          inventory: { ...inventory.toObject(), remainingCapacity },
          pumps: pumpsWithTransactions
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching inventories and transactions:', error);
    res.status(500).json({ message: 'Error fetching inventories and transactions', error: error.message });
  }
};
