//const nodemailer = require('nodemailer');
const DaoUser = require('../DAO/DaoMail');
const erreurReturn = require('../erreur')

const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

module.exports.send = async function (ctx) {
    const { mail } = ctx.request.header
    const { langue } = ctx.query

    if(!mail)    ctx.throw(202, erreurReturn.erreurReturn(5))

    var langTarget;
    var subject;
    switch (langue) {
        case "langFR":
            langTarget = "langFR";
            subject = "Réinitialiser votre mot de passe"
            break;
        case "langEN":
            langTarget = "langEN";
            subject = "Reset your password"
            break;
        case "langES":
            langTarget = "langES";
            subject = "Restablecer su contraseña"
            break;
        case "langIT":
            langTarget = "langIT";
            subject = "Reimposta la tua password"
            break;
        default:
            langTarget = "langFR";
            subject = "Réinitialiser votre mot de passe"
    }


    const all = await DaoUser.sed(mail);

    if (all != 401) {

        var transporter = nodemailer.createTransport({
            host: 'xxxxxx',
            port: 465,  //25,
            // secure: false,
            //service: 'gmail',
            auth: {
                user: 'xxxxxx',
                pass: 'xxxxxx'
            },
            tls: {
                rejectUnauthorized: false
            },
        });

        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('api2/html/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('api2/html/'),
        };

        transporter.use('compile', hbs(handlebarOptions))

        if (all == "ok") {
            const uuid = await DaoUser.uuidNewPasse(mail);

            let lien = "https://madiona.alwaysdata.net/smartpot/php_server/verification_reinitialiser_mdp.php?uuid=" + uuid + "&token=" + ctx.request.jwtPayloadTo + "&langue=" + langue

            var mailOptions = {
                from: 'xxxxxx', // sender address
                to: mail, // list of receivers
                subject: subject,
                template: langTarget, // the name of the template file i.e email.handlebars
                context:{
                    lien: lien
                }
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    //return console.log(error);
                }
                //console.log('Message sent: ' + info.response);
            });

            const add = await DaoUser.add(mail);

            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            let liste = JSON.stringify(add)
            liste = liste.substr(1, liste.length - 2)

            let jsonRes = "{" + liste + "," + response + "}"
            ctx.body = JSON.parse(jsonRes);
            //ctx.body = add
        }
        else if (all == "ok2") {
            const uuid = await DaoUser.uuidNewPasse(mail);

            let lien = "https://madiona.alwaysdata.net/smartpot/php_server/verification_reinitialiser_mdp.php?uuid=" + uuid + "&token=" + ctx.request.jwtPayloadTo + "&langue=" + langue

            var mailOptions = {
                from: 'xxxxxx', // sender address
                to: mail, // list of receivers
                subject: subject,
                template: langTarget, // the name of the template file i.e email.handlebars
                context:{
                    lien: lien
                }
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    //return console.log(error);
                }
                //console.log('Message sent: ' + info.response);
            });

            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            ctx.body = JSON.parse("{\"temps\" : 0," + response + "}");
        }
        else {
            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            ctx.body = JSON.parse("{\"temps\" : " + all + "," + response + "}");
        }

    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(3))
    }
}

module.exports.sendNewMail = async function (ctx) {
    const { mail, new_mail } = ctx.request.header
    const { langue } = ctx.query

    if(!mail)    ctx.throw(202, erreurReturn.erreurReturn(5))
    if(!new_mail)    ctx.throw(202, erreurReturn.erreurReturn(5))


    var langTarget;
    var subject;
    switch (langue) {
        case "langFR":
            langTarget = "langFRMail";
            subject = "Confirmez votre adresse e-mail"
            break;
        case "langEN":
            langTarget = "langENMail";
            subject = "Confirm your email address"
            break;
        case "langES":
            langTarget = "langESMail";
            subject = "Confirme su dirección de correo electrónico"
            break;
        case "langIT":
            langTarget = "langITMail";
            subject = "Conferma il tuo indirizzo email"
            break;
        default:
            langTarget = "langFRMail";
            subject = "Confirmez votre adresse e-mail"
    }


    var transporter = nodemailer.createTransport({
        host: 'xxxxxx',
        port: 465,
        auth: {
            user: 'xxxxxx',
            pass: 'xxxxxx'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('api2/html/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('api2/html/'),
    };

    transporter.use('compile', hbs(handlebarOptions))

    const existe = await DaoUser.verif(mail, new_mail);

    if (existe == 1) {
        ctx.throw(202, erreurReturn.erreurReturn(5))
    }
    const uuid = await DaoUser.uuidNewPasse(mail);

    let lien = "https://madiona.alwaysdata.net/smartpot/php_server/verification_mail.php?uuid=" + uuid + "&token=" + ctx.request.jwtPayloadTo + "&mail=" + new_mail + "&langue=" + langue

    var mailOptions = {
        from: 'xxxxxx', // sender address
        to: new_mail, // list of receivers
        subject: subject,
        template: langTarget, // the name of the template file i.e email.handlebars
        context:{
            lien: lien
        }
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            ctx.body = JSON.parse(erreurReturn.erreurReturn(25));
        }
        //console.log('Message sent: ' + info.response);
    });

    ctx.body = JSON.parse(erreurReturn.erreurReturn(0));
    //ctx.body = add
}

module.exports.newCompte = async function (mail, langue, token ) {
    //const { mail } = ctx.request.header
    //const { langue } = ctx.query

    //if(!mail)    ctx.throw(202, erreurReturn.erreurReturn(5))

    if (langue!="langFR" && langue!="langEN" && langue!="langES" && langue!="langIT") {
        langue = "langFR"
    }
    let langTarget;
    let subject;
    switch (langue) {
        case "langFR":
            langTarget = "langFRCompte";
            subject = "Confirmer votre compte"
            break;
        case "langEN":
            langTarget = "langENCompte";
            subject = "Confirm your account"
            break;
        case "langES":
            langTarget = "langESCompte";
            subject = "Confirme su cuenta"
            break;
        case "langIT":
            langTarget = "langITCompte";
            subject = "Conferma il tuo account"
            break;
        default:
            langTarget = "langFRCompte";
            subject = "Confirmer votre compte"
    }


    var transporter = nodemailer.createTransport({
        host: 'xxxxxx',
        port: 465,
        auth: {
            user: 'xxxxxx',
            pass: 'xxxxxx'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('api2/html/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('api2/html/'),
    };

    transporter.use('compile', hbs(handlebarOptions))

    const uuid = await DaoUser.uuid(mail);

    if (uuid) {
        let lien = "https://madiona.alwaysdata.net/smartpot/php_server/verification_compte.php?uuid=" + uuid["uuid"] + "&token=" + token + "&langue=" + langue

        var mailOptions = {
            from: 'xxxxxx', // sender address
            to: mail , // list of receivers
            subject: subject,
            template: langTarget, // the name of the template file i.e email.handlebars
            context:{
                lien: lien
            }
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                //ctx.body = JSON.parse(erreurReturn.erreurReturn(25));
                return 25
            }
        });
        return 200
        //ctx.body = JSON.parse(erreurReturn.erreurReturn(0));
    }
    else {
        return 25
        //ctx.body = 25
    }
}

module.exports.confirmAccount = async function (ctx) {
    let { data, langue } = ctx.request.header

    if(!data)    ctx.throw(202, erreurReturn.erreurReturn(5))

    if (langue!="langFR" && langue!="langEN" && langue!="langES" && langue!="langIT") {
        langue = "langFR"
    }
    let langTarget;
    let subject;
    switch (langue) {
        case "langFR":
            langTarget = "langFRCompte";
            subject = "Confirmer votre compte"
            break;
        case "langEN":
            langTarget = "langENCompte";
            subject = "Confirm your account"
            break;
        case "langES":
            langTarget = "langESCompte";
            subject = "Confirme su cuenta"
            break;
        case "langIT":
            langTarget = "langITCompte";
            subject = "Conferma il tuo account"
            break;
        default:
            langTarget = "langFRCompte";
            subject = "Confirmer votre compte"
    }


    var transporter = nodemailer.createTransport({
        host: 'xxxxxx',
        port: 465,
        auth: {
            user: 'xxxxxx',
            pass: 'xxxxxx'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('api2/html/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('api2/html/'),
    };

    transporter.use('compile', hbs(handlebarOptions))

    const uuid = await DaoUser.uuidToUserOrMail(data);

    if (uuid) {
        let lien = "https://madiona.alwaysdata.net/smartpot/php_server/verification_compte.php?uuid=" + uuid["uuid"] + "&token=" + ctx.request.jwtPayloadTo + "&langue=" + langue

        var mailOptions = {
            from: 'xxxxxx', // sender address
            to: uuid["mail"] , // list of receivers
            subject: subject,
            template: langTarget, // the name of the template file i.e email.handlebars
            context:{
                lien: lien
            }
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                ctx.body = JSON.parse(erreurReturn.erreurReturn(25));
            }
        });
        ctx.body = JSON.parse(erreurReturn.erreurReturn(0));
    }
    else {
        ctx.body = JSON.parse(erreurReturn.erreurReturn(25));
    }
}


module.exports.send2 = async function (ctx) {
    const { amail, demail, subject, text } = ctx.request.header

    if(!demail)    ctx.throw(422, "demail");
    if(!amail)    ctx.throw(422, "amail");
    if(!subject)    ctx.throw(422, "subject");
    if(!text)    ctx.throw(422, "text");


    var transporter = nodemailer.createTransport({
        host: 'xxxxxx',
        port: 465,  //25,
        // secure: false,
        //service: 'gmail',
        auth: {
            user: 'xxxxxx',
            pass: 'xxxxxx'
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    var mailOptions = {
        from: demail,
        to: amail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            ctx.body = error
        } else {
            ctx.body = info.response
            //console.log('Email sent: ' + info.response);
        }
    })

    ctx.body = "ok"
}
