class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  create(input) {
    const schema = new this.Schema(input);
    return schema.save();
  }

  createCollection(collection) {
    return this.Schema.create(collection);
  }

  update(conditions, update) {
    return this.Schema
      .update(conditions, update, { new: true, multi: true })
      .exec();
  }

  find(query) {
    return this.Schema
      .find(query)
      .exec();
  }

  findOne(query) {
    return this.Schema
      .findOne(query)
      .exec();
  }

  findById(id) {
    return this.Schema
      .findById(id)
      .exec();
  }

  remove(id) {
    return this.Schema
      .findByIdAndRemove(id)
      .exec();
  }

  removeCollection(query) {
    return this.Schema
    .find(query)
    .remove()
    .exec();
  }

  populate(collection, params) {
    return this.Schema
      .populate(collection, params);
  }
}

module.exports = Facade;
