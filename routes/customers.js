const express = require('express');
const router = express.Router();
const { Customer, validateCustomerPost, validateCustomerPut } = require('../models/customer');

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort({ name: 1 });
    
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomerPost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomerPut(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    
    for (let key in req.body)
        customer[key] = req.body[key];

    customer = await customer.save();

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
   const customer = await Customer.findByIdAndRemove(req.params.id);
   
   if (!customer) return res.status(404).send('The customer with the given ID was not found.');

   res.send(customer);
});

module.exports = router;