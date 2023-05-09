const path = require('path'); // chemin
const knex = require('knex'); //Knex is a SQL query builder


module.exports = knex({
    client: 'mysql',
    connection: {
    host : 'XXXXXXXXXXXXXXXXXXXX',
    user : 'XXXXXXXXXXXXXXXXXXXX',
    password : 'XXXXXXXXXXXXXXXXXXXX',
    database : 'XXXXXXXXXXXXXXXXXXXX',
    timezone : "UTC"
    }
});
