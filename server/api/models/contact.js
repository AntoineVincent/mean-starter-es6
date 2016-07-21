import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import token from '../../token.js';

const contactSchema = new mongoose.Schema({
    nom: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        required: 'Phone Number is required',
        validate: [function(phone) {
            return /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(phone)
        }, 'Please fill a valid phone number'],
        match: [/^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/, 'Please fill a valid phone number'],
        unique: true
    }
});

let model = mongoose.model('Contact', contactSchema);

export default class Contact {

    findAll(req, res) {
        model.find({}, (err, contacts) => {
            if (err) {
                res.sendStatus(403);
            } else {
                res.json(contacts);
            }
        });
    }

    findById(req, res) {
        model.findById(req.params.id, (err, contact) => {
            if (err || !contact) {
                res.sendStatus(403);
            } else {
                res.json(contact);
            }
        });
    }

    create(req, res) {
        model.create(req.body,
            (err, contact) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.json(contact);
                }
            });
    }

    update(req, res) {
        model.update({
            _id: req.params.id
        }, req.body, (err, contact) => {
            if (err || !contact) {
                res.status(500).send(err.message);
            } else {
                res.json(contact);
            }
        });
    }

    delete(req, res) {
        model.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.sendStatus(200);
            }
        })
    }
}
