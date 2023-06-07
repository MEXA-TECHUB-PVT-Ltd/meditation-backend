
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");;
const emailOTPBody = require("../utils/emailOTPBody")

const otp = function (otp) {
    this.email = admin.email;
    this.otp = admin.otp;
    this.status = admin.status;
};
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'ihteshamm112@gmail.com',
        pass: 'fzcnqvtxfzxarjxr',
    },
});

const sendOTPVerificationEmail = async (email, res) => {
    try {
        if (!email || email === '') {
            res.json({
                message: "Please Enter your Email",
                status: false,
            });
        } else {
            sql.query(`CREATE TABLE IF NOT EXISTS public.otp (
            id SERIAL,
            email text,
            otp text,
            status text,
            createdAt timestamp NOT NULL,
            updatedAt timestamp ,
            PRIMARY KEY (id));` , async (err, result) => {
                if (err) {
                    res.json({
                        message: "Try Again",
                        status: false,
                        err
                    });
                } else {
                    let result;
                    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
                    console.log(otp)
                    const found_email_query = 'SELECT * FROM otp WHERE email = $1'
                    const foundStoredOtp = await sql.query(found_email_query, [email])

                    if (foundStoredOtp.rowCount == 0) {
                        const query = 'INSERT INTO otp (id, email , otp, status, createdAt, updatedAt) VALUES (DEFAULT, $1 , $2, $3, NOW(), NOW()) RETURNING*'
                        result = await sql.query(query, [email, otp, 'pending'])
                        result = result.rows[0]
                    }

                    if (foundStoredOtp.rowCount > 0) {
                        let query = 'UPDATE otp SET otp = $1  WHERE email = $2 RETURNING*'
                        let values = [
                            otp ? otp : null,
                            email ? email : null
                        ]
                        result = await sql.query(query, values);
                        result = result.rows[0]
                    }

                    let sendEmailResponse = await transporter.sendMail({
                        from: 'verification@meditations.com',
                        to: email,
                        subject: 'Verify Account',
                        html: emailOTPBody(otp, "Meditation", "#746C70")

                    });

                    console.log(sendEmailResponse);

                    if (sendEmailResponse.accepted.length > 0) {
                        res.status(200).json({
                            message: `Sent a verification email to ${email}`,
                            success: true,
                            data: result
                        });
                    }
                    else {
                        res.status(404).json({
                            message: `Could not send email`,
                            success: false,
                        });
                    }
                }
            });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: `Internal server error occurred`,
            success: false,
        });
    }
}


otp.VerifyEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const found_email_query = 'SELECT * FROM "user"  WHERE email = $1'
        const foundResult = await sql.query(found_email_query, [email])
        if (foundResult.rowCount > 0) {
            sendOTPVerificationEmail(foundResult.rows[0].email, res)
        }
        else {
            const found_email_query = 'SELECT * FROM "admin"  WHERE email = $1'
            const foundResult = await sql.query(found_email_query, [email])
            if (foundResult.rowCount > 0) {
                sendOTPVerificationEmail(foundResult.rows[0].email, res)
            } else {
                res.json({
                    message: "This email is not Registered with this app , please add valid email",
                    status: false
                })
            }
        }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

otp.verifyOTP = async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const found_email_query = 'SELECT * FROM otp WHERE email = $1 AND otp = $2'
        const result = await sql.query(found_email_query, [email, otp])
        if (result.rowCount > 0) {
            let query = 'UPDATE otp SET status = $1  WHERE email = $2 RETURNING*'
            let values = [
                'verified',
                email ? email : null
            ]
            let updateResult = await sql.query(query, values);
            updateResult = updateResult.rows[0]

            res.json({
                message: "OTP verified",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Incorrect OTP",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: `Internal server error occurred`,
            success: false,
        });
    }
}
module.exports = otp;
