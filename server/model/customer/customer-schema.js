const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const StaticField = require('../static-field/static-field-schema');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    type: { type: String, enum: ['reseller', 'endUser'], default: 'reseller' },
    name: { type: String, required: true },
    address: { type: String, required: false, default: '' },
    city: { type: String, required: false, default: '' },
    zipCode: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' },
    contactPerson: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    state: { type: String, required: false, default: '' },
    country: { type: String, required: false, default: '' },
    salesRep: { type: String, default: '' },
    dateCreate: { type: Date, default: Date.now },
    fields: [{
        field: { type: mongoose.Schema.Types.ObjectId, ref: 'StaticField' },
        value: mongoose.Schema.Types.Mixed
    }]
});

customerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Customer', customerSchema);