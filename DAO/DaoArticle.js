const dbUseur = require('../bd/ConnexionArticle');

module.exports.get = async function () {

    return await dbUseur.select(dbUseur.raw('GROUP_CONCAT(date order by id ASC SEPARATOR \'|\') AS date'), 'article', 'lien', dbUseur.raw('GROUP_CONCAT(prix order by id ASC SEPARATOR \'|\') AS prix'), 'unite', 'qte')
    .from('articleTableux')
    .groupBy('article')
    .orderBy('id', 'ASC')

}

module.exports.getSum = async function () {
/*
    return await dbUseur.select(dbUseur.raw('DATE_FORMAT(date, \'%Y-%m-%d %Hh\') as date'))
    .sum('prix as prix')
    .from('articleTableux')
    .groupByRaw('DATE_FORMAT(date, \'%Y-%m-%d %Hh\')')*/

    return await dbUseur.select(dbUseur.raw('DATE_FORMAT(date, \'%Y-%m-%d %Hh\') as date'), dbUseur.raw('sum((prix / unite) * qte) as prix'))
    .from('articleTableux')
    .groupByRaw('DATE_FORMAT(date, \'%Y-%m-%d %Hh\')')

}

module.exports.add = async function (article, lien, prix, unite, qte) {

    await dbUseur.insert({
        'article': article,
        'lien': lien,
        'prix': prix,
        'unite': unite,
        'qte': qte
    })
    .into('articleTableux')

    return "ok"
}

module.exports.deleteDate = async function (date) {

    return await dbUseur.del()
    .from('articleTableux')
    .whereRaw('DATE_FORMAT(date, \'%Y-%m-%d %Hh\') = "' + date + '"')
}
