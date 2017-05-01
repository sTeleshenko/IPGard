const express = require('express');
const Router = require('express').Router;
const router = new Router();

const user = require('./model/user/user-router');
const product = require('./model/product/product-router');
const customer = require('./model/customer/customer-router');
const sale = require('./model/sale/sale-router');
const saleGroup = require('./model/sale-group/sale-group-router');
const category = require('./model/category/category-router');
const field = require('./model/field/field-router');
const staticField = require('./model/static-field/static-field-router');
const type = require('./model/type/type-router');
const document = require('./model/document/document-router');
const upload = require('./model/upload/upload-router');
const rma = require('./model/rma/rma-router');
// const auth = require('./auth/auth.service');


// router.route('/').get((req, res) => {
//   res.json({ message: 'Welcome to api API!' });
// });

router.use('/upload', upload);

// router.use('/uploads', express.static('./uploads'));
router.use('/uploads', express.static('./uploads', {
    setHeaders: (res, path) => {
        if(res.req.query.name) {
            let name = encodeURI(res.req.query.name);
            res.setHeader('Content-disposition', 'inline; filename=' + name + '')
        }
    }
}));
router.use('/auth', require('./auth'));

router.use('/users', user);

router.use('/products', product);

router.use('/customers', customer);

router.use('/sales', sale);

router.use('/salesGroup', saleGroup);

router.use('/categories', category);

router.use('/fields', field);

router.use('/static-fields', staticField);

router.use('/types', type);

router.use('/documents', document);

router.use('/rma', rma);

module.exports = router;
