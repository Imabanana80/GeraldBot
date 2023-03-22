module.exports = class baseEvent {
  constructor(name, isOnce = false) {
    this._name = name;
    this._isOnce = isOnce;
  }
  get name() {
    return this._name;
  }
  get isOnce() {
    return this._isOnce;
  }
};
