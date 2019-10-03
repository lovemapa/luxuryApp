const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');



function encrypt(text) {
    const cipher = crypto.createCipher(algorithm, secretKey);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
function decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, secretKey);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
class commonController {
    handleValidation(err) {
        const messages = []
        for (let field in err.errors) { return err.errors[field].message; }
        return messages;
    }
    authTokenGenerate(userId) {
        return jwt.sign({ username: userId },
            'someSecretText'
        );
    }
    async generateHashEmail(email) {
        const hash = await encrypt(email);
        return hash;
    }
    async compareHashEmail(email) {
        const decryptedEmail = await decrypt(email);
        return decryptedEmail;
    }
    sendMail(email, token, cb) {
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'pk1605199432@gmail.com',
                pass: 'lovemapa!23'
            }
        };
        const transporter = nodemailer.createTransport(smtpConfig);
        const mailOptions = {
            from: 'pk1605199432@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Verification Mail', // Subject line
            html: `<p>Hello ${email} your token is ${token} </p>`

        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('email sending failed ' + error);
                cb({ status: 0, message: error })
            }
            else {
                cb({ status: 1, message: info })

            }
            transporter.close();
        });
    }




}

module.exports = new commonController()