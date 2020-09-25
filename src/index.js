const express = require('express')
const app = express()
const port = process.env.PORT ||5000
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    next();
  });
  
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const { customer, account, transaction } = require('../model/bank_model');

//Customer account creation
app.post('/customer', async (req, res) => {
    try {
        const newCustomer = await new customer(req.body)
        const newAccount = await new account(req.body)
        await newCustomer.save();
        newAccount.customer_id = newCustomer.customer_id;
        await newAccount.save();
        let Customer = { ...JSON.parse(JSON.stringify(newCustomer)) , ...JSON.parse(JSON.stringify(newAccount))};
        res.status(200).send(Customer);
    } catch(error) {
        res.status(400).send(error);
    }
})

//customer new account creation
app.post('/customer/newAccount', async (req, res) => {
    try {
        let customer_account =  await customer.findOne({
            where:{
                name:req.body.name
            }
        })
        if(!customer_account){
            return res.send("ID doesnt exist");
        }
        customer_account = JSON.parse(JSON.stringify(customer_account));
        const newAccount = await new account(req.body)
        newAccount.customer_id = customer_account.customer_id;
        await newAccount.save();
        let Customer = { ...customer_account , ...JSON.parse(JSON.stringify(newAccount))};
        res.status(200).send(Customer);
    } catch(error) {
        res.status(400).send(error);
    }
})
//Retrieve balance for a given account
app.get('/customer/:account_no', async (req, res) => {
    try {
        let customer_account =  await account.findOne({
            where:{
                account_no:req.params.account_no
            }
        })
        if(!customer_account)
        {
            return res.send("Account doesnt exist");
        }
        customer_account = JSON.parse(JSON.stringify(customer_account));
        res.status(200).send(customer_account);
    } catch(error) {
        res.status(400).send(error);
    }
})

//Make transactions between accounts
app.patch('/customer/transaction/:account_no_sender', async (req, res) => {
    try {
        if(req.params.account_no_sender === req.body.account_no_receiver)
        {
           return res.send("Transaction cant be made between same accounts");
        }
        //Sender
        let sender_account = await account.findOne(
            {
            where:{
                account_no:req.params.account_no_sender
            }
        })
        if(!sender_account)
        {
            return res.send("Sender account doesnt exist")
        }
        //Reciever
        let receiver_account = await account.findOne(
            {
            where:{
                account_no:req.body.account_no_receiver
            }
        })
        if(!receiver_account)
        {
            return res.send("receiver account doesnt exist")
        }
        sender_account = JSON.parse(JSON.stringify(sender_account));
        receiver_account = JSON.parse(JSON.stringify(receiver_account));
        let sending_amount = Number(sender_account.amount) - Number(req.body.amount);
        let receiving_amount = Number(receiver_account.amount) + Number(req.body.amount);
        //sender
        let account3 = await account.update({
            amount:sending_amount
        },
            {
            where:{
                account_no:req.params.account_no_sender
            }
        })
        //Reciever
        let account4 = await account.update({
            amount:receiving_amount
        },
            {
            where:{
                account_no:req.body.account_no_receiver
            }
        })
        let transaction1 = await new transaction({
            transaction_to_account_no:receiver_account.account_no,
            transaction_amount:Number(req.body.amount),
            account_id:sender_account.account_id
        })
        await transaction1.save();
        res.json({transaction_details:transaction1
                })
} catch(error) {
    res.status(400).send(error);
}
}) 
//Retrieve transfer history for a given account
app.get('/customer/transactions/:account_no', async (req, res) => {
    try {
        let customer_account =  await account.findOne({
            where:{
                account_no:req.params.account_no
            }
        })
        customer_account = JSON.parse(JSON.stringify(customer_account));
        let all_transaction = await transaction.findAll({
            where:{
                account_id:customer_account.account_id
        }
    })
        res.status(200).send(all_transaction);
    } catch(error) {
        res.status(400).send(error);
    }
})
//
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
