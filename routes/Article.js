const Dao = require('../DAO/DaoArticle')
const erreurReturn = require('../erreur')


module.exports.get = async function (ctx) {
    const get = await Dao.get();

    let json = {}

    for (var i = 0; i < get.length; i++) {
        let data = []
        let prix
        let date
        let prixTableau = []
        let dateTableau = []

        prix = get[i]['prix'].split('|')
        date = get[i]['date'].split('|')

        let article = get[i]['article']

        for (var j = 0; j < prix.length; j++) {
            prixTableau.push(prix[j])
            dateTableau.push(date[j])

            data.push({ "date": dateTableau[j], "prix": prixTableau[j] });
        }

        Object.assign(json, { [article]: { "data": data, "lien": get[i]['lien'], "unite": get[i]['unite'], "qte": get[i]['qte']}});
    }

    ctx.body = json
}

module.exports.getSum = async function (ctx) {
    const get = await Dao.getSum();

    for (var i = 0; i < get.length; i++) {
        get[i]['prix'] = Math.round(get[i]['prix'] * 100) / 100

        if (i != 0) {
            var variation = Math.round((((get[i]['prix'] - get[i-1]['prix']) / get[i-1]['prix']) * 100) * 100)
            get[i]['variation'] = (variation == 0) ? 0 : variation/100
        }
        else {
            get[i]['variation'] = 0
        }
    }

    ctx.body = get
}

module.exports.add = async function (ctx) {
    const { article, lien, prix, unite, qte } = ctx.query

    if(!article)            ctx.throw(202, erreurReturn.erreurReturn(25))
    if(!lien)               ctx.throw(202, erreurReturn.erreurReturn(25))
    if(!prix)               ctx.throw(202, erreurReturn.erreurReturn(25))
    if(!unite)              ctx.throw(202, erreurReturn.erreurReturn(25))
    if(!qte)                ctx.throw(202, erreurReturn.erreurReturn(25))

    ctx.body = await Dao.add(article, lien, prix, unite, qte);
}

module.exports.deleteDate = async function (ctx) {
    const { date } = ctx.query

    if(!date)            ctx.throw(202, erreurReturn.erreurReturn(25))

    ctx.body = await Dao.deleteDate(date);
}
