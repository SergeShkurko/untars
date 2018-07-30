var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
  "use strict";

  function e(e, t, r, o, i, n) {
    return r = (parseFloat(r || 0) - parseFloat(e || 0)) * i, o = (parseFloat(o || 0) - parseFloat(t || 0)) * n, Math.sqrt(r * r + o * o)
  }

  function t(e) {
    return "string" != typeof e && e.nodeType || (e = _gsScope.TweenLite.selector(e)).length && (e = e[0]), e
  }

  function r(e, t, r) {
    var o, i, n = e.indexOf(" ");
    return -1 === n ? (o = void 0 !== r ? r + "" : e, i = e) : (o = e.substr(0, n), i = e.substr(n + 1)), o = -1 !== o.indexOf("%") ? parseFloat(o) / 100 * t : parseFloat(o), i = -1 !== i.indexOf("%") ? parseFloat(i) / 100 * t : parseFloat(i), o > i ? [i, o] : [o, i]
  }

  function o(r) {
    if (!r) return 0;
    var o, i, n, s, a, f, d, l = (r = t(r)).tagName.toLowerCase(),
      g = 1,
      u = 1;
    "non-scaling-stroke" === r.getAttribute("vector-effect") && (g = (u = r.getScreenCTM()).a, u = u.d);
    try {
      i = r.getBBox()
    } catch (e) { }
    if (i && (i.width || i.height) || "rect" !== l && "circle" !== l && "ellipse" !== l || (i = {
      width: parseFloat(r.getAttribute("rect" === l ? "width" : "circle" === l ? "r" : "rx")),
      height: parseFloat(r.getAttribute("rect" === l ? "height" : "circle" === l ? "r" : "ry"))
    }, "rect" !== l && (i.width *= 2, i.height *= 2)), "path" === l) s = r.style.strokeDasharray, r.style.strokeDasharray = "none", o = r.getTotalLength() || 0, g !== u && console.log("Warning: <path> length cannot be measured accurately when vector-effect is non-scaling-stroke and the element isn't proportionally scaled."), o *= (g + u) / 2, r.style.strokeDasharray = s;
    else if ("rect" === l) o = 2 * i.width * g + 2 * i.height * u;
    else if ("line" === l) o = e(i.x, i.y, i.x + i.width, i.y + i.height, g, u);
    else if ("polyline" === l || "polygon" === l)
      for (n = r.getAttribute("points").match(h) || [], "polygon" === l && n.push(n[0], n[1]), o = 0, a = 2; a < n.length; a += 2) o += e(n[a - 2], n[a - 1], n[a], n[a + 1], g, u) || 0;
    else "circle" !== l && "ellipse" !== l || (f = i.width / 2 * g, d = i.height / 2 * u, o = Math.PI * (3 * (f + d) - Math.sqrt((3 * f + d) * (f + 3 * d))));
    return o || 0
  }

  function i(e, r) {
    if (!e) return [0, 0];
    e = t(e), r = r || o(e) + 1;
    var i = a(e),
      n = i.strokeDasharray || "",
      s = parseFloat(i.strokeDashoffset),
      h = n.indexOf(",");
    return h < 0 && (h = n.indexOf(" ")), (n = h < 0 ? r : parseFloat(n.substr(0, h)) || 1e-5) > r && (n = r), [Math.max(0, -s), Math.max(0, n - s)]
  }
  var n, s = _gsScope.document,
    a = s.defaultView ? s.defaultView.getComputedStyle : function () { },
    h = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
    f = -1 !== ((_gsScope.navigator || {}).userAgent || "").indexOf("Edge");
  (n = _gsScope._gsDefine.plugin({
    propName: "drawSVG",
    API: 2,
    version: "0.1.5",
    global: !0,
    overwriteProps: ["drawSVG"],
    init: function (e, t, n, s) {
      if (!e.getBBox) return !1;
      var h, u, c, p, C = o(e) + 1;
      return this._style = e.style, "function" == typeof t && (t = t(s, e)), !0 === t || "true" === t ? t = "0 100%" : t ? -1 === (t + "").indexOf(" ") && (t = "0 " + t) : t = "0 0", h = i(e, C), u = r(t, C, h[0]), this._length = C + 10, 0 === h[0] && 0 === u[0] ? (c = Math.max(1e-5, u[1] - C), this._dash = C + c, this._offset = C - h[1] + c, this._addTween(this, "_offset", this._offset, C - u[1] + c, "drawSVG")) : (this._dash = h[1] - h[0] || 1e-6, this._offset = -h[0], this._addTween(this, "_dash", this._dash, u[1] - u[0] || 1e-5, "drawSVG"), this._addTween(this, "_offset", this._offset, -u[0], "drawSVG")), f && "butt" !== (u = (p = a(e)).strokeLinecap) && u !== p.strokeLinejoin && (u = parseFloat(p.strokeMiterlimit), this._addTween(e.style, "strokeMiterlimit", u, u + 1e-4, "strokeMiterlimit")), !0
    },
    set: function (e) {
      this._firstPT && (this._super.setRatio.call(this, e), this._style.strokeDashoffset = this._offset, this._style.strokeDasharray = 1 === e || 0 === e ? this._offset < .001 && this._length - this._dash <= 10 ? "none" : this._offset === this._dash ? "0px, 999999px" : this._dash + "px," + this._length + "px" : this._dash + "px," + this._length + "px")
    }
  })).getLength = o, n.getPosition = i
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
  function (e) {
    "use strict";
    var t = function () {
      return (_gsScope.GreenSockGlobals || _gsScope).DrawSVGPlugin
    };
    // "undefined" != typeof module && module.exports ? (require("../TweenLite.js"), module.exports = t()) : "function" == typeof define && define.amd && define(["TweenLite"], t)
  }();
