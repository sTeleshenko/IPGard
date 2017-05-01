var mongoose = require('mongoose');

var Controller = require('../../lib/controller');
var SaleGroup = require('./sale-group-facade');
var Sale = require('../sale/sale-facade');

class SaleGroupController extends Controller {
    create(req, res, next) {
        let group = req.body;
        let conditions = {};
        conditions.salesOrder = group.salesOrder;
        conditions.date = group.date;
        conditions.reseller = group.reseller;
        conditions._resellerName = group.reseller.name;
        conditions.customer = group.customer;
        conditions._customerName = group.customer.name;
        let serials = [];
        group.items.forEach(item => {
            item.serials.forEach(serial => {
                serials.push(mongoose.Types.ObjectId(serial._id));
            });
        });
        SaleGroup.create(group)
            .then((result) => {
                return Sale.update({ '_id': { $in: serials } }, conditions)
                    .then(() => result)
            })
            .then((result) => res.status(201).json(result))
            .catch(err => next(err));
    }
}

module.exports = new SaleGroupController(SaleGroup);