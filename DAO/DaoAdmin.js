const dbUseur = require('../bd/Connexion');
const dbPlante = require('../bd/ConnexionPlante');

module.exports.addPlante = async function (TempMin, TempMax, HumTerreMin, HumTerreMax, HumAmbianteMin, HumAmbianteMax, ExpositionMin, ExpositionMax, Texture, Type) {

    var ok = 0

    const idPlante = await dbPlante.insert({
        'plante_temperature_min': TempMin,
        'plante_temperature_max': TempMax,
        'plante_humidite_min': HumTerreMin,
        'plante_humidite_max': HumTerreMax,
        'plante_humidite_ambiante_min': HumAmbianteMin,
        'plante_humidite_ambiante_max': HumAmbianteMax,
        'plante_exposition_min': ExpositionMin,
        'plante_exposition_max': ExpositionMax
    })
    .into('plante')
    .then( (e) => {++ok; return e})
    .catch((e) => {ok = -1});

    if (ok == -1) {
        return ok
    }

    await dbPlante.insert({
        'id_plante': idPlante[0],
        'id_texture': Texture
    })
    .from('texture_plante')
    .then( (e) => {++ok})
    .catch((e) => {ok = -2});

    if (ok == -2) {
        return ok
    }

    await dbPlante.insert({
        'id_plante': idPlante[0],
        'id_type': Type
    })
    .from('type_plante')
    .then( (e) => {++ok})
    .catch((e) => {ok = -3});


    return ok
}
