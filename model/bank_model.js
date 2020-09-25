const Sequelize = require('sequelize')
const {sequelize} = require('../db/db_connection');

const { DataTypes } = require("sequelize");

const customer = sequelize.define('customer', {
    customer_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
    },
    name: {
    type: Sequelize.STRING,
    validate:{
        is: ["^[a-z]+$",'i']
    }
},

    password: {
        type: Sequelize.INTEGER,
        validate:{
            isNumeric: true,
        }
    
}
},
   {
        tableName: 'customer',
        timestamps: false
    });

    const account = sequelize.define('account', {
        account_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false,
        autoIncrement:true,
             
        },
        account_no: {
        type: Sequelize.STRING,
        allowNull:false
    },
        amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate:{
        isNumeric: true,
        }    
    },
        customer_id: {
            type: Sequelize. INTEGER,
         
            }
        }, {
            tableName: 'account',
            timestamps: false
        });

        const transaction = sequelize.define('transaction', {
            transaction_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement:true,
                    },
            transaction_to_account_no: {
            type: Sequelize.STRING
        },
            transaction_amount: {
            type: Sequelize.INTEGER,
            allowNull:false
            },
            transaction_time: {
                type: Sequelize.DATE,
                allowNull:false,
                defaultValue: DataTypes.NOW
                },
            account_id: {
                type: Sequelize. INTEGER,
        }
            }, {
                tableName: 'transaction',
                timestamps: false
            });
 
account.belongsTo(customer, {
    foreignKey: 'customer_id',
    constraints: true,
    as: 'customer_account',
    onDelete:'cascade'
  });
  transaction.belongsTo(account, {
    foreignKey: 'account_id',
    constraints: true,
    as: 'account_transaction',
    onDelete:'cascade'
  });
 

sequelize.sync();

module.exports = {
    customer,
    account,
    transaction
}    