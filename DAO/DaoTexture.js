const db = require('../bd/Connexion');

module.exports.all = async function (ctx) {
   return await db.select('*').from('texture');
}

module.exports.find = async function (id) {
   return await db.first('*').from('texture').where({ id_texture : id });
}

module.exports.findNom = async function (num_texture) {
   return await db.first('*').from('texture').where({ num_texture : num_texture });
}
