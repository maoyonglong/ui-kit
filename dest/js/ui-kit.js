var uiKit = (function () {
'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var ScopeDivide =
/*#__PURE__*/
function () {
  function ScopeDivide(scope, step) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'normal';

    _classCallCheck(this, ScopeDivide);

    this.scope = scope;
    this.step = step;
    this.format = format;

    this._divide();
  }

  _createClass(ScopeDivide, [{
    key: "_divide",
    value: function _divide() {
      var scope = this.scope;
      var step = this.step;
      var points = [];

      for (var i = scope[0]; i <= scope[1]; i += step) {
        points.push(i);
      }

      this.points = points;
    }
  }, {
    key: "distance",
    value: function distance() {
      return this.last - this.first;
    }
  }, {
    key: "length",
    value: function length() {
      return this.points.length;
    }
  }, {
    key: "nth",
    value: function nth(key) {
      return this.points[key];
    }
  }, {
    key: "isCrossLeft",
    value: function isCrossLeft(key) {
      return key < 0;
    }
  }, {
    key: "isCrossRight",
    value: function isCrossRight(key) {
      return key >= this.points.length;
    }
  }, {
    key: "hasKey",
    value: function hasKey(key) {
      return key > 0 && key <= this.points.length;
    }
  }, {
    key: "getPos",
    value: function getPos(value) {
      var points = this.points;
      var len = points.length;
      var format = this.format;
      var pos = 0;
      if (value < points[0]) return -1;else if (value > points[len - 1]) return -2;else {
        var prePoint = points[0] - 1;

        for (var i = 1; i < len; i++) {
          var point = points[i];

          if (value === point) {
            pos = i;
            break;
          }

          if (prePoint < value && value < point) {
            if (format === 'normal') {
              pos = i;
            } else if (format === 'round') {
              pos = i;

              if (value < (prePoint + point) / 2) {
                pos--;
              }
            }

            break;
          }

          prePoint = point;
        }
      }
      return pos;
    }
  }, {
    key: "last",
    get: function get() {
      return this.nth(this.points.length - 1);
    }
  }, {
    key: "first",
    get: function get() {
      return this.nth(0);
    }
  }]);

  return ScopeDivide;
}();

var Component =
/*#__PURE__*/
function () {
  function Component(defaultOpts, opts) {
    _classCallCheck(this, Component);

    this.applyOptions(defaultOpts, opts);
  }

  _createClass(Component, [{
    key: "applyOptions",
    value: function applyOptions(defaultOpts, opts) {
      Object.assign(defaultOpts, opts);

      for (var _i = 0, _Object$keys = Object.keys(defaultOpts); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        this[key] = defaultOpts[key];
      }
    }
  }]);

  return Component;
}();

var debounce = _.debounce;

var Range =
/*#__PURE__*/
function (_Component) {
  _inherits(Range, _Component);

  function Range(range, opts) {
    var _this;

    _classCallCheck(this, Range);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Range).call(this, {
      step: 20,
      scope: [0, 100],
      value: 0,
      format: 'number',
      area: document
    }, opts));
    _this.range = range;
    _this.slider = range.querySelector('.range-slider');
    _this.track = range.querySelector('.range-track');
    _this.progress = range.querySelector('.range-progress.active');
    _this.labels = range.querySelectorAll('.range-label');
    _this.viewPoints = range.querySelectorAll('.range-progress-point');
    _this.trackWidth = _this.track.clientWidth;
    _this.trackLeft = _this.track.getBoundingClientRect().left;

    _this.valueDivide();

    _this.viewDivide();

    return _this;
  }

  _createClass(Range, [{
    key: "widthToValue",
    value: function widthToValue(width) {
      var pos = this.viewDivide.getPos(width);

      if (pos === -1) {
        pos = 0;
      } else if (pos === -2) {
        pos = this.viewDivide.length() - 1;
      }

      return this.divide.nth(pos);
    }
  }, {
    key: "normalizeValue",
    value: function normalizeValue() {
      var pos = this.divide.getPos(this.value);
      if (pos === -1) this.value = this.divide.first;else if (pos === -2) this.value = this.divide.last;
    }
  }, {
    key: "valueToWidth",
    value: function valueToWidth(value) {
      var pos = this.divide.getPos(value);
      var offset = this.slider.offsetWidth / 2; // get point

      if (pos === -1 || pos === 0) {
        pos = 0;
        offset = 0;
      } else if (pos === -2 || pos === this.divide.length() - 1) {
        pos = this.divide.length() - 1;
        offset *= 2;
      }

      return this.viewDivide.nth(pos) - offset;
    }
  }, {
    key: "valueDivide",
    value: function valueDivide() {
      this.divide = new ScopeDivide(this.scope, this.step, 'round');
    }
  }, {
    key: "viewDivide",
    value: function viewDivide() {
      var len = this.divide.length();
      this.viewDivide = new ScopeDivide([0, this.trackWidth], this.trackWidth / (len - 1), 'round');
    }
  }, {
    key: "go",
    value: function go(num) {
      this.value = this.divide.nth(num);
      this.setView();
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      this.value = value;
      this.setView();
    }
  }, {
    key: "prev",
    value: function prev() {
      this.value -= this.step;
      this.setView();
    }
  }, {
    key: "next",
    value: function next() {
      this.value += this.step;
      this.setView();
    }
  }, {
    key: "setView",
    value: function setView() {
      this.normalizeValue();
      var width = this.valueToWidth(this.value) + 'px';
      this.slider.style.marginLeft = this.progress.style.width = width;
      this.activePoint(this.divide.getPos(this.value));
    }
  }, {
    key: "setPointView",
    value: function setPointView() {
      var _this2 = this;

      var points = this.divide.points;
      var viewPoints = this.viewPoints;
      points.forEach(function (point, idx) {
        viewPoints[idx].style.left = _this2.valueToWidth(point) + 'px';
      });
    }
  }, {
    key: "setLabelView",
    value: function setLabelView() {
      var _this3 = this;

      var points = this.divide.points;
      var labels = this.labels;
      points.forEach(function (point, idx) {
        var isEnd = idx === labels.length - 1;
        if (isEnd) labels[idx].style.right = 0;else labels[idx].style.left = _this3.valueToWidth(point) + 'px';
      });
    }
  }, {
    key: "activePoint",
    value: function activePoint(pos) {
      var viewPoints = this.viewPoints;

      for (var i = 0, len = viewPoints.length; i < len; i++) {
        var viewPoint = viewPoints[i];
        var isActive = viewPoint.classList.contains('active');

        if (i <= pos) {
          if (!isActive) viewPoint.classList.add('active');
        } else if (isActive) {
          viewPoint.classList.remove('active');
        }
      }
    }
  }, {
    key: "setSlowView",
    value: function setSlowView(viewWidth) {
      var viewDivide = this.viewDivide;
      var offset = this.slider.offsetWidth;

      if (viewWidth >= viewDivide.last) {
        viewWidth = viewDivide.last - offset;
      } else if (viewWidth < viewDivide.first) {
        viewWidth = viewDivide.first;
      }

      this.viewWidth = viewWidth;
      this.slider.style.marginLeft = this.progress.style.width = viewWidth + 'px';
    }
  }, {
    key: "on",
    value: function on() {
      var _this4 = this;

      var canSlide = false; // start

      var start = function start(event) {
        event.preventDefault();
        event.stopPropagation();
        canSlide = true;
      };

      var end = function end(event) {
        canSlide = false;
        if (event.target !== _this4.slider) return;
        event.stopPropagation();

        _this4.setValue(_this4.widthToValue(_this4.viewWidth));
      };

      var move = debounce(function (event) {
        event.preventDefault();
        event.stopPropagation(); // move slowly

        if (canSlide) {
          var distance = (event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX) - _this4.trackLeft;

          _this4.setSlowView(distance);
        }
      }, 100);

      var click = function click(event) {
        event.stopPropagation();
        var point = event.target;
        var i = 0,
            len = _this4.viewPoints.length; // find point

        while (i < len) {
          if (point === _this4.viewPoints[i]) break;
          i++;
        } // if found


        if (i <= len) {
          _this4.setValue(_this4.divide.nth(i));
        }
      };

      this.slider.addEventListener('mousedown', start, false);
      this.slider.addEventListener('touchstart', start, false);
      this.range.querySelector('.range-progress-wrap').addEventListener('click', click, false);
      this.area.addEventListener('mouseup', end, false);
      this.area.addEventListener('touchend', end, false);
      this.area.addEventListener('mousemove', move, false);
      this.area.addEventListener('touchmove', move, false);
    }
  }, {
    key: "init",
    value: function init() {
      this.on();
      this.setView();
      this.setPointView();
      this.setLabelView();
    }
  }]);

  return Range;
}(Component);

var Switch =
/*#__PURE__*/
function (_Component) {
  _inherits(Switch, _Component);

  function Switch(swit, opts) {
    var _this;

    _classCallCheck(this, Switch);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Switch).call(this, {
      value: false
    }, opts));
    _this.swit = swit;
    _this.slider = swit.querySelector('.switch-slider');

    _this.setSwitchWidth();

    return _this;
  }

  _createClass(Switch, [{
    key: "setSwitchWidth",
    value: function setSwitchWidth() {
      var switWidth = this.swit.offsetWidth;
      var sliderWidth = this.slider.offsetWidth;
      var sliderLeft = this.slider.offsetLeft;
      this.switchWidth = [sliderLeft, switWidth - sliderWidth - sliderLeft];
    }
  }, {
    key: "activeView",
    value: function activeView() {
      var classList = this.swit.classList;
      var isActive = classList.contains('active');

      if (this.value) {
        if (!isActive) {
          classList.add('active');
        }
      } else if (isActive) {
        classList.remove('active');
      }
    }
  }, {
    key: "setView",
    value: function setView() {
      var i = this.value ? 1 : 0;
      this.slider.style.marginLeft = this.switchWidth[i] + 'px';
      this.activeView();
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      this.setView();
      this.slider.addEventListener('click', function (event) {
        event.stopPropagation();
        _this2.value = !_this2.value;

        _this2.setView();
      });
    }
  }]);

  return Switch;
}(Component);

var index = {
  Range: Range,
  Switch: Switch
};

return index;

}());
