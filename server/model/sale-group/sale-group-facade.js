const Model = require('../../lib/facade');
const saleGroupSchema  = require('./sale-group-schema');


class SaleGroupModel extends Model {
    paginate(query, options) {
        return this.Schema.paginate(query, options);
    }
}

module.exports = new SaleGroupModel(saleGroupSchema);