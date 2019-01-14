var App = {};

(function() {
  App.utils = {
    thousandSeparator: function(x) {
      var floatValue = (x - Math.floor(x)).toString().substring(2, 4);
      var x = Math.floor(x);
      var value = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      if (floatValue) {
        return value + ',' + floatValue;
      }
      return value
    }
  };
}());
