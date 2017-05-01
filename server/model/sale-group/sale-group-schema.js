const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Product = require('./../product/product-schema');
const Customer = require('./../customer/customer-schema');
const Sale = require('./../sale/sale-schema');
const Schema = mongoose.Schema;

const saleGroupSchema = new Schema({
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            serials: [
                { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }
            ]
        },
    ],
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    _customerName: {type: String, required: false, default: ''},
    reseller: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    _resellerName: {type: String, required: false, default: ''},
    salesOrder: {type: String, required: true, default: ''},
    date: {type: Date, required: false},
    dateCreate: { type: Date, default: Date.now }
});

saleGroupSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SaleGroup', saleGroupSchema);