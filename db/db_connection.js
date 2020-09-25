const Sequelize = require('sequelize')

const sequelize = new Sequelize('postgres://postgres:abdullah123@localhost:5432/bankaccount')


sequelize.authenticate().then(() => {
console.log('Connection has been established successfully.');
})
.catch(err => {
console.error('Unable to connect to the database:', err);
});

module.exports = { 
    sequelize
}