const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const Customer = require('../Models/Customer');
const nodemailer = require('nodemailer');

const logout = (req, res) => {
    try {
      
      res.clearCookie('token', { httpOnly: true, path: '/' });
  
      return res.json({ status: 'ok', message: 'Logged out successfully' });
    } catch (error) {
      return res.json({ status: 'error', error: error.message });
    }
  };

  
  const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.json({ status: 'error', error: 'All fields required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ status: 'error', error: 'You are not registered from this email before' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ status: 'error', error: 'Email or Password is incorrect' });
        }

        if (!user.isActivated) {
            return res.json({ status: 'error', error: 'Activate your account, Contact with your Admin' });
        }

        let userId = user._id;
        let customerId = null;

        if (user.role === 'Customer') {

            const customer = await Customer.findOne({ userId: user._id });

            if (!customer) {
                return res.json({ status: 'error', error: 'No customer profile found for this user' });
            }

            customerId = customer._id;
        }

        const token = jwt.sign(
            { id: userId, email: user.email, role: user.role },
            user.role === 'Admin' ? process.env.ADMIN_SECRET : process.env.CLIENT_SECRET,
        );

        res.cookie('token', token, { httpOnly: true });

        return res.json({
            status: 'ok',
            message: 'Signed in successfully',
            role: user.role,
            userName: user.firstName,
            userLastname: user.lastName,
            userId: userId,  
            customerId: customerId, 
        });
    } catch (error) {
        return res.json({ status: "error", error: error.message });
    }
};


const CheckUser = async (req, res, next) => {
    try {
        const access_token = req.cookies.token
        jwt.verify(access_token, process.env.CLIENT_SECRET, (error, user) => {
            if (error)
                return res.json({ status: "error", error: error.message })

            if (!user.email)
                return res.json({ status: "error", error: "An error occured" })

            req.body.email = user.email
            return next()
        })
    } catch (error) {
        return res.json({ status: "error", error: error.message })
    }
}
const CheckCustomer = async (req, res, next) => {
    try {
        const access_token = req.cookies.token
        jwt.verify(access_token, process.env.CLIENT_SECRET, (error, user) => {
            if (error)
                return res.json({ status: "error", error: error.message })

            if (!user.email)
                return res.json({ status: "error", error: "An error occured" })

            req.body.email = user.email
            return next()
        })
    } catch (error) {
        return res.json({ status: "error", error: error.message })
    }
}

const CheckAdmin = async (req, res, next) => {
    try {
        const access_token = req.cookies.token
        jwt.verify(access_token, process.env.ADMIN_SECRET, (error, user) => {
            if (error)
                return res.json({ status: "error", error: error.message })
            if (!user.email)
                return res.json({ status: "error", error: "An error occured" })
            req.body.email = user.email
            return next()
        })
    } catch (error) {
        return res.json({ status: "error", error: error.message })
    }
}

const VerifyUser = async (req, res) => {
    return res.json({ status: "ok" })
}



const ActivateAccount = async (req, res) => {
    try {
        const access_token = req.query.token;
        
        if (!access_token) {
            return res.json({ status: "error", error: "No token provided" });
        }

        jwt.verify(access_token, process.env.ACTIVATE_ACCOUNT_SECRET, async (error, user) => {
            if (error) {
                return res.json({ status: "error", error: "Invalid or expired token" });
            }

            if (!user || !user.email) {
                return res.json({ status: "error", error: "Token is invalid or missing email" });
            }

            const email = user.email;

            const updatedUser = await User.findOneAndUpdate(
                { email },
                { isActivated: true },
                { new: true } 
            );

            if (!updatedUser) {
                return res.json({ status: 'error', error: 'User not found' });
            }

            return res.json({ status: 'ok', message: 'Account activated successfully' });
        });
    } catch (error) {
        return res.json({ status: "error", error: error.message });
    }
};




const ForgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ status: 'error', error: 'Enter an email' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ status: 'error', error: 'No user found with this email' });
        }

        const token = jwt.sign(
            { email },
            process.env.RESET_PASSWORD_SECRET,

        );

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const resetLink = `${req.protocol}://${req.headers.host}/reset_password?token=${token}`;

        const message = {
            from: `"FuelGard Support Team" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: 'Arial', sans-serif; background-color: #f4f7fa; padding: 40px; border-radius: 8px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h1>
                        <p style="color: #555; font-size: 16px; line-height: 1.5;">
                            Hello,
                        </p>
                        <p style="color: #555; font-size: 16px; line-height: 1.5;">
                            We received a request to reset your password for your FuelGard account. If you did not make this request, please ignore this email.
                        </p>
                        <p style="color: #555; font-size: 16px; line-height: 1.5;">
                            To reset your password, please click the button below. This link will expire in 1 hour for security purposes.
                        </p>
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="${resetLink}" style="background-color: #007bff; color: #ffffff; padding: 12px 30px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold;">
                                Reset Your Password
                            </a>
                        </div>
                        <p style="color: #555; font-size: 16px; margin-top: 30px;">
                            If you have any questions or need further assistance, feel free to contact our support team at <a href="mailto:support@fuelgard.com" style="color: #007bff;">support@fuelgard.com</a>.
                        </p>
                        <p style="color: #777; font-size: 14px; margin-top: 40px;">
                            Best regards,<br />
                            The FuelGard Support Team
                        </p>
                        <p style="color: #777; font-size: 12px; text-align: center;">
                            <em>This is an automated message, please do not reply.</em>
                        </p>
                    </div>
                </div>
            `,
        };


        transporter.sendMail(message, (error, info) => {
            if (error) {
                return res.json({ status: 'error', error: error.message });
            }
            return res.json({ status: 'ok', message: 'Reset password email sent' });
        });
    } catch (error) {
        return res.json({ status: 'error', error: error.message });
    }
};

const ResetPassword = async (req, res) => {
    try {
        const access_token = req.query.token;
        const { password } = req.body;

        if (!password) {
            return res.json({ status: 'error', error: 'Password is required' });
        }

        jwt.verify(access_token, process.env.RESET_PASSWORD_SECRET, async (error, user) => {
            if (error) {
                return res.json({ status: 'error', error: error.message });
            }

            if (!user.email) {
                return res.json({ status: 'error', error: 'Invalid token' });
            }

            const email = user.email;

            const hashPassword = await bcrypt.hash(password, 10);

            const updatedUser = await User.findOneAndUpdate(
                { email },
                { password: hashPassword },
                { new: true }
            );

            if (!updatedUser) {
                return res.json({ status: 'error', error: 'Failed to update password' });
            }

            return res.json({ status: 'ok', message: 'Password updated successfully' });
        });
    } catch (error) {
        return res.json({ status: 'error', error: error.message });
    }
};

module.exports = {
    SignIn,
    CheckUser,
    ActivateAccount,
    VerifyUser,
    ForgetPassword,
    ResetPassword,
    CheckAdmin,
    CheckCustomer,
    logout
}