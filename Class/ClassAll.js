const erreurReturn = require('../erreur')

class ClassAll {
    trame = null;

    nomJson = null;
    imageJson = null;
    expositionJson = null;
    humidite_ambianteJson = null;
    humidite_solJson = null;
    temperatureJson = null;
    textureJson = null;
    typeJson = null;

    constructor() {
    }

    setNom(nom){
        var search = "nom_plante";
        var search2 = "\"}";

        var res;
        var res2;
        var labelName = "nom_plante";

        var indexOfFirst = nom.indexOf(search);
        var indexOfFirst2 = nom.indexOf(search2);

        res = nom.substr(indexOfFirst + labelName.length + 3 , indexOfFirst2 - indexOfFirst - labelName.length - 3 );
        this.nomJson = "\"nom\" : \"" + res + "\""
    }

    setImage(image){
        this.imageJson = "\"image\" : " + image
    }

    setExposition(exposition){
        this.expositionJson = "\"exposition\" : [" + exposition + "]"
    }

    setHumidite_ambiante(humidite_ambiante){
        this.humidite_ambianteJson = "\"humidite_ambiante\" : [" + humidite_ambiante + "]"
    }

    setHumidite_sol(humidite_sol){
        this.humidite_solJson = "\"arrosage\" : [" + humidite_sol + "]"
    }

    setTemperature(temperature){
        this.temperatureJson = "\"resistance\" : [" + temperature + "]"
    }

    setTexture(texture){
        this.textureJson = "\"texture\" : [" + texture + "]"
    }

    setType(type){
        this.typeJson = "\"type\" : [" + type + "]"
    }


    getTrame() {
        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)

        this.trame = "{" + this.nomJson + "," + this.imageJson + "," + this.expositionJson + "," + this.humidite_ambianteJson + "," + this.humidite_solJson + "," + this.temperatureJson + "," + this.textureJson + "," + this.typeJson + "," + response + "}"
        return this.trame;
    }
}
module.exports = ClassAll;
