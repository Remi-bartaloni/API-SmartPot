const DaoPot = require('../DAO/DaoPot')
const erreurReturn = require('../erreur')
const exist = require('../DAO/DaoVerif')

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function toTimestamp(strDate){
    let datum = Date.parse(strDate);
    return datum/1000;
}

function convertMinsToHrsMins(minutes) {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    return [h, m];
}


module.exports.all = async function (ctx) {
    const {uuid} = ctx.request.header

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))


    let all = await DaoPot.all(id, nam, uuid);

    if (all != undefined) {
        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)

        let jsonRes = "{\"list\":" + JSON.stringify(all) + "," + response + "}"
        ctx.body = JSON.parse(jsonRes);
    }
    else {
        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)
        let jsonRes = "{\"list\": {}," + response + "}"

        ctx.body = JSON.parse(jsonRes);
    }
}

module.exports.state = async function (ctx) {
    let {id_pot, debut, fin, unite, gmtDebut, gmtFin} = ctx.query
    const {uuid} = ctx.request.header

    if(!gmtDebut)       ctx.throw(202, erreurReturn.erreurReturn(32))
    if(!gmtFin)       ctx.throw(202, erreurReturn.erreurReturn(32))
    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!id_pot)     ctx.throw(202, erreurReturn.erreurReturn(13))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))


    let debutOk
    let finOk

    if (debut > fin ) {
        debutOk = fin
        finOk = debut
    }
    else {
        debutOk = debut
        finOk = fin
    }

    if (new Date(debutOk).toDateString() == "Invalid Date" || new Date(finOk).toDateString() == "Invalid Date" ) {
        ctx.throw(202, erreurReturn.erreurReturn(32))
    }

    gmtDebut = Math.floor(gmtDebut * 100);
    gmtDebut = (gmtDebut > 0) ? "+" + String(gmtDebut) : "-" + Math.abs(gmtDebut);

    while (String(gmtDebut).length < 5)
    {
        gmtDebut = String(gmtDebut).slice(0,1) + "0" + String(gmtDebut).slice(1);
    }

    debut = (new Date(debutOk + " 00:00:00 GMT"+String(gmtDebut))).toISOString()
    debut = debut.split('T')[0] + " " + debut.split('T')[1].split('.')[0]

    gmtFin = Math.floor(gmtFin * 100);
    gmtFin = (gmtFin > 0) ? "+" + String(gmtFin) : "-" + Math.abs(gmtFin);

    while (String(gmtFin).length < 5)
    {
        gmtFin = String(gmtFin).slice(0,1) + "0" + String(gmtFin).slice(1);
    }
    fin = (new Date(finOk +" 23:59:59 GMT"+String(gmtFin))).toISOString()
    fin = fin.split('T')[0] + " " + fin.split('T')[1].split('.')[0]


    all = await DaoPot.stateDate(uuid, id_pot, debut, fin);

    if (Object.keys(all).length <= 0) {
        ctx.throw(202, erreurReturn.erreurReturn(11))
    }

    let jsonRes = {list: {}}
    Object.assign(jsonRes.list, {utilisateur: {user: all[0]['login'], mail: all[0]['mail']}})
    Object.assign(jsonRes.list, {pot: {id_pot: all[0]['id_pot'], nom_pot: all[0]['nom_pot'], humidite_min: all[0]['humidite_min'], humidite_max: all[0]['humidite_max'], temperature_min: all[0]['temperature_min'], temperature_max: all[0]['temperature_max'], humidite_ambiante_min: all[0]['humidite_ambiante_min'], humidite_ambiante_max: all[0]['humidite_ambiante_max'], debut_soleil: all[0]['debut_soleil'], fin_soleil: all[0]['fin_soleil']}})

    Object.assign(jsonRes.list, {stats: []})
    if (all[0]['cuve'] != null) {
        for (var i = 0; i < all.length; i++) {
            jsonRes.list.stats.push({cuve: all[i]['cuve'], humidite_sol: all[i]['humidite_sol'], humidite_ambiante: all[i]['humidite_ambiante'], temperature: all[i]['temperature'], luminosite: all[i]['luminosite'], date: all[i]['heure']})
        }
    }

    switch (unite) {
        case "kelvin":
        for (let i = 0; i < jsonRes['list']['stats'].length; i++) {
            jsonRes['list']['stats'][i]['temperature'] = parseFloat((jsonRes['list']['stats'][i]['temperature'] + 273.15).toFixed(2));
        }
        jsonRes['list']['pot']['temperature_min'] = parseFloat((jsonRes['list']['pot']['temperature_min'] + 273.15).toFixed(2));
        jsonRes['list']['pot']['temperature_max'] = parseFloat((jsonRes['list']['pot']['temperature_max'] + 273.15).toFixed(2));
        break;
        case "fahrenheit":
        for (let i = 0; i < jsonRes['list']['stats'].length; i++) {
            jsonRes['list']['stats'][i]['temperature'] = parseFloat(((jsonRes['list']['stats'][i]['temperature'] * 1.8) + 32).toFixed(2));
        }
        jsonRes['list']['pot']['temperature_min'] = parseFloat(((jsonRes['list']['pot']['temperature_min'] * 1.8) + 32).toFixed(2));
        jsonRes['list']['pot']['temperature_max'] = parseFloat(((jsonRes['list']['pot']['temperature_max'] * 1.8) + 32).toFixed(2));
        break;
        case "ra":
        for (let i = 0; i < jsonRes['list']['stats'].length; i++) {
            jsonRes['list']['stats'][i]['temperature'] = parseFloat((jsonRes['list']['stats'][i]['temperature'] * 9 / 5 + 491.67).toFixed(2));
        }
        jsonRes['list']['pot']['temperature_min'] = parseFloat((jsonRes['list']['pot']['temperature_min'] * 9 / 5 + 491.67).toFixed(2));
        jsonRes['list']['pot']['temperature_max'] = parseFloat((jsonRes['list']['pot']['temperature_max'] * 9 / 5 + 491.67).toFixed(2));
        break;
        case "re":
        for (let i = 0; i < jsonRes['list']['stats'].length; i++) {
            jsonRes['list']['stats'][i]['temperature'] = parseFloat((jsonRes['list']['stats'][i]['temperature'] * 0.8).toFixed(2));
        }
        jsonRes['list']['pot']['temperature_min'] = parseFloat((jsonRes['list']['pot']['temperature_min'] * 0.8).toFixed(2));
        jsonRes['list']['pot']['temperature_max'] = parseFloat((jsonRes['list']['pot']['temperature_max'] * 0.8).toFixed(2));
        break;
    }

    Object.assign(jsonRes, JSON.parse(erreurReturn.erreurReturn(0)))
    ctx.body = jsonRes
}

module.exports.stateHeure = async function (ctx) {
    const {id_pot, gmt = 0} = ctx.query
    const {uuid} = ctx.request.header

    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!id_pot)     ctx.throw(202, erreurReturn.erreurReturn(13))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    let gmt2 = gmt
    let unite = Math.abs(gmt2-gmt2%1);
    let decimal = Math.abs(Math.floor((gmt2%1)*60));
    unite = (String(unite).length < 2) ? "0" + String(Math.abs(unite)) : String(Math.abs(unite));
    decimal = (String(decimal).length < 2) ? "0" + String(Math.abs(decimal)) : String(Math.abs(decimal));
    let final = (gmt2 < 0) ? "-" + unite + ":" + decimal : "+" + unite + ":" + decimal;

    const all = await DaoPot.stateHeure(id, nam, uuid, id_pot, final);

    if (all) {
        if (all == 1) {
            ctx.throw(202, erreurReturn.erreurReturn(6))
        }
        else if (all == 2) {
            ctx.throw(202, erreurReturn.erreurReturn(13))
        }
        else if (all == 3) {
            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            let jsonRes = '{"list": [],'+ response +'}'
            ctx.body = JSON.parse(jsonRes);
        }
        else {
            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            let jsonRes = "{\"list\":" + JSON.stringify(all) + "," + response + "}"
            ctx.body = JSON.parse(jsonRes);
        }
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}

module.exports.info = async function (ctx) {
    const {id_pot, unite} = ctx.query
    const {uuid} = ctx.request.header

    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!id_pot)     ctx.throw(202, erreurReturn.erreurReturn(13))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    let all = await DaoPot.info(id, nam, uuid, id_pot);

    if (all) {
        if (all == 1) {
            ctx.throw(202, erreurReturn.erreurReturn(6))
        }
        else if (all == 2) {
            ctx.throw(202, erreurReturn.erreurReturn(13))
        }
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(24))
    }

    if (all.hasOwnProperty('heure')) {
        all["date"] = new Date(all["heure"]).toISOString().split('T')[0] + " " + new Date(all["heure"]).toISOString().split('T')[1].split('.')[0]
        delete all["heure"]
    }

    if (all["date"].split(' ')[0] != new Date().toISOString().split('T')[0]) {
        all["luminosite"] = "--"
    }


    switch (unite) {
        case "kelvin":
        if (all['temperature'] != "--") all['temperature'] = parseFloat((all['temperature'] + 273.15).toFixed(2));
        all['temperature_min'] = parseFloat((all['temperature_min'] + 273.15).toFixed(2));
        all['temperature_max'] = parseFloat((all['temperature_max'] + 273.15).toFixed(2));
        break;
        case "fahrenheit":
        if (all['temperature'] != "--") all['temperature'] = parseFloat(((all['temperature'] * 1.8) + 32).toFixed(2));
        all['temperature_min'] = parseFloat(((all['temperature_min'] * 1.8) + 32).toFixed(2));
        all['temperature_max'] = parseFloat(((all['temperature_max'] * 1.8) + 32).toFixed(2));
        break;
        case "ra":
        if (all['temperature'] != "--") all['temperature'] = parseFloat((all['temperature'] * 9 / 5 + 491.67).toFixed(2));
        all['temperature_min'] = parseFloat((all['temperature_min'] * 9 / 5 + 491.67).toFixed(2));
        all['temperature_max'] = parseFloat((all['temperature_max'] * 9 / 5 + 491.67).toFixed(2));
        break;
        case "re":
        if (all['temperature'] != "--") all['temperature'] = parseFloat((all['temperature'] * 0.8).toFixed(2));
        all['temperature_min'] = parseFloat((all['temperature_min'] * 0.8).toFixed(2));
        all['temperature_max'] = parseFloat((all['temperature_max'] * 0.8).toFixed(2));
        break;
    }

    let response = erreurReturn.erreurReturn(0)
    response = response.substr(1, response.length - 2)
    all = JSON.stringify(all)
    all = all.slice(0, -1) +  "," + response + "}"
    ctx.body = JSON.parse(all)
}


module.exports.add = async function (ctx) {
    //const {} = ctx.query
    const {uuid} = ctx.request.header

    const id = ctx.request.jwtPayloadTo.sub
    const verifPot = ctx.request.jwtPayloadTo.pot

    if (verifPot == false) {
        ctx.throw(202, erreurReturn.erreurReturn(11))
    }

    const all = await DaoPot.add(id, uuid);

    if (all) {
        if (all == 1) {
            ctx.throw(202, erreurReturn.erreurReturn(6))
        }
        else if (all == 404) {
            ctx.throw(202, erreurReturn.erreurReturn(12))
        }
        else {
            ctx.body = Object.assign(all, JSON.parse(erreurReturn.erreurReturn(0)))
        }
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(6))
    }

}

module.exports.valider = async function (ctx) {
    let {nom_pot, notification, debut_soleil, fin_soleil, temperature_min, temperature_max, humidite_min, humidite_max, humidite_ambiante_min, humidite_ambiante_max, id_pot, url_image} = ctx.query
    const {uuid} = ctx.request.header

    nom_pot = decodeURI(nom_pot)
    notification = decodeURI(notification)
    debut_soleil = decodeURI(debut_soleil)
    fin_soleil = decodeURI(fin_soleil)
    temperature_min = decodeURI(temperature_min)
    temperature_max = decodeURI(temperature_max)
    humidite_min = decodeURI(humidite_min)
    humidite_max = decodeURI(humidite_max)
    url_image = decodeURI(url_image)

    if(!uuid)               ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!nom_pot)            ctx.throw(202, erreurReturn.erreurReturn(15))
    if(!notification)       ctx.throw(202, erreurReturn.erreurReturn(16))
    //if(!humidite_pot)       ctx.throw(202, erreurReturn.erreurReturn(17))
    if(!debut_soleil)       ctx.throw(202, erreurReturn.erreurReturn(18))
    if(!fin_soleil)         ctx.throw(202, erreurReturn.erreurReturn(19))
    if(!humidite_min)           ctx.throw(202, erreurReturn.erreurReturn(28))
    if(!humidite_max)           ctx.throw(202, erreurReturn.erreurReturn(28))/*
    if(!humidite_ambiante_min)           ctx.throw(202, erreurReturn.erreurReturn(28))
    if(!humidite_ambiante_max)           ctx.throw(202, erreurReturn.erreurReturn(28))*/
    if(!temperature_min)           ctx.throw(202, erreurReturn.erreurReturn(30))
    if(!temperature_max)           ctx.throw(202, erreurReturn.erreurReturn(30))
    if(!id_pot)             ctx.throw(202, erreurReturn.erreurReturn(13))
    //if(!luminosite_auto)    ctx.throw(202, erreurReturn.erreurReturn(13))
    if(!url_image)          ctx.throw(202, erreurReturn.erreurReturn(22))

    function extractHourMinutes(val)
    {
        if (val.length == 8 && val.split(":")[0] >= 0 && val.split(":")[0] <= 23 && val.split(":")[1] >= 0 && val.split(":")[1] <= 59)
        return [val.split(":")[0], val.split(":")[1]];
        return 0;
    }

    function verifValider(valNom, valHumMin, valHumMax, valDebut, valDuree, valTempMin, valTempMax, valNotification, valImg)
    {
        if (valNom!="" && valNom.length > 3 && valNom.length < 30 && valHumMin >= 0 && valHumMin <= 100 && valHumMax >= 0 && valHumMax <= 100 && extractHourMinutes(valDebut) != 0 && extractHourMinutes(valDebut)[0] >= 0 && extractHourMinutes(valDebut)[0] <= 23 && extractHourMinutes(valDebut)[1] >= 0 && extractHourMinutes(valDebut)[1] <= 59 && valDuree >= 0 && valDuree <= 1440 && valTempMin >= -50 &&  valTempMin <= 50 && valTempMin != 1 && valTempMax >= -50 && valTempMax <= 50 && valTempMax != 1 &&  (valNotification == 1 || valNotification == 0) && valImg!="" && valImg!=undefined && valImg.length>6) return 0;
        return 1;
    }

    if (verifValider(nom_pot, parseInt(humidite_min), parseInt(humidite_max), debut_soleil, parseInt(fin_soleil), parseInt(temperature_min), parseInt(temperature_max), parseInt(notification), url_image) == 1) {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const all = await DaoPot.valider(id, nam, uuid, nom_pot, parseInt(notification), debut_soleil, parseInt(fin_soleil), parseInt(temperature_min), parseInt(temperature_max), parseInt(humidite_min), parseInt(humidite_max), humidite_ambiante_min, humidite_ambiante_max, id_pot, url_image);

    if (all) {
        if (all == 1) {
            ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
        }
        if (all == 13) {
            ctx.throw(202, erreurReturn.erreurReturn(13))
        }
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}

module.exports.PotVerif = async function (ctx) {
    const {code} = ctx.query

    if(!code)    ctx.throw(202, erreurReturn.erreurReturn(12));

    const id = ctx.request.jwtPayloadTo.sub

    const all = await DaoPot.PotVerif(code, id);

    if (all) {
        if (all == 10) {
            //const res = JSON.parse("{\"result\":422}")
            ctx.throw(202, erreurReturn.erreurReturn(21))
        }

        //ctx.throw(200, "{\"result\":200, \"id\"=" + all + "}")
        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)

        ctx.body = await JSON.parse("{" + response + ", \"id_pot\":" + all + "}")
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}

module.exports.sup = async function (ctx) {
    const {id_pot} = ctx.query
    const {uuid} = ctx.request.header

    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!id_pot)     ctx.throw(202, erreurReturn.erreurReturn(13))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const all = await DaoPot.sup(id, nam, uuid, id_pot);
    ctx.body = all

    if (all == 1) {
        ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
    }
    else if (all == 404) {
        ctx.throw(202, erreurReturn.erreurReturn(24))
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(11))
    }
}

module.exports.statsAdd = async function (ctx) {
    const {id_pot, cuve, humidite_sol, humidite_ambiante, temperature, luminosite} = ctx.query
    const {uuid} = ctx.request.header

    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!id_pot)     ctx.throw(202, erreurReturn.erreurReturn(13))
    if(!cuve)     ctx.throw(202, erreurReturn.erreurReturn(27))
    if(!humidite_sol)     ctx.throw(202, erreurReturn.erreurReturn(28))
    if(!humidite_ambiante)     ctx.throw(202, erreurReturn.erreurReturn(29))
    if(!temperature)     ctx.throw(202, erreurReturn.erreurReturn(30))
    if(!luminosite)     ctx.throw(202, erreurReturn.erreurReturn(30))

    const id = ctx.request.jwtPayloadTo.sub
    const verifPot = ctx.request.jwtPayloadTo.pot

    if (verifPot == false && id != 1) {
        ctx.throw(202, erreurReturn.erreurReturn(11))
    }

    const all = await DaoPot.statsAdd(uuid, id_pot, cuve, humidite_sol, humidite_ambiante, temperature, luminosite);

    if (all) {
        if (all == 1) {
            ctx.throw(202, erreurReturn.erreurReturn(6))
        }
        else {
            ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
        }
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}

module.exports.notification = async function (ctx) {
    const {uuid} = ctx.request.header

    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    let all = await DaoPot.notification(id, uuid, nam);

    if (all) {
        if (!all[0]) {
            ctx.body = JSON.parse('{"list": [],"erreur": {"code": 0,"desc": "Aucune erreur"}}');
        }
        else {
            for (let i = 0; i < all.length; ++i) {
                let heure_actuelle = new Date().toISOString();
                heure_actuelle = parseInt(heure_actuelle.split('T')[1].split('.')[0].split(':')[0]) * 60 + parseInt(heure_actuelle.split('T')[1].split('.')[0].split(':')[1])

                let treshold_minutes = 30;
                let minutes_set = all[i]['fin_soleil'];
                let tmp = parseInt(all[i]['debut_soleil'].split(':')[0]) * 60 + parseInt(all[i]['debut_soleil'].split(':')[1])
                let tmp2 = parseInt(all[i]['debut_soleil'].split(':')[0]) * 60 + parseInt(all[i]['debut_soleil'].split(':')[1]) + all[i]['fin_soleil']

                let eta = ""

                if (heure_actuelle < tmp)
                {
                    //console.log("Avant début");
                    let minutes_remaining_possible = all[i]['fin_soleil'];
                    let minutes_acquired = all[i]['luminosite'];

                    if ((minutes_acquired > minutes_remaining_possible + treshold_minutes) || (minutes_acquired + minutes_remaining_possible > minutes_remaining_possible + treshold_minutes))
                    {
                        eta = "élevée"
                        //console.log("Trop de soleil");
                    }
                    else
                    {
                        eta = "bonne"
                        //console.log("Soleil OK");
                    }
                }
                if (heure_actuelle > tmp && heure_actuelle < tmp2)
                {
                    //console.log("Après début, avant fin");
                    let minutes_remaining_possible = tmp2 - heure_actuelle;
                    let minutes_acquired = all[i]['luminosite'];

                    if ((minutes_acquired > minutes_set + treshold_minutes) || (minutes_acquired + minutes_remaining_possible > minutes_set + treshold_minutes))
                    {
                        eta = "élevée"
                        //console.log("Trop de soleil");
                    }
                    else if (minutes_acquired + minutes_remaining_possible + treshold_minutes < minutes_set)
                    {
                        eta = "basse"
                        //console.log("Pas assez de soleil");
                    }
                    else
                    {
                        eta = "bonne"
                        //console.log("Soleil OK");
                    }
                }
                if (heure_actuelle > tmp2)
                {
                    //console.log("Après fin");
                    let minutes_acquired = all[i]['luminosite'];

                    if (minutes_acquired > minutes_set + 30)
                    {
                        eta = "élevée"
                        //console.log("Trop de soleil");
                    }
                    else if (minutes_acquired + 30 < minutes_set)
                    {
                        eta = "basse"
                        //console.log("Pas assez de soleil");
                    }
                    else
                    {
                        eta = "bonne"
                        //console.log("Soleil OK");
                    }
                }

                let heurData = new Date(all[i]["heure"]).toISOString().split('T')[0]
                if ((eta == "bonne" || heurData != new Date().toISOString().split('T')[0]) && all[i]['humidite'] == "bonne" && all[i]['humidite_ambiante'] == "bonne" && all[i]['temperature'] == "bonne" && all[i]['cuve'] == 1) {
                    delete all[i]
                }
                else {
                    if (heurData == new Date().toISOString().split('T')[0]) {
                        all[i]['luminosite'] = eta
                    }
                    else {
                        all[i]['luminosite'] = "--"
                    }
                    delete all[i]["fin_soleil"]
                    delete all[i]["debut_soleil"]
                    delete all[i]["heure"]
                }
            }

            all = JSON.stringify(all)
            all = all.replaceAll('null', '');
            all = all.replaceAll('[,', '[');
            all = all.replaceAll('},]', '}]');

            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            let jsonRes = "{\"list\":" + all + "," + response + "}"
            ctx.body = JSON.parse(jsonRes);
        }
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}



module.exports.ajust = async function (ctx) {
	const { id_pot, unite, notEnoughtLight = false, tooMuchLight = false, notEnoughtWater = false, tooMuchWatering = false, tooMuchHeat = false} = ctx.query
    const {uuid} = ctx.request.header

    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!id_pot)       ctx.throw(202, erreurReturn.erreurReturn(13))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const pot = await DaoPot.ajustPotInfo(id, nam, uuid, id_pot, notEnoughtLight, tooMuchLight, notEnoughtWater, tooMuchWatering, tooMuchHeat);

    if (!pot) {
        ctx.throw(202, erreurReturn.erreurReturn(13))
    }

    var lum, eauMin, eauMax, tempMin, tempMax
    lum = pot.fin_soleil
    eauMin = pot.humidite_min
    eauMax = pot.humidite_max
    tempMin = pot.temperature_min
    tempMax = pot.temperature_max

    if (notEnoughtLight == true || notEnoughtLight == 'true') {
        lum += 30;
        if (lum > 1440) {
            lum = 1440
        }
    }

    if (tooMuchLight == true || tooMuchLight == 'true') {
        lum -= 30
        if (lum < 0) {
            lum = 0
        }
    }

    if (notEnoughtWater == true || notEnoughtWater == 'true') {
        eauMin += 2
        eauMax += 2

        if (eauMin > 100) {
            eauMin = 95
            eauMax = 100
        }
        if (eauMax > 100) {
            eauMin = 95
            eauMax = 100
        }
    }

    if (tooMuchWatering == true || tooMuchWatering == 'true') {
        eauMin -= 2
        eauMax -= 2

        if (eauMin < 0) {
            eauMin = 0
            eauMax = 5
        }
        if (eauMax < 0) {
            eauMin = 0
            eauMax = 5
        }
    }

    if (tooMuchHeat == true || tooMuchHeat == 'true') {
        tempMin -= 1
        tempMax -= 1

        if (tempMin < -50) {
            tempMin = -50
            tempMax = -30
        }
        if (tempMax < -50) {
            tempMin = -50
            tempMax = -30
        }
    }

    const potUpdate = await DaoPot.ajustPotUpdate(id_pot, lum, eauMin, eauMax, tempMin, tempMax);

    if (potUpdate == 0) {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }

    var json = {}
    Object.assign(json, {last_settings: pot})
    Object.assign(json, {new_settings : { "debut_soleil" : pot.debut_soleil, "fin_soleil": lum, "humidite_min": eauMin, "humidite_max": eauMax, "temperature_min": tempMin, "temperature_max": tempMax}})
    Object.assign(json, JSON.parse(erreurReturn.erreurReturn(0)))


    json
    switch (unite) {
        case "kelvin":
        json['last_settings']['temperature_min'] = parseFloat((json['last_settings']['temperature_min'] + 273.15).toFixed(2));
        json['last_settings']['temperature_max'] = parseFloat((json['last_settings']['temperature_max'] + 273.15).toFixed(2));
        break;
        case "fahrenheit":
        json['last_settings']['temperature_min'] = parseFloat(((json['last_settings']['temperature_min'] * 1.8) + 32).toFixed(2));
        json['last_settings']['temperature_max'] = parseFloat(((json['last_settings']['temperature_max'] * 1.8) + 32).toFixed(2));
        break;
        case "ra":
        json['last_settings']['temperature_min'] = parseFloat((json['last_settings']['temperature_min'] * 9 / 5 + 491.67).toFixed(2));
        json['last_settings']['temperature_max'] = parseFloat((json['last_settings']['temperature_max'] * 9 / 5 + 491.67).toFixed(2));
        break;
        case "re":
        json['last_settings']['temperature_min'] = parseFloat((json['last_settings']['temperature_min'] * 0.8).toFixed(2));
        json['last_settings']['temperature_max'] = parseFloat((json['last_settings']['temperature_max'] * 0.8).toFixed(2));
        break;
    }


    ctx.body = json
}
