require('dotenv').config();

const knex = require('knex')({
    client: "mysql",
    connection: {
        user: "root",
        host: process.env.HOST,
        password: process.env.PASSWORD,
        database: process.env.DB,
        multipleStaments: true
    }
})

knex.schema.createTable('loginRegister', table => {
    table.increments('id');
    table.string('name');
    table.string('email');
    table.string('password');
})
.then(() => {
    console.log('loginRegister table is created.')
}).catch((err) => {
    console.log(`\n${err.sqlMessage}\n`)
});

knex.schema.createTable('postActs', table2 => {
    table2.increments('id');
    table2.string('post')
    table2.integer('likes');
    table2.integer('dislikes')
    table2.integer('userID');
})
.then(() => {
    console.log('postActs table is created.');
}).catch((err) => {
    console.log(`\n${err.sqlMessage}\n`);
});

knex.schema.createTable('records', table3 => {
    table3.increments('id');
    table3.integer('postID');
    table3.integer('viewerID')
})
.then(() => {
    console.log('records table is created.')
}).catch((err) => {
    console.log(`\n${err.sqlMessage}\n`)
});



module.exports = knex;