const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    model: String,
    partNumber: String,
    upc: String,
    description: String,
    inStock: { type: Number, default: 0 },
    dateCreate: { type: Date, default: Date.now }
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);