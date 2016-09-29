// define SambaPOS Utils Object
var spu = {};


spu.focused = function() {
    var focused = document.activeElement;
    if (!focused || focused == document.body) {
        focused = null;
    } else if (document.querySelector) {
    focused = document.querySelector(":focus");
    }
    return focused;
};

spu.consoleLog = function (msg, vals) {
    if (vals) {
    }
    //var when  = new Date();
    var when = '['+formatDateTime(new Date(),true)+'] ';
    console.log(when+msg);
};

spu.debounce = function (func, wait, immediate) {
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


spu.throttle = function (fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};
