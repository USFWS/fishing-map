const store = require('store');

const Disclaimer = function(opts) {
  this.container = opts.container;
  this.checkbox = opts.checkbox;
  this.close = opts.close;
  const display = store.get('disclaimer');

  if (display === 'show' || !display) this.show();
  else this.remove();

  this.checkbox.addEventListener('click', () => {
    this.remove();
    this.dontShowAgain();
  });

  this.close.addEventListener('click', () => {
    this.remove();
  });
};

Disclaimer.prototype.remove = function() {
  this.container.parentNode.removeChild(this.container);
};

Disclaimer.prototype.show = function() {
  this.container.classList.add('show');
};

Disclaimer.prototype.dontShowAgain = function() {
  store.set('disclaimer', 'hide');
};

module.exports = Disclaimer;
