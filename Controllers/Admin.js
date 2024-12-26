const User = require('../Models/User');
const Admin = require('../Models/Admin');

const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer');


exports.addAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phoneNumber } = req.body;


        if (!email || !password || !firstName || !lastName || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required.' });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }


        const newUser = new User({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            role: 'Admin',
        });
        await newUser.save();

        const newAdmin = new Admin({
            userId: newUser._id,
        });
        await newAdmin.save();

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
        console.error('Error adding admin:', error);
        res.status(500).json({ message: 'An error occurred while adding the admin.' });
    }
};

exports.getAdmins = async (req, res) => {
    try {

        const admins = await User.find({ role: 'Admin' });

        if (!admins.length) {
            return res.status(404).json({ message: 'No admins found.' });
        }

        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'An error occurred while fetching the admins.' });
    }
};

exports.isActivated = async (req, res) => {
    const { id } = req.params; 
    const { isActivated } = req.body; 

    try {
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { isActivated },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating activation status:', error);
        res.status(500).json({ error: 'Failed to update activation status' });
    }
};
