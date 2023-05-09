const db = require('../bd/ConnexionPlante');

module.exports.test = async function (id, min, max) {
    //const dbTest = require('../bd/Connexion');

    let trame = "UPDATE plante SET plante_humidite_min='"+min+"', plante_humidite_max = '"+max+"' WHERE id_plante = " + id;

    //let trame = "SELECT `id_plante`, `plante_temperature_min`, `plante_temperature_max`, `plante_humidite_min`, `plante_humidite_max`, `plante_humidite_ambiante_min`, `plante_humidite_ambiante_max`, `plante_exposition_min`, `plante_exposition_max` FROM `plante` WHERE id_plante = " + id;
    let idPlante = await db.raw(trame);

    return trame
}

module.exports.find_filtre = async function (jsonFiltre, langue) {


    return await db.select('plante.id_plante', 'langues.'+langue+' as nom_plante', 'image.url_image')
    .distinct()
    .from('plante')
    .join('humidite_ambiante')
    .join('humidite_sol')
    .join('temperature')
    .join('exposition')
    .join('langues', 'langues.id_plante', '=', 'plante.id_plante')
    .join('image', 'image.id_plante', '=', 'plante.id_plante')
    .join('texture_plante', 'texture_plante.id_plante', '=', 'plante.id_plante')
    .join('texture', 'texture.id_texture', '=', 'texture_plante.id_texture')
    .join('type_plante', 'type_plante.id_plante', '=', 'plante.id_plante')
    .join('type', 'type.id_type', '=', 'type_plante.id_type')
    .modify(function(queryBuilder) {
        if (jsonFiltre.hasOwnProperty("type")) {
            queryBuilder.andWhere( function (queryBuilder2) {
                queryBuilder2.orWhere({'type.id_type': -1})

                if (jsonFiltre["type"].hasOwnProperty("aromatique")) if (jsonFiltre["type"]["aromatique"] == true)      queryBuilder2.orWhere({'type.id_type': 1})
                if (jsonFiltre["type"].hasOwnProperty("fleur")) if (jsonFiltre["type"]["fleur"] == true)                queryBuilder2.orWhere({'type.id_type': 2})
                if (jsonFiltre["type"].hasOwnProperty("fruit")) if (jsonFiltre["type"]["fruit"] == true)                queryBuilder2.orWhere({'type.id_type': 3})
                if (jsonFiltre["type"].hasOwnProperty("carnivore")) if (jsonFiltre["type"]["carnivore"] == true)        queryBuilder2.orWhere({'type.id_type': 4})
                if (jsonFiltre["type"].hasOwnProperty("grasse")) if (jsonFiltre["type"]["grasse"] == true)              queryBuilder2.orWhere({'type.id_type': 5})
            })
        }

        if (jsonFiltre.hasOwnProperty("exposition")) {
            queryBuilder.andWhere( function (queryBuilder2) {
                queryBuilder2.where({'exposition.id_exposition': -1})

                if (jsonFiltre["exposition"].hasOwnProperty("ombre")) if (jsonFiltre["exposition"]["ombre"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        //queryBuilder4.whereBetween('plante.plante_exposition_min', ['exposition.min_exposition', 'exposition.max_exposition'])
                        //.orWhereBetween('plante.plante_exposition_max', ['exposition.min_exposition', 'exposition.max_exposition'])
                        //.orWhereBetween('exposition.min_exposition', ['plante.plante_exposition_min', 'plante.plante_exposition_max'])
                        //.orWhereBetween('exposition.max_exposition', ['plante.plante_exposition_min', 'plante.plante_exposition_max'])
                        queryBuilder4.whereRaw('(plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max)')
                    })
                    queryBuilder3.andWhere({'exposition.id_exposition': 1})
                })

                if (jsonFiltre["exposition"].hasOwnProperty("mi_ombre")) if (jsonFiltre["exposition"]["mi_ombre"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        //queryBuilder4.whereBetween('plante.plante_exposition_min', ['exposition.min_exposition', 'exposition.max_exposition'])
                        //.orWhereBetween('plante.plante_exposition_max', ['exposition.min_exposition', 'exposition.max_exposition'])
                        //.orWhereBetween('exposition.min_exposition', ['plante.plante_exposition_min', 'plante.plante_exposition_max'])
                        //.orWhereBetween('exposition.max_exposition', ['plante.plante_exposition_min', 'plante.plante_exposition_max'])
                        queryBuilder4.whereRaw('(plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max)')
                    })
                    queryBuilder3.andWhere({'exposition.id_exposition': 2})
                })

                if (jsonFiltre["exposition"].hasOwnProperty("soleil")) if (jsonFiltre["exposition"]["soleil"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        //queryBuilder4.whereBetween('plante.plante_exposition_min', ['exposition.min_exposition', 'exposition.max_exposition'])
                        //.orWhereBetween('plante.plante_exposition_max', ['exposition.min_exposition', 'exposition.max_exposition'])
                        //.orWhereBetween('exposition.min_exposition', ['plante.plante_exposition_min', 'plante.plante_exposition_max'])
                        //.orWhereBetween('exposition.max_exposition', ['plante.plante_exposition_min', 'plante.plante_exposition_max'])
                        queryBuilder4.whereRaw('(plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max)')
                    })
                    queryBuilder3.andWhere({'exposition.id_exposition': 3})
                })
            })
        }

        if (jsonFiltre.hasOwnProperty("arrosage")) {
            queryBuilder.andWhere( function (queryBuilder2) {
                queryBuilder2.where({'humidite_sol.id_humidite_sol': -1})

                if (jsonFiltre["arrosage"].hasOwnProperty("peu")) if (jsonFiltre["arrosage"]["peu"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max)')
                    })
                    queryBuilder3.andWhere({'humidite_sol.id_humidite_sol': 1})
                })

                if (jsonFiltre["arrosage"].hasOwnProperty("frequent")) if (jsonFiltre["arrosage"]["frequent"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max)')
                    })
                    queryBuilder3.andWhere({'humidite_sol.id_humidite_sol': 2})
                })

                if (jsonFiltre["arrosage"].hasOwnProperty("quotidien")) if (jsonFiltre["arrosage"]["quotidien"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max)')
                    })
                    queryBuilder3.andWhere({'humidite_sol.id_humidite_sol': 3})
                })
            })
        }

        if (jsonFiltre.hasOwnProperty("humidite_ambiante")) {
            queryBuilder.andWhere( function (queryBuilder2) {
                queryBuilder2.where({'humidite_ambiante.id_humidite_ambiante': -1})

                if (jsonFiltre["humidite_ambiante"].hasOwnProperty("faible")) if (jsonFiltre["humidite_ambiante"]["faible"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max)')
                    })
                    queryBuilder3.andWhere({'humidite_ambiante.id_humidite_ambiante': 1})
                })

                if (jsonFiltre["humidite_ambiante"].hasOwnProperty("moyenne")) if (jsonFiltre["humidite_ambiante"]["moyenne"] == true)     queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max)')
                    })
                    queryBuilder3.andWhere({'humidite_ambiante.id_humidite_ambiante': 3})
                })

                if (jsonFiltre["humidite_ambiante"].hasOwnProperty("elevee")) if (jsonFiltre["humidite_ambiante"]["elevee"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max)')
                    })
                    queryBuilder3.andWhere({'humidite_ambiante.id_humidite_ambiante': 2})
                })
            })
        }

        if (jsonFiltre.hasOwnProperty("resistance")) {
            queryBuilder.andWhere( function (queryBuilder2) {
                queryBuilder2.where({'temperature.id_temperature': -1})

                if (jsonFiltre["resistance"].hasOwnProperty("frais")) if (jsonFiltre["resistance"]["frais"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature)	OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature)	OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)')
                    })
                    queryBuilder3.andWhere({'temperature.id_temperature': 1})
                })

                if (jsonFiltre["resistance"].hasOwnProperty("temperee")) if (jsonFiltre["resistance"]["temperee"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature)	OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature)	OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)')
                    })
                    queryBuilder3.andWhere({'temperature.id_temperature': 2})
                })

                if (jsonFiltre["resistance"].hasOwnProperty("temperee")) if (jsonFiltre["resistance"]["temperee"] == true)    queryBuilder2.orWhere(function (queryBuilder3) {
                    queryBuilder3.where(function (queryBuilder4) {
                        queryBuilder4.whereRaw('(plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature)	OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature)	OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)')
                    })
                    queryBuilder3.andWhere({'temperature.id_temperature': 3})
                })
            })
        }

        if (jsonFiltre.hasOwnProperty("type")) {
            queryBuilder.andWhere( function (queryBuilder2) {
                queryBuilder2.orWhere({'type.id_type': -1})

                if (jsonFiltre["texture"].hasOwnProperty("argile")) if (jsonFiltre["texture"]["argile"] == true)                queryBuilder2.orWhere({'texture.id_texture': 1})
                if (jsonFiltre["texture"].hasOwnProperty("sable")) if (jsonFiltre["texture"]["sable"] == true)                  queryBuilder2.orWhere({'texture.id_texture': 2})
                if (jsonFiltre["texture"].hasOwnProperty("terre")) if (jsonFiltre["texture"]["terre"] == true)                  queryBuilder2.orWhere({'texture.id_texture': 4})
                if (jsonFiltre["texture"].hasOwnProperty("rocailleux")) if (jsonFiltre["texture"]["rocailleux"] == true)        queryBuilder2.orWhere({'texture.id_texture': 6})
            })
        }
    })
    .orderBy('nom_plante', 'ASC')

/*
    var trame = "SELECT DISTINCT plante.id_plante, langues."+langue+" as nom_plante, image.url_image FROM plante INNER JOIN humidite_ambiante ON true INNER JOIN humidite_sol ON true INNER JOIN temperature ON true INNER JOIN exposition ON true INNER JOIN langues ON langues.id_plante = plante.id_plante INNER JOIN image ON image.id_plante = plante.id_plante INNER JOIN texture_plante ON texture_plante.id_plante = plante.id_plante INNER JOIN texture ON texture.id_texture = texture_plante.id_texture INNER JOIN type_plante ON type_plante.id_plante = plante.id_plante INNER JOIN type ON type.id_type = type_plante.id_type WHERE 1 "

    if (jsonFiltre.hasOwnProperty("type")) {
        trame += "AND (type.id_type = -1 "
        if (jsonFiltre["type"].hasOwnProperty("aromatique")) if (jsonFiltre["type"]["aromatique"] == true)       trame += "OR type.id_type = 1 "
        if (jsonFiltre["type"].hasOwnProperty("fleur")) if (jsonFiltre["type"]["fleur"] == true)       trame += "OR type.id_type = 2 "
        if (jsonFiltre["type"].hasOwnProperty("fruit")) if (jsonFiltre["type"]["fruit"] == true)       trame += "OR type.id_type = 3 "
        if (jsonFiltre["type"].hasOwnProperty("carnivore")) if (jsonFiltre["type"]["carnivore"] == true)       trame += "OR type.id_type = 4 "
        if (jsonFiltre["type"].hasOwnProperty("grasse")) if (jsonFiltre["type"]["grasse"] == true)       trame += "OR type.id_type = 5 "
        trame += ") "
    }

    if (jsonFiltre.hasOwnProperty("exposition")) {
        trame += "AND (exposition.id_exposition = -1 "
        if (jsonFiltre["exposition"].hasOwnProperty("ombre")) if (jsonFiltre["exposition"]["ombre"] == true)       trame += "OR (((plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max)) AND exposition.id_exposition = 1) "
        if (jsonFiltre["exposition"].hasOwnProperty("mi_ombre")) if (jsonFiltre["exposition"]["mi_ombre"] == true)       trame += "OR (((plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max)) AND exposition.id_exposition = 2) "
        if (jsonFiltre["exposition"].hasOwnProperty("soleil")) if (jsonFiltre["exposition"]["soleil"] == true)       trame += "OR (((plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max)) AND exposition.id_exposition = 3) "
        trame += ") "
    }

    if (jsonFiltre.hasOwnProperty("arrosage")) {
        trame += "AND (humidite_sol.id_humidite_sol = -1 "
        if (jsonFiltre["arrosage"].hasOwnProperty("peu")) if (jsonFiltre["arrosage"]["peu"] == true)       trame += "OR (((plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max)) AND humidite_sol.id_humidite_sol = 1) "
        if (jsonFiltre["arrosage"].hasOwnProperty("frequent")) if (jsonFiltre["arrosage"]["frequent"] == true)       trame += "OR (((plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max)) AND humidite_sol.id_humidite_sol = 2) "
        if (jsonFiltre["arrosage"].hasOwnProperty("quotidien")) if (jsonFiltre["arrosage"]["quotidien"] == true)       trame += "OR (((plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max)) AND humidite_sol.id_humidite_sol = 3) "
        trame += ") "
    }

    if (jsonFiltre.hasOwnProperty("humidite_ambiante")) {
        trame += "AND (humidite_ambiante.id_humidite_ambiante = -1 "
        if (jsonFiltre["humidite_ambiante"].hasOwnProperty("faible")) if (jsonFiltre["humidite_ambiante"]["faible"] == true)       trame += "OR (((plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max)) AND humidite_ambiante.id_humidite_ambiante = 1) "
        if (jsonFiltre["humidite_ambiante"].hasOwnProperty("moyenne")) if (jsonFiltre["humidite_ambiante"]["moyenne"] == true)       trame += "OR (((plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max)) AND humidite_ambiante.id_humidite_ambiante = 3) "
        if (jsonFiltre["humidite_ambiante"].hasOwnProperty("elevee")) if (jsonFiltre["humidite_ambiante"]["elevee"] == true)       trame += "OR (((plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max)) AND humidite_ambiante.id_humidite_ambiante = 1) "
        trame += ") "
    }

    if (jsonFiltre.hasOwnProperty("resistance")) {
        trame += "AND (temperature.id_temperature = -1 "
        if (jsonFiltre["resistance"].hasOwnProperty("frais")) if (jsonFiltre["resistance"]["frais"] == true)       trame += "OR (((plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)) AND temperature.id_temperature = 1) "
        if (jsonFiltre["resistance"].hasOwnProperty("temperee")) if (jsonFiltre["resistance"]["temperee"] == true)       trame += "OR (((plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)) AND temperature.id_temperature = 2) "
        if (jsonFiltre["resistance"].hasOwnProperty("aride")) if (jsonFiltre["resistance"]["aride"] == true)       trame += "OR (((plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)) AND temperature.id_temperature = 3) "
        trame += ") "
    }

    if (jsonFiltre.hasOwnProperty("texture")) {
        trame += "AND (texture.id_texture = -1 "
        if (jsonFiltre["texture"].hasOwnProperty("argile")) if (jsonFiltre["texture"]["argile"] == true)       trame += "OR texture.id_texture = 1 "
        if (jsonFiltre["texture"].hasOwnProperty("sable")) if (jsonFiltre["texture"]["sable"] == true)       trame += "OR texture.id_texture = 2 "
        if (jsonFiltre["texture"].hasOwnProperty("terre")) if (jsonFiltre["texture"]["terre"] == true)       trame += "OR texture.id_texture = 4 "
        if (jsonFiltre["texture"].hasOwnProperty("rocailleux")) if (jsonFiltre["texture"]["rocailleux"] == true)       trame += "OR texture.id_texture = 6 "
        trame += ") "
    }

    trame += " ORDER BY nom_plante ASC"



    var idPlante = await db.raw(trame);
    return idPlante[0]
    */
}


module.exports.info2 = async function (id, langue, info) {
    /*
    let trame = "WITH t AS ( SELECT texture.* FROM plante INNER JOIN texture_plante ON texture_plante.id_plante = plante.id_plante INNER JOIN texture ON texture.id_texture = texture_plante.id_texture WHERE plante.id_plante = " + id + " ), ty AS ( SELECT type.* FROM plante INNER JOIN type_plante ON type_plante.id_plante = plante.id_plante INNER JOIN type ON type.id_type = type_plante.id_type WHERE plante.id_plante = " + id + " ), e AS ( SELECT exposition.* FROM plante INNER JOIN exposition ON (plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) WHERE plante.id_plante = " + id + " ), r AS ( SELECT temperature.* FROM plante INNER JOIN temperature ON (plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max) WHERE plante.id_plante = " + id + " ), h AS ( SELECT humidite_ambiante.* FROM plante INNER JOIN humidite_ambiante ON (plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) WHERE plante.id_plante = " + id + " ), a AS ( SELECT humidite_sol.* FROM plante INNER JOIN humidite_sol ON (plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) WHERE plante.id_plante = " + id + " ) SELECT "+langue+", "+info+", information.page AS titre, information.credit, information.source, image.url_image, image.image_auteur, image.image_oeuvre, image.image_copyright, GROUP_CONCAT(DISTINCT  e.label_exposition) AS label_exposition, GROUP_CONCAT(DISTINCT e.url_exposition) AS url_exposition, GROUP_CONCAT(DISTINCT  e.min_exposition) AS min_exposition, GROUP_CONCAT(DISTINCT e.max_exposition) AS max_exposition, plante.plante_exposition_min, plante.plante_exposition_max, GROUP_CONCAT(DISTINCT h.label_humidite_ambiante) AS label_humidite_ambiante, GROUP_CONCAT(DISTINCT h.url_humidite_ambiante) AS url_humidite_ambiante, plante.plante_humidite_ambiante_min, plante.plante_humidite_ambiante_max, GROUP_CONCAT(DISTINCT a.label_humidite_sol) AS label_humidite_sol, GROUP_CONCAT(DISTINCT a.url_humidite_sol) AS url_humidite_sol, plante.plante_humidite_min, plante.plante_humidite_max, GROUP_CONCAT(DISTINCT r.label_temperature) AS label_temperature, GROUP_CONCAT(DISTINCT r.url_temperature) AS url_temperature, plante.plante_temperature_min, plante.plante_temperature_max, GROUP_CONCAT(DISTINCT t.label_texture) AS label_texture, GROUP_CONCAT(DISTINCT t.url_texture) AS url_texture, GROUP_CONCAT(DISTINCT ty.label_type) AS label_type, GROUP_CONCAT(DISTINCT ty.url_type) AS url_type FROM t, ty, e, r, h, a, plante INNER JOIN langues on langues.id_plante = plante.id_plante INNER JOIN image on image.id_plante = plante.id_plante INNER JOIN information on information.id_plante = plante.id_plante WHERE plante.id_plante = " + id + ";"

    var idPlante = await db.raw(trame);

    return idPlante[0][0]
    */

    return await db.with('t', (qb) => {
        qb.select('texture.*')
        .from('plante')
        .join('texture_plante', 'texture_plante.id_plante', '=', 'plante.id_plante')
        .join('texture', 'texture.id_texture', '=', 'texture_plante.id_texture')
        .where({'plante.id_plante' : id})
        .orderBy('texture.ordre', 'ASC')
    })
    .with('ty', (qb) => {
        qb.select('type.*')
        .from('plante')
        .join('type_plante', 'type_plante.id_plante', '=', 'plante.id_plante')
        .join('type', 'type.id_type', '=', 'type_plante.id_type')
        .where({'plante.id_plante' : id})
        .orderBy('type.ordre', 'ASC')
    })
    .with('e', (qb) => {
        qb.select('exposition.*')
        .from('plante')
        .joinRaw('INNER JOIN exposition ON (plante.plante_exposition_min BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (plante.plante_exposition_max BETWEEN exposition.min_exposition AND exposition.max_exposition) OR (exposition.min_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max) OR (exposition.max_exposition BETWEEN plante.plante_exposition_min AND plante.plante_exposition_max)')
        .where({'plante.id_plante' : id})
        .orderBy('exposition.ordre', 'ASC')
    })
    .with('r', (qb) => {
        qb.select('temperature.*')
        .from('plante')
        .joinRaw('INNER JOIN temperature ON (plante.plante_temperature_min BETWEEN temperature.min_temperature AND temperature.max_temperature)	OR (plante.plante_temperature_max BETWEEN temperature.min_temperature AND temperature.max_temperature) OR (temperature.min_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)	OR (temperature.max_temperature BETWEEN plante.plante_temperature_min AND plante.plante_temperature_max)')
        .where({'plante.id_plante' : id})
        .orderBy('temperature.ordre', 'ASC')
    })
    .with('h', (qb) => {
        qb.select('humidite_ambiante.*')
        .from('plante')
        .joinRaw('INNER JOIN humidite_ambiante ON (plante.plante_humidite_ambiante_min BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante)	OR (plante.plante_humidite_ambiante_max BETWEEN humidite_ambiante.min_humidite_ambiante AND humidite_ambiante.max_humidite_ambiante) OR (humidite_ambiante.min_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max) OR (humidite_ambiante.max_humidite_ambiante BETWEEN plante.plante_humidite_ambiante_min AND plante.plante_humidite_max)')
        .where({'plante.id_plante' : id})
        .orderBy('humidite_ambiante.ordre', 'ASC')
    })
    .with('a', (qb) => {
        qb.select('humidite_sol.*')
        .from('plante')
        .joinRaw('INNER JOIN humidite_sol ON (plante.plante_humidite_min BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (plante.plante_humidite_max BETWEEN humidite_sol.min_humidite_sol AND humidite_sol.max_humidite_sol) OR (humidite_sol.min_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max) OR (humidite_sol.max_humidite_sol BETWEEN plante.plante_humidite_min AND plante.plante_humidite_max)')
        .where({'plante.id_plante' : id})
        .orderBy('humidite_sol.ordre', 'ASC')
    })
    .first(langue, info, 'information.page AS titre', 'information.credit', 'information.source', 'image.url_image', 'image.image_auteur', 'image.image_oeuvre', 'image.image_copyright', 'plante.plante_exposition_min', 'plante.plante_exposition_max', 'plante.plante_humidite_ambiante_min', 'plante.plante_humidite_ambiante_max', 'plante.plante_humidite_min', 'plante.plante_humidite_max', 'plante.plante_temperature_min', 'plante.plante_temperature_max', db.raw('GROUP_CONCAT(DISTINCT  e.label_exposition order by `e`.`ordre` ASC) AS label_exposition, GROUP_CONCAT(DISTINCT e.url_exposition order by `e`.`ordre` ASC) AS url_exposition, GROUP_CONCAT(DISTINCT  e.min_exposition order by `e`.`ordre` ASC) AS min_exposition, GROUP_CONCAT(DISTINCT e.max_exposition order by `e`.`ordre` ASC) AS max_exposition, GROUP_CONCAT(DISTINCT h.label_humidite_ambiante order by `h`.`ordre` ASC) AS label_humidite_ambiante, GROUP_CONCAT(DISTINCT h.url_humidite_ambiante order by `h`.`ordre` ASC) AS url_humidite_ambiante, GROUP_CONCAT(DISTINCT a.label_humidite_sol order by `a`.`ordre` ASC) AS label_humidite_sol, GROUP_CONCAT(DISTINCT a.url_humidite_sol order by `a`.`ordre` ASC) AS url_humidite_sol, GROUP_CONCAT(DISTINCT r.label_temperature order by `r`.`ordre` ASC) AS label_temperature, GROUP_CONCAT(DISTINCT r.url_temperature order by `r`.`ordre` ASC) AS url_temperature, GROUP_CONCAT(DISTINCT t.label_texture order by `t`.`ordre` ASC) AS label_texture, GROUP_CONCAT(DISTINCT t.url_texture order by `t`.`ordre` ASC) AS url_texture, GROUP_CONCAT(DISTINCT ty.label_type order by `ty`.`ordre` ASC) AS label_type, GROUP_CONCAT(DISTINCT ty.url_type order by `ty`.`ordre` ASC) AS url_type'))
    .from('plante')
    .join('t')
    .join('ty')
    .join('e')
    .join('r')
    .join('h')
    .join('a')
    .join('langues', 'langues.id_plante', '=', 'plante.id_plante')
    .join('image', 'image.id_plante', '=', 'plante.id_plante')
    .join('information', 'information.id_plante', '=', 'plante.id_plante')
    .where({'plante.id_plante': id})
}
