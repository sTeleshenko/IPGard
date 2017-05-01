var Controller = require('../../lib/controller');
var SaleGroup = require('./sale-group-facade');

class SaleGroupController extends Controller {}

module.exports = new SaleGroupController(SaleGroup);