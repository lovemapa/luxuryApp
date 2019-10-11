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

    sendMail(email, _id, token, type, cb) {

        var route;
        if (type == 'user')
            route = 'user'
        else
            route = 'service'
        var html, subject
        if (_id == undefined || token == undefined) {
            subject = 'Account verifciation'
            html = `<p><a href='http://192.168.1.11:8081/api/${route}/verify/'>Click this link to verfiy</a></p>`
        }
        else {
            subject = 'Request for Change Password'
            html = `<p><a href='http://192.168.1.11:8081/api/${route}/forgetpassword/?token=${token}&user=${_id}'>click here to change password</a></p>`

        }
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
            subject: subject, // Subject line
            html: html

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


    sendMailandVerify(email, _id, token, type, cb) {

        var route;
        if (type == 'user')
            route = 'user'
        else
            route = 'service'
        var html, subject

        subject = 'Account verifciation'
        html = `<p><a href='http://192.168.1.11:8081/api/${route}/verify/?token=${token}&user=${_id}'>Click this link to verfiy</a></p>`

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
            subject: subject, // Subject line
            html: html

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