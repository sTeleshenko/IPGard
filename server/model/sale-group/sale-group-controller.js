var mongoose = require('mongoose');

var Controller = require('../../lib/controller');
const escape = require('../../lib/escape');
var SaleGroup = require('./sale-group-facade');
var Sale = require('../sale/sale-facade');

var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

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

    update(req, res, next) {
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
        this.model.update({ _id: req.params.id}, group)
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
                    query[key] = new RegExp(escape(req.query[key]), 'i');
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

    exportReport(req, res, next) {
        //Load the docx file as a binary
        var content = fs
            .readFileSync(path.resolve(__dirname + '/../../lib', 'end_of_day.docx'), 'binary');
        var zip = new JSZip(content);
        var doc = new Docxtemplater();
        doc.loadZip(zip);
        let query = {};
        if (req.query) {
            for (let key in req.query) {
                if (key === 'dateFrom') {
                    query.date = query.date || {};
                    query.date['$gte'] = req.query[key];
                } else if (key === 'dateTo') {
                    query.date = query.date || {};
                    query.date['$lte'] = req.query[key];
                } else if(key === 'access_token') {
                    delete req.query.access_token;
                } else {
                    query[key] = new RegExp(escape(req.query[key]), 'i');
                }
            }
        }
        return this.model.find(query)
            .then(collection => this.model.populate(collection, { path: 'items.product' }))
            .then(collection => this.model.populate(collection, { path: 'items.serials' }))
            .then(collection => {
                //set the templateVariables
                var dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : new Date();
                dateFrom = dateFrom.toISOString();
                dateFrom = dateFrom.slice(0, 10);
                dateFrom = dateFrom.split('-');
                dateFrom = `${dateFrom[1]}-${dateFrom[2]}-${dateFrom[0]}`;
                doc.setData({
                    dateFrom: `${dateFrom}`,
                    salesOrders: collection.map(order => {
                        order = order.toObject();
                        order.items = order.items.map(item => {
                            item.productName = item.product.model;
                            return item;
                        });
                        return order;
                    })
                });

                try {
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render();
                    var buf = doc.getZip()
                        .generate({ type: 'nodebuffer' });
                    res.writeHead(200, {
                        // 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'Content-Disposition': `attachment; filename=END OF DAY ${dateFrom}.docx`
                    });
                    res.end(buf);
                }
                catch (error) {
                    var e = {
                        message: error.message,
                        name: error.name,
                        stack: error.stack,
                        properties: error.properties,
                    }
                    console.log(JSON.stringify({ error: e }));
                    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                    throw error;
                }
            })
            .catch(err => next(err));
    }
}

module.exports = new SaleGroupController(SaleGroup);