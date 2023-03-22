module.exports = class baseSlashCommand {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
};
