const express = require('express');
const cors = require('cors');
const { connectDB } = require('./MongoDB/Connection');
const path = require('path')
const cookieParser = require('cookie-parser')


const employeeRoutes = require('./Routes/Employee');
const inventoryRoutes = require('./Routes/Inventory');
const supplierRoutes = require('./Routes/Supplier');
const managerRoutes = require('./Routes/Manager');
const adminRoutes = require('./Routes/Admin');
const fuelDeliveryRoutes = require('./Routes/FuelDelivery');
const userRoutes = require('./Routes/User');
const invoiceRoutes = require('./Routes/Invoice');
const customerRoutes = require('./Routes/Customer');
const pumpRoutes = require('./Routes/Pump');
const fuelTypeRoutes = require('./Routes/FuelType');
const orderRoutes = require('./Routes/Order');
const postOrderRoutes = require('./Routes/PostOrder');
const paidOrderRoutes = require('./Routes/PaidOrder');
const customerInvoiceRoutes = require('./Routes/CustomerInvoice');
const fuelTransactionRoutes = require('./Routes/FuelTransaction');
const dailyAccountRoutes = require('./Routes/DailyAccount');


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());



connectDB();


app.use('/api/employees', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/fuel-delivery', fuelDeliveryRoutes);
app.use('/api/user', userRoutes);
app.use('/api', invoiceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/pump', pumpRoutes);
app.use('/api/fueltype', fuelTypeRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/postOrder', postOrderRoutes);
app.use('/api/paidOrder', paidOrderRoutes);
app.use('/api/customerInvoices', customerInvoiceRoutes);
app.use('/api/fuelTransaction', fuelTransactionRoutes);
app.use('/api/dailyAccount', dailyAccountRoutes);


app.use(express.static(path.join(__dirname, "Client/build")))

const buildPath = path.normalize(path.join(__dirname, "Client/build"))

app.use(express.static(buildPath))

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
