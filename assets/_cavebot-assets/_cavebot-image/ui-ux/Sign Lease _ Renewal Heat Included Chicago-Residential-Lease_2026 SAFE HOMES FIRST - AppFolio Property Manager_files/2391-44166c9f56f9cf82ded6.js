"use strict";
(self["webpackChunktportal_assets"] = self["webpackChunktportal_assets"] || []).push([[2391],{

/***/ 9771:
/***/ (function(module) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var __DEV__ = "production" !== 'production';

var warning = function() {};

if (__DEV__) {
  var printWarning = function printWarning(format, args) {
    var len = arguments.length;
    args = new Array(len > 1 ? len - 1 : 0);
    for (var key = 1; key < len; key++) {
      args[key - 1] = arguments[key];
    }
    var argIndex = 0;
    var message = 'Warning: ' +
      format.replace(/%s/g, function() {
        return args[argIndex++];
      });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  }

  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
          '`warning(condition, format, ...args)` requires a warning ' +
          'message argument'
      );
    }
    if (!condition) {
      printWarning.apply(null, [format].concat(args));
    }
  };
}

module.exports = warning;


/***/ }),

/***/ 22991:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Dropdown_DropdownItem; }
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(5556);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(32485);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/DropdownContext.js
var DropdownContext = __webpack_require__(59405);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/utils.js
var utils = __webpack_require__(77804);
;// ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/DropdownItem.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["className", "cssModule", "divider", "tag", "header", "active", "text"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var propTypes = {
  children: (prop_types_default()).node,
  active: (prop_types_default()).bool,
  disabled: (prop_types_default()).bool,
  divider: (prop_types_default()).bool,
  tag: utils.tagPropType,
  header: (prop_types_default()).bool,
  onClick: (prop_types_default()).func,
  className: (prop_types_default()).string,
  cssModule: (prop_types_default()).object,
  toggle: (prop_types_default()).bool,
  text: (prop_types_default()).bool
};
var DropdownItem = /*#__PURE__*/function (_React$Component) {
  _inherits(DropdownItem, _React$Component);
  var _super = _createSuper(DropdownItem);
  function DropdownItem(props) {
    var _this;
    _classCallCheck(this, DropdownItem);
    _this = _super.call(this, props);
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    _this.getTabIndex = _this.getTabIndex.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(DropdownItem, [{
    key: "onClick",
    value: function onClick(e) {
      var _this$props$toggle;
      var _this$props = this.props,
        disabled = _this$props.disabled,
        header = _this$props.header,
        divider = _this$props.divider,
        text = _this$props.text;
      if (disabled || header || divider || text) {
        e.preventDefault();
        return;
      }
      if (this.props.onClick) {
        this.props.onClick(e);
      }
      if ((_this$props$toggle = this.props.toggle) !== null && _this$props$toggle !== void 0 ? _this$props$toggle : true) {
        this.context.toggle(e);
      }
    }
  }, {
    key: "getRole",
    value: function getRole() {
      if (this.context.menuRole === 'listbox') {
        return 'option';
      }
      return 'menuitem';
    }
  }, {
    key: "getTabIndex",
    value: function getTabIndex() {
      var _this$props2 = this.props,
        disabled = _this$props2.disabled,
        header = _this$props2.header,
        divider = _this$props2.divider,
        text = _this$props2.text;
      if (disabled || header || divider || text) {
        return '-1';
      }
      return '0';
    }
  }, {
    key: "render",
    value: function render() {
      var tabIndex = this.getTabIndex();
      var role = tabIndex > -1 ? this.getRole() : undefined;
      var _omit = (0,utils.omit)(this.props, ['toggle']),
        className = _omit.className,
        cssModule = _omit.cssModule,
        divider = _omit.divider,
        _omit$tag = _omit.tag,
        Tag = _omit$tag === void 0 ? 'button' : _omit$tag,
        header = _omit.header,
        active = _omit.active,
        text = _omit.text,
        props = _objectWithoutProperties(_omit, _excluded);
      var classes = (0,utils.mapToCssModules)(classnames_default()(className, {
        disabled: props.disabled,
        'dropdown-item': !divider && !header && !text,
        active: active,
        'dropdown-header': header,
        'dropdown-divider': divider,
        'dropdown-item-text': text
      }), cssModule);
      if (Tag === 'button') {
        if (header) {
          Tag = 'h6';
        } else if (divider) {
          Tag = 'div';
        } else if (props.href) {
          Tag = 'a';
        } else if (text) {
          Tag = 'span';
        }
      }
      return /*#__PURE__*/react.createElement(Tag, _extends({
        type: Tag === 'button' && (props.onClick || this.props.toggle) ? 'button' : undefined
      }, props, {
        tabIndex: tabIndex,
        role: role,
        className: classes,
        onClick: this.onClick
      }));
    }
  }]);
  return DropdownItem;
}(react.Component);
DropdownItem.propTypes = propTypes;
DropdownItem.contextType = DropdownContext.DropdownContext;
/* harmony default export */ var esm_DropdownItem = (DropdownItem);
;// ./node_modules/@appfolio/react-gears/esm/components/Dropdown/DropdownItem.js

/* harmony default export */ var Dropdown_DropdownItem = (esm_DropdownItem);

/***/ }),

/***/ 38352:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96540);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32485);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _TooltipPopoverWrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64410);
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



var defaultProps = {
  placement: 'right',
  placementPrefix: 'bs-popover',
  trigger: 'click',
  offset: [0, 8]
};
function Popover(props) {
  var arrowClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()('popover-arrow', props.arrowClassName);
  var popperClasses = classnames__WEBPACK_IMPORTED_MODULE_1___default()('popover', 'show', props.popperClassName);
  var classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()('popover-inner', props.innerClassName);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_TooltipPopoverWrapper__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, props, {
    arrowClassName: arrowClasses,
    popperClassName: popperClasses,
    innerClassName: classes
  }));
}
Popover.propTypes = _TooltipPopoverWrapper__WEBPACK_IMPORTED_MODULE_2__.propTypes;
Popover.defaultProps = defaultProps;
/* harmony default export */ __webpack_exports__["default"] = (Popover);

/***/ }),

/***/ 47851:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Dropdown_DropdownMenu; }
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(5556);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(40961);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(32485);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/react-popper/lib/esm/Popper.js
var Popper = __webpack_require__(69703);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/DropdownContext.js
var DropdownContext = __webpack_require__(59405);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/utils.js
var utils = __webpack_require__(77804);
;// ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/DropdownMenu.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["className", "cssModule", "dark", "end", "right", "tag", "flip", "modifiers", "persist", "strategy", "container", "updateOnSelect"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }







var propTypes = {
  tag: utils.tagPropType,
  children: (prop_types_default()).node.isRequired,
  dark: (prop_types_default()).bool,
  end: (prop_types_default()).bool,
  /** Flips the menu to the opposite side if there is not enough space to fit */
  flip: (prop_types_default()).bool,
  modifiers: (prop_types_default()).array,
  className: (prop_types_default()).string,
  cssModule: (prop_types_default()).object,
  style: (prop_types_default()).object,
  persist: (prop_types_default()).bool,
  strategy: (prop_types_default()).string,
  container: utils.targetPropType,
  /** Update popper layout when a click event comes up. This leverages event bubbling. */
  updateOnSelect: (prop_types_default()).bool,
  right: (0,utils.deprecated)((prop_types_default()).bool, 'Please use "end" instead.')
};
var directionPositionMap = {
  up: 'top',
  left: 'left',
  right: 'right',
  start: 'left',
  end: 'right',
  down: 'bottom'
};
var DropdownMenu = /*#__PURE__*/function (_React$Component) {
  _inherits(DropdownMenu, _React$Component);
  var _super = _createSuper(DropdownMenu);
  function DropdownMenu() {
    _classCallCheck(this, DropdownMenu);
    return _super.apply(this, arguments);
  }
  _createClass(DropdownMenu, [{
    key: "getRole",
    value: function getRole() {
      if (this.context.menuRole === 'listbox') {
        return 'listbox';
      }
      return 'menu';
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;
      var _this$props = this.props,
        className = _this$props.className,
        cssModule = _this$props.cssModule,
        dark = _this$props.dark,
        end = _this$props.end,
        right = _this$props.right,
        _this$props$tag = _this$props.tag,
        tag = _this$props$tag === void 0 ? 'div' : _this$props$tag,
        _this$props$flip = _this$props.flip,
        flip = _this$props$flip === void 0 ? true : _this$props$flip,
        _this$props$modifiers = _this$props.modifiers,
        modifiers = _this$props$modifiers === void 0 ? [] : _this$props$modifiers,
        persist = _this$props.persist,
        strategy = _this$props.strategy,
        container = _this$props.container,
        updateOnSelect = _this$props.updateOnSelect,
        attrs = _objectWithoutProperties(_this$props, _excluded);
      var classes = (0,utils.mapToCssModules)(classnames_default()(className, 'dropdown-menu', {
        'dropdown-menu-dark': dark,
        'dropdown-menu-end': end || right,
        show: this.context.isOpen
      }), cssModule);
      var Tag = tag;
      if (persist || this.context.isOpen && !this.context.inNavbar) {
        var position1 = directionPositionMap[this.context.direction] || 'bottom';
        var position2 = end || right ? 'end' : 'start';
        var poperPlacement = "".concat(position1, "-").concat(position2);
        var poperModifiers = [].concat(_toConsumableArray(modifiers), [{
          name: 'flip',
          enabled: !!flip
        }]);
        var persistStyles = {};
        if (persist) {
          persistStyles.display = 'block';
          persistStyles.visibility = this.context.isOpen ? 'visible' : 'hidden';
        }
        var popper = /*#__PURE__*/react.createElement(Popper.Popper, {
          placement: poperPlacement,
          modifiers: poperModifiers,
          strategy: strategy
        }, function (_ref) {
          var ref = _ref.ref,
            style = _ref.style,
            placement = _ref.placement,
            update = _ref.update;
          var combinedStyle = _objectSpread(_objectSpread(_objectSpread({}, _this.props.style), persistStyles), style);
          var handleRef = function handleRef(tagRef) {
            // Send the ref to `react-popper`
            ref(tagRef);
            // Send the ref to the parent Dropdown so that clicks outside
            // it will cause it to close
            var onMenuRef = _this.context.onMenuRef;
            if (onMenuRef) onMenuRef(tagRef);
          };
          return /*#__PURE__*/react.createElement(Tag, _extends({
            tabIndex: "-1",
            role: _this.getRole(),
            ref: handleRef
          }, attrs, {
            style: combinedStyle,
            "aria-hidden": !_this.context.isOpen,
            className: classes,
            "data-popper-placement": placement,
            onClick: function onClick() {
              return updateOnSelect && update();
            }
          }));
        });
        if (container) {
          return /*#__PURE__*/react_dom.createPortal(popper, (0,utils.getTarget)(container));
        }
        return popper;
      }
      var onMenuRef = this.context.onMenuRef;
      return /*#__PURE__*/react.createElement(Tag, _extends({
        tabIndex: "-1",
        role: this.getRole()
      }, attrs, {
        ref: onMenuRef,
        "aria-hidden": !this.context.isOpen,
        className: classes,
        "data-popper-placement": attrs.placement,
        "data-bs-popper": "static"
      }));
    }
  }]);
  return DropdownMenu;
}(react.Component);
DropdownMenu.propTypes = propTypes;
DropdownMenu.contextType = DropdownContext.DropdownContext;
/* harmony default export */ var esm_DropdownMenu = (DropdownMenu);
;// ./node_modules/@appfolio/react-gears/esm/components/Dropdown/DropdownMenu.js

/* harmony default export */ var Dropdown_DropdownMenu = (esm_DropdownMenu);

/***/ }),

/***/ 72654:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Dropdown_DropdownToggle; }
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(5556);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(32485);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/warning/warning.js
var warning = __webpack_require__(9771);
var warning_default = /*#__PURE__*/__webpack_require__.n(warning);
// EXTERNAL MODULE: ./node_modules/react-popper/lib/esm/Manager.js
var Manager = __webpack_require__(16802);
// EXTERNAL MODULE: ./node_modules/react-popper/lib/esm/utils.js
var utils = __webpack_require__(13316);
;// ./node_modules/react-popper/lib/esm/Reference.js




function Reference(_ref) {
  var children = _ref.children,
      innerRef = _ref.innerRef;
  var setReferenceNode = react.useContext(Manager.ManagerReferenceNodeSetterContext);
  var refHandler = react.useCallback(function (node) {
    (0,utils.setRef)(innerRef, node);
    (0,utils.safeInvoke)(setReferenceNode, node);
  }, [innerRef, setReferenceNode]); // ran on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps

  react.useEffect(function () {
    return function () {
      return (0,utils.setRef)(innerRef, null);
    };
  }, []);
  react.useEffect(function () {
    warning_default()(Boolean(setReferenceNode), '`Reference` should not be used outside of a `Manager` component.');
  }, [setReferenceNode]);
  return (0,utils.unwrapArray)(children)({
    ref: refHandler
  });
}
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/DropdownContext.js
var DropdownContext = __webpack_require__(59405);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/utils.js
var esm_utils = __webpack_require__(77804);
// EXTERNAL MODULE: ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/Button.js + 1 modules
var Button = __webpack_require__(11462);
;// ./node_modules/@appfolio/react-gears/node_modules/reactstrap/esm/DropdownToggle.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _excluded = ["className", "color", "cssModule", "caret", "split", "nav", "tag", "innerRef"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }







var propTypes = {
  caret: (prop_types_default()).bool,
  color: (prop_types_default()).string,
  children: (prop_types_default()).node,
  className: (prop_types_default()).string,
  cssModule: (prop_types_default()).object,
  disabled: (prop_types_default()).bool,
  onClick: (prop_types_default()).func,
  'aria-haspopup': (prop_types_default()).bool,
  split: (prop_types_default()).bool,
  tag: esm_utils.tagPropType,
  nav: (prop_types_default()).bool,
  innerRef: prop_types_default().oneOfType([(prop_types_default()).object, (prop_types_default()).string, (prop_types_default()).func])
};
var defaultProps = {
  color: 'secondary',
  'aria-haspopup': true
};
var DropdownToggle = /*#__PURE__*/function (_React$Component) {
  _inherits(DropdownToggle, _React$Component);
  var _super = _createSuper(DropdownToggle);
  function DropdownToggle(props) {
    var _this;
    _classCallCheck(this, DropdownToggle);
    _this = _super.call(this, props);
    _this.onClick = _this.onClick.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(DropdownToggle, [{
    key: "onClick",
    value: function onClick(e) {
      if (this.props.disabled || this.context.disabled) {
        e.preventDefault();
        return;
      }
      if (this.props.nav && !this.props.tag) {
        e.preventDefault();
      }
      if (this.props.onClick) {
        this.props.onClick(e);
      }
      this.context.toggle(e);
    }
  }, {
    key: "getRole",
    value: function getRole() {
      return this.context.menuRole || this.props['aria-haspopup'];
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        className = _this$props.className,
        color = _this$props.color,
        cssModule = _this$props.cssModule,
        caret = _this$props.caret,
        split = _this$props.split,
        nav = _this$props.nav,
        tag = _this$props.tag,
        innerRef = _this$props.innerRef,
        props = _objectWithoutProperties(_this$props, _excluded);
      var ariaLabel = props['aria-label'] || 'Toggle Dropdown';
      var classes = (0,esm_utils.mapToCssModules)(classnames_default()(className, {
        'dropdown-toggle': caret || split,
        'dropdown-toggle-split': split,
        'nav-link': nav
      }), cssModule);
      var children = typeof props.children !== 'undefined' ? props.children : /*#__PURE__*/react.createElement("span", {
        className: "visually-hidden"
      }, ariaLabel);
      var Tag;
      if (nav && !tag) {
        Tag = 'a';
        props.href = '#';
      } else if (!tag) {
        Tag = Button["default"];
        props.color = color;
        props.cssModule = cssModule;
      } else {
        Tag = tag;
      }

      // extracted the rendering of the Tag component
      var returnFunction = function returnFunction(_ref) {
        var ref = _ref.ref;
        var handleRef = function handleRef(tagRef) {
          ref(tagRef);
          var onToggleRef = _this2.context.onToggleRef;
          if (onToggleRef) onToggleRef(tagRef);
        };
        return /*#__PURE__*/react.createElement(Tag, _extends({}, props, _defineProperty({}, typeof Tag === 'string' ? 'ref' : 'innerRef', handleRef), {
          className: classes,
          onClick: _this2.onClick,
          "aria-expanded": _this2.context.isOpen,
          "aria-haspopup": _this2.getRole(),
          children: children
        }));
      };

      // No Reference component if the component is in Navbar
      if (this.context.inNavbar) {
        return /*#__PURE__*/react.createElement(react.Fragment, null, returnFunction({
          ref: this.context.onToggleRef
        }));
      }

      // Normal rendering if component not in NavBar
      return /*#__PURE__*/react.createElement(Reference, {
        innerRef: innerRef
      }, returnFunction);
    }
  }]);
  return DropdownToggle;
}(react.Component);
DropdownToggle.propTypes = propTypes;
DropdownToggle.defaultProps = defaultProps;
DropdownToggle.contextType = DropdownContext.DropdownContext;
/* harmony default export */ var esm_DropdownToggle = (DropdownToggle);
;// ./node_modules/@appfolio/react-gears/esm/components/Dropdown/DropdownToggle.js

/* harmony default export */ var Dropdown_DropdownToggle = (esm_DropdownToggle);

/***/ })

}]);