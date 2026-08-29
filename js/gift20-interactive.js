(function () {
  "use strict";

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function throttle(fn, delay) {
    var allowSample = true;
    return function (e) {
      if (allowSample) {
        allowSample = false;
        setTimeout(function () {
          allowSample = true;
        }, delay);
        fn(e);
      }
    };
  }

  function getMousePos(e) {
    var posx = 0,
      posy = 0;
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      posy =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    return { x: posx, y: posy };
  }

  function distancePoints(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }

  function lineEq(y2, y1, x2, x1, currentVal) {
    var m = (y2 - y1) / (x2 - x1);
    var b = y1 - m * x1;
    return m * currentVal + b;
  }

  var docScrolls = {
    left: document.body.scrollLeft + document.documentElement.scrollLeft,
    top: document.body.scrollTop + document.documentElement.scrollTop,
  };

  function Point(el, bgEl, wrapper, options) {
    this.el = el;
    this.wrapper = wrapper;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this.bgEl = bgEl;
    this.position = this._updatePosition();
    this.dmax =
      this.options.viewportFactor !== -1 && this.options.viewportFactor > 0
        ? this.wrapper.offsetWidth / this.options.viewportFactor
        : this.options.maxDistance;
    if (this.dmax < this.options.activeOn) {
      this.options.activeOn = this.dmax - 5;
    }
    this.isActive = false;
    this._initEvents();
  }

  Point.prototype.options = {
    maxOpacity: 0.8,
    activeOn: 30,
    maxDistance: 150,
    viewportFactor: -1,
    onActive: function () {
      return false;
    },
    onInactive: function () {
      return false;
    },
    onClick: function () {
      return false;
    },
  };

  Point.prototype._initEvents = function () {
    var self = this;

    this._throttleMousemove = throttle(function (ev) {
      requestAnimationFrame(function () {
        var mousepos = getMousePos(ev);
        var distance = distancePoints(
          mousepos.x - docScrolls.left,
          mousepos.y - docScrolls.top,
          self.position.x - docScrolls.left,
          self.position.y - docScrolls.top,
        );
        var opacity = self._distanceToOpacity(distance);

        if (self.bgEl) {
          self.bgEl.style.opacity = opacity;
        }

        if (!self.isActive && opacity === self.options.maxOpacity) {
          self.options.onActive();
          self.isActive = true;
        }

        if (opacity !== self.options.maxOpacity && self.isActive) {
          self.options.onInactive();
          self.isActive = false;
        }
      });
    }, 20);
    this.wrapper.addEventListener("mousemove", this._throttleMousemove);

    this._click = function (ev) {
      ev.stopPropagation();
      self.options.onClick();
    };
    this.el.addEventListener("click", this._click);

    this._throttleResize = throttle(function () {
      self.position = self._updatePosition();
      if (
        self.options.viewportFactor !== -1 &&
        self.options.viewportFactor > 0
      ) {
        self.dmax = self.wrapper.offsetWidth / self.options.viewportFactor;
      }
    }, 100);
    window.addEventListener("resize", this._throttleResize);

    this.wrapper.addEventListener("mouseleave", function () {
      if (!self.isActive && self.bgEl) {
        self.bgEl.style.opacity = 0;
      }
    });
  };

  Point.prototype._updatePosition = function () {
    var rect = this.el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 + docScrolls.left,
      y: rect.top + rect.height / 2 + docScrolls.top,
    };
  };

  Point.prototype._distanceToOpacity = function (d) {
    return Math.min(
      Math.max(
        lineEq(this.options.maxOpacity, 0, this.options.activeOn, this.dmax, d),
        0,
      ),
      this.options.maxOpacity,
    );
  };

  Point.prototype.hide = function () {
    this.el.classList.add("gift20-point--hide");
  };

  Point.prototype.show = function () {
    this.el.classList.remove("gift20-point--hide");
  };

  Point.prototype.pause = function () {
    this.wrapper.removeEventListener("mousemove", this._throttleMousemove);
  };

  Point.prototype.resume = function () {
    this.wrapper.addEventListener("mousemove", this._throttleMousemove);
  };

  function PointsMap(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this.isOpen = false;

    this.bgsWrapper = this.el.querySelector(".gift20-backgrounds");
    if (!this.bgsWrapper) return;

    this.bgElems = [].slice.call(
      this.bgsWrapper.querySelectorAll(".gift20-bg-element"),
    );
    this.bgElemsTotal = this.bgElems.length;
    if (this.bgElemsTotal <= 1) return;

    this.pointsWrapper = this.el.querySelector(".gift20-points");
    if (!this.pointsWrapper) return;

    this.tooltips = [].slice.call(
      this.el.querySelector(".gift20-tooltips").children,
    );
    this.pointsContentWrapper = this.el.querySelector(".gift20-contents");
    this.contents = [].slice.call(this.pointsContentWrapper.children);

    this._createContentWrapper();

    this._init();
  }

  PointsMap.prototype.options = {
    maxOpacityOnActive: 0.8,
    maxDistance: 150,
    viewportFactor: 9,
    activeOn: 30,
  };

  PointsMap.prototype._createContentWrapper = function () {
    var wrapper = document.createElement("div");
    wrapper.className = "gift20-content-wrapper";

    var left = document.createElement("div");
    left.className = "gift20-content-left";

    var right = document.createElement("div");
    right.className = "gift20-content-right";

    wrapper.appendChild(left);
    wrapper.appendChild(right);

    this.contents.forEach(function (content) {
      left.appendChild(content);
    });

    this.contentWrapper = wrapper;
    this.contentLeft = left;
    this.contentRight = right;

    this.pointsContentWrapper.appendChild(wrapper);

    var self = this;
    wrapper.addEventListener("click", function (e) {
      self._closeContent();
    });
  };

  PointsMap.prototype._init = function () {
    var self = this;

    function onLoaded() {
      self._createPoints();
    }

    if (typeof imagesLoaded !== "undefined") {
      imagesLoaded(this.bgsWrapper, { background: true }, onLoaded);
    } else {
      setTimeout(onLoaded, 500);
    }

    this._initEvents();
  };

  PointsMap.prototype._initEvents = function () {
    var self = this;

    this._throttleResize = throttle(function () {
      docScrolls = {
        left: document.body.scrollLeft + document.documentElement.scrollLeft,
        top: document.body.scrollTop + document.documentElement.scrollTop,
      };
    }, 100);
    window.addEventListener("resize", this._throttleResize);

    this.pointsContentWrapper.addEventListener("click", function (e) {
      if (e.target === self.pointsContentWrapper) {
        self._closeContent();
      }
    });

    this.el.addEventListener("keydown", function (ev) {
      if ((ev.keyCode === 27 || ev.key === "Escape") && self.isOpen) {
        self._closeContent();
      }
    });
  };

  PointsMap.prototype._closeContent = function () {
    if (!this.isOpen) return;
    this.isOpen = false;

    var currentPoint = this.points[this.currentPoint];
    if (currentPoint) {
      currentPoint.isActive = false;
      if (currentPoint.bgEl) {
        currentPoint.bgEl.style.opacity = 0;
      }
      currentPoint.el.classList.remove("gift20-point--active");
    }

    this.pointsContentWrapper.classList.remove("gift20-contents--open");
    this.contents.forEach(function (content) {
      content.classList.remove("gift20-content--current");
    });

    this._pointsAction("resume");
    this._pointsAction("show");
  };

  PointsMap.prototype._openContent = function (pos) {
    this.currentPoint = pos;
    this.isOpen = true;

    this._pointsAction("hide");

    this.tooltips.forEach(function (tooltip) {
      tooltip.classList.remove("gift20-tooltip--current");
    });

    if (this.points[pos].bgEl) {
      this.points[pos].bgEl.style.opacity = 1;
    }

    var bgImage = this.bgElems[pos];
    if (bgImage) {
      var bgUrl = bgImage.style.backgroundImage;
      this.contentRight.style.backgroundImage = bgUrl;
    }

    this.pointsContentWrapper.classList.add("gift20-contents--open");
    this.contents[pos].classList.add("gift20-content--current");

    this._pointsAction("pause");
  };

  PointsMap.prototype._createPoints = function () {
    this.points = [];
    var self = this;
    var points = [].slice.call(
      this.pointsWrapper.querySelectorAll(".gift20-point"),
    );

    points.forEach(function (point, pos) {
      var p = new Point(point, self.bgElems[pos], self.el, {
        maxOpacity: self.options.maxOpacityOnActive,
        activeOn: self.options.activeOn,
        maxDistance: self.options.maxDistance,
        viewportFactor: self.options.viewportFactor,
        onActive: function () {
          self.points[pos].el.classList.add("gift20-point--active");
          self._pointsAction("hide", pos);
          var tooltip = self.tooltips[pos];
          if (tooltip) {
            tooltip.classList.add("gift20-tooltip--current");
            var rect = self.points[pos].el.getBoundingClientRect();
            var bounds = self.el.getBoundingClientRect();
            tooltip.style.left =
              rect.left - bounds.left + rect.width / 2 + "px";
            tooltip.style.top = rect.top - bounds.top + rect.height + "px";
          }
        },
        onInactive: function () {
          self.points[pos].el.classList.remove("gift20-point--active");
          self._pointsAction("show", pos);
          var tooltip = self.tooltips[pos];
          if (tooltip) {
            tooltip.classList.remove("gift20-tooltip--current");
          }
        },
        onClick: function () {
          if (self.isOpen) {
            self._closeContent();
            setTimeout(function () {
              self._openContent(pos);
            }, 50);
          } else {
            self._openContent(pos);
          }

          self.currentPoint = pos;
          self.isOpen = true;

          self._pointsAction("hide");

          if (self.points[pos].bgEl) {
            self.points[pos].bgEl.style.opacity = 1;
          }

          var bgImage = self.bgElems[pos];
          if (bgImage) {
            var bgUrl = bgImage.style.backgroundImage;
            self.contentRight.style.backgroundImage = bgUrl;
          }

          self.pointsContentWrapper.classList.add("gift20-contents--open");
          self.contents[pos].classList.add("gift20-content--current");

          self._pointsAction("pause");
        },
      });
      self.points.push(p);
    });
  };

  PointsMap.prototype._pointsAction = function (action, excludedPoint) {
    for (var i = 0, len = this.points.length; i < len; ++i) {
      if (
        i !== excludedPoint &&
        this.points[i] &&
        typeof this.points[i][action] === "function"
      ) {
        this.points[i][action]();
      }
    }
  };

  function initInteractivePoints() {
    var el = document.getElementById("interactive-gift");
    if (el && typeof PointsMap !== "undefined") {
      new PointsMap(el);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInteractivePoints);
  } else {
    initInteractivePoints();
  }
})();
