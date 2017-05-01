var mongoose = require('mongoose');

var Controller = require('../../lib/controller');
var SaleGroup = require('./sale-group-facade');
var Sale = require('../sale/sale-facade');

class SaleGroupController extends Controller {
    create(req, res, next) {
        let group = req.body;
        group._resellerName = group.reseller.name;
        group._customerName = group.customer.name;
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
        this.model.create(group)
            .then((result) => {
                return Sale.update({ '_id': { $in: serials } }, conditions)
                    .then(() => result)
            })
            .then((result) => res.status(201).json(result))
            .catch(err => next(err));
    }

    find(req, res, next) {
        let options = {};
        if (req.query.sort) {
            options.sort = req.query.sort;
            delete req.query.sort;
        }
        if (req.query.page) {
            options.page = +req.query.page;
            delete req.query.page;
        }
        if (req.query.limit) {
            options.limit = +req.query.limit;
            delete req.query.limit;
        }
        let query = {};
        if (req.query) {
            for (let key in req.query) {
                if (key === 'dateFrom') {
                    query.date = query.date || {};
                    query.date['$gte'] = req.query[key];
                } else if (key === 'dateTo') {
                    query.date = query.date || {};
                    query.date['$lte'] = req.query[key];
                } else {
                    query[key] = new RegExp(req.query[key], 'i');
                }
            }
        }
        return this.model.paginate(query, options)
            .then(collection => res.status(200).json(collection))
            .catch(err => next(err));
    }

    findById(req, res, next) {
        return this.model.findById(req.params.id)
            .then(doc => this.model.populate(doc, { path: 'customer' }))
            .then(doc => this.model.populate(doc, { path: 'reseller' }))
            .then(doc => this.model.populate(doc, { path: 'items.product' }))
            .then(doc => this.model.populate(doc, { path: 'items.serials' }))
            .then(doc => {
                if (!doc) { return res.status(404).end(); }
                return res.status(200).json(doc);
            })
            .catch(err => next(err));
    }
}

module.exports = new SaleGroupController(SaleGroup);