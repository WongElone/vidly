const autho = require('../middleware/autho');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validateUserPost, validateUserPut } = require('../models/user');

router.get('/me', autho, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');

    res.send(_.pick(users, ['_id', 'name', 'email']));
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).send('User with the given ID was not found.');
    
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/', async (req, res) => {
    const { error } = validateUserPost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    
    const token = user.generateAuthenToken();
    res.header('x-authen-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
    const { error } = validateUserPut(req.body);
    
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User with the given ID was not found.');
    
    for (let key in req.body) {
        if (key === "password") {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        else user[key] = req.body[key];
    }
        
    await user.save();
    
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', async (req, res) => {    
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(404).send('User with the given ID was not found.');
    
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;