const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
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
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        required: true,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRentalPost(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
        rentalFee: Joi.number().min(0).required()
    };
    
    return Joi.validate(rental, schema);
}

function validateRentalPut(changes) {
    const schema = {
        customerId: Joi.objectId(),
        movieId: Joi.objectId(),
        dateOut: Joi.date(),
        dateReturned: Joi.date(),
        rentalFee: Joi.number().min(0)
    };
    
    return Joi.validate(changes, schema);
}

module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
module.exports.validateRentalPost = validateRentalPost;
module.exports.validateRentalPut = validateRentalPut;
