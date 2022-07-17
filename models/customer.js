const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validateCustomerPost(customer) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
}

function validateCustomerPut(changes) {
    const schema = {
        name: Joi.string().min(3).max(50),
        phone: Joi.string().min(5).max(50),
        isGold: Joi.boolean()
    }

    return Joi.validate(changes, schema);
}

module.exports.Customer = Customer;
module.exports.validateCustomerPost = validateCustomerPost;
module.exports.validateCustomerPut = validateCustomerPut;