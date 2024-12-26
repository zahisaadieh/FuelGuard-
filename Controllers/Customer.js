
const User = require('../Models/User');
const Customer = require('../Models/Customer');

const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer');


exports.addCustomer = async (req, res) => {

    try {
        const { email, password, firstName, lastName, phoneNumber, creditLimit } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'Email already exists.' });

        const newUser = new User({
            email,
            password,
            firstName,
            lastName, 
            phoneNumber,
            role: 'Customer',
        });


        await newUser.save();


        const newCustomer = new Customer({
            userId: newUser._id,
            creditLimit,
            remainingLimit: creditLimit, 
        });


        await newCustomer.save();



        const token = jwt.sign(
            {
                email: email
            },
            process.env.ACTIVATE_ACCOUNT_SECRET
        )

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            }
        });

        var message = {
            from: "FuelGuard <no-reply@fuelguard.com>",
            to: email,
            subject: "Activate Your FuelGuard Account",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 2rem; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
                    <h1 style="color: #0056b3; text-align: center;">Welcome to FuelGuard</h1>
                    <p style="font-size: 16px;">Hello,</p>
                    <p style="font-size: 16px;">
                        Thank you for signing up with <strong>${req.headers.host}</strong>. 
                        To complete your registration, please click the button below to activate your account.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${req.protocol}://${req.headers.host}/activate_account?token=${token}" 
                           style="display: inline-block; padding: 10px 20px; background-color: #0056b3; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">
                           Activate My Account
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #555;">
                        If you did not create an account with us, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #aaa; text-align: center;">
                        &copy; ${new Date().getFullYear()} FuelGuard. All rights reserved.
                    </p>
                </div>
            `,
        };

        transporter.sendMail(message, function (error, info) {
            if (error)
                return res.json({ status: "error", error: error.message });

            return res.json({ status: "ok" })
        });


        res.status(201).json({ status: 'success', message: 'Customer added successfully.' });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ message: 'An error occurred while adding the customer.' });
    }
};

exports.getCustomers = async (req, res) => {
    try {

        const Users = await User.find({ role: 'Customer' });
        const customers = await Customer.find();

        if (!Users.length) {
            return res.status(404).json({ message: 'No Customers found.' });
        }

        res.status(200).json([Users, customers]);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'An error occurred while fetching the customers.' });
    }
};

exports.isActivated = async (req, res) => {
    const { id } = req.params;
    const { isActivated } = req.body;

    try {

        const updatedUser = await User.findByIdAndUpdate(id, { isActivated }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Manager not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating activation status:', error);
        res.status(500).json({ error: 'Failed to update activation status' });
    }
};


exports.getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params; 

    if (!customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Customer ID is required.',
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      customer,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error fetching customer data.',
      error: error.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const {
      creditLimit,
      email,
      firstName,
      lastName,
      phoneNumber,
      ...otherCustomerUpdates
    } = req.body;

    console.log('Updating customer with ID:', customerId);
    console.log('Received customer data:', req.body);

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }

    const customer = await Customer.findById(customerId).populate('userId');
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const user = customer.userId;
    if (!user) {
      return res.status(404).json({ error: 'Associated user not found' });
    }

    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    if (creditLimit !== undefined) {
      const oldCreditLimit = customer.creditLimit;
      const oldRemainingLimit = customer.remainingLimit;

      customer.remainingLimit = creditLimit - oldCreditLimit + oldRemainingLimit;
      console.log(customer.remainingLimit);
      customer.creditLimit = creditLimit;
      await customer.save();
    }

    res.status(200).json({ message: 'Customer and user updated successfully', customer, user });
  } catch (error) {
    console.error('Error updating customer and user:', error);
    res.status(500).json({ error: 'Failed to update customer and user', details: error.message });
  }
};
