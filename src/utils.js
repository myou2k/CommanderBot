class Utils {
  run() {
    Object.defineProperty(Array.prototype, "shuffle", {
      value: function () {
        for (let i = this.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this[i], this[j]] = [this[j], this[i]];
        }
        return this;
      },
    });
  }
}

module.exports = new Utils