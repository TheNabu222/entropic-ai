"use strict";
(self["webpackChunktportal_assets"] = self["webpackChunktportal_assets"] || []).push([[7878],{

/***/ 1960:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var process = __webpack_require__(65606);

Object.defineProperty(exports, "__esModule", ({ value: true }));
var COLORS = {
    green: [32, 39],
    cyan: [36, 39],
    magenta: [35, 39],
    bold: [1, 22]
};
exports["default"] = (function (color, text) {
    if (supportsColor()) {
        var map = COLORS[color];
        return "\u001B[" + map[0] + "m" + text + "\u001B[" + map[1] + "m";
    }
    else {
        return text;
    }
});
var supportsColor = function () {
    if (typeof window === undefined) {
        if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test((process.env.TERM))) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
//# sourceMappingURL=colorize.js.map

/***/ }),

/***/ 2320:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5870);
var attribute_1 = __webpack_require__(46294);
var model_1 = __webpack_require__(63555);
var wasDestroyed = function (model) {
    if (!model.klass.sync)
        return false; // not supported if idmap is off
    return (model.isPersisted || model.stale) && !model.stored;
};
var SingleAssociationBase = /** @class */ (function (_super) {
    tslib_1.__extends(SingleAssociationBase, _super);
    function SingleAssociationBase(options) {
        var _this = _super.call(this, options) || this;
        _this.isRelationship = true;
        if (options.jsonapiType) {
            _this.jsonapiType = options.jsonapiType;
        }
        if (_this.type) {
            _this._klass = _this.type;
        }
        return _this;
    }
    Object.defineProperty(SingleAssociationBase.prototype, "klass", {
        get: function () {
            if (!this._klass) {
                this._klass = modelForType(this, this.jsonapiType);
            }
            return this._klass;
        },
        enumerable: true,
        configurable: true
    });
    SingleAssociationBase.prototype.getter = function (context) {
        var gotten = context.relationships[this.name];
        if (gotten && wasDestroyed(gotten)) {
            delete context.relationships[this.name];
        }
        return context.relationships[this.name];
    };
    SingleAssociationBase.prototype.setter = function (context, val) {
        if (val && !val.hasOwnProperty("isRelationship")) {
            if (!(val instanceof model_1.SpraypaintBase) && !Array.isArray(val)) {
                val = new this.klass(val);
            }
            context.relationships[this.name] = val;
        }
        else if (val === null || val === undefined) {
            context.relationships[this.name] = val;
        }
    };
    return SingleAssociationBase;
}(attribute_1.Attribute));
exports.SingleAssociationBase = SingleAssociationBase;
var HasMany = /** @class */ (function (_super) {
    tslib_1.__extends(HasMany, _super);
    function HasMany(options) {
        var _this = _super.call(this, options) || this;
        _this.isRelationship = true;
        if (options.jsonapiType) {
            _this.jsonapiType = options.jsonapiType;
        }
        if (_this.type) {
            _this._klass = _this.type;
        }
        return _this;
    }
    Object.defineProperty(HasMany.prototype, "klass", {
        get: function () {
            if (!this._klass) {
                this._klass = modelForType(this, this.jsonapiType);
            }
            return this._klass;
        },
        enumerable: true,
        configurable: true
    });
    HasMany.prototype.getter = function (context) {
        var gotten = context.relationships[this.name];
        if (!gotten) {
            this.setter(context, []);
            return context.relationships[this.name];
        }
        var index = gotten.length;
        while (index--) {
            if (wasDestroyed(gotten[index])) {
                var related = context.relationships[this.name];
                gotten.splice(index, 1);
            }
        }
        return context.relationships[this.name];
    };
    HasMany.prototype.setter = function (context, val) {
        if (val && !val.hasOwnProperty("isRelationship")) {
            if (!(val instanceof model_1.SpraypaintBase) && !Array.isArray(val)) {
                val = new this.klass(val);
            }
            context.relationships[this.name] = val;
        }
        else if (val === null || val === undefined) {
            context.relationships[this.name] = val;
        }
    };
    return HasMany;
}(attribute_1.Attribute));
exports.HasMany = HasMany;
var HasOne = /** @class */ (function (_super) {
    tslib_1.__extends(HasOne, _super);
    function HasOne() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HasOne;
}(SingleAssociationBase));
exports.HasOne = HasOne;
var BelongsTo = /** @class */ (function (_super) {
    tslib_1.__extends(BelongsTo, _super);
    function BelongsTo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BelongsTo;
}(SingleAssociationBase));
exports.BelongsTo = BelongsTo;
exports.hasOne = function (options) {
    var opts = extractAssocOpts(options);
    return new HasOne(opts);
};
exports.belongsTo = function (options) {
    var opts = extractAssocOpts(options);
    return new BelongsTo(opts);
};
exports.hasMany = function (options) {
    var opts = extractAssocOpts(options);
    return new HasMany(opts);
};
var extractAssocOpts = function (options) {
    var associationOpts = {};
    if (options !== undefined) {
        if (typeof options === "string") {
            associationOpts = {
                jsonapiType: options
            };
        }
        else {
            associationOpts = {
                persist: options.persist,
                name: options.name
            };
            if (typeof options.type === "string") {
                associationOpts.jsonapiType = options.type;
            }
            else {
                associationOpts.type = options.type;
            }
        }
    }
    return associationOpts;
};
var modelForType = function (association, jsonapiType) {
    var klass = association.owner.typeRegistry.get(jsonapiType);
    if (klass) {
        return klass;
    }
    else {
        throw new Error("Unknown type \"" + jsonapiType + "\"");
    }
};
//# sourceMappingURL=associations.js.map

/***/ }),

/***/ 12918:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var RecordProxy = /** @class */ (function () {
    function RecordProxy(record, raw_json) {
        this._record = record;
        this._raw_json = raw_json;
    }
    Object.defineProperty(RecordProxy.prototype, "raw", {
        get: function () {
            return this._raw_json;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecordProxy.prototype, "data", {
        get: function () {
            return this._record;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecordProxy.prototype, "meta", {
        get: function () {
            return this.raw.meta || {};
        },
        enumerable: true,
        configurable: true
    });
    return RecordProxy;
}());
exports.RecordProxy = RecordProxy;
//# sourceMappingURL=record-proxy.js.map

/***/ }),

/***/ 12922:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var inflected_1 = __webpack_require__(42088);
var model_1 = __webpack_require__(63555);
var attribute_1 = __webpack_require__(46294);
var associations_1 = __webpack_require__(2320);
var env_1 = __webpack_require__(85560);
var logger_1 = __webpack_require__(88068);
function shimDecoratorProposalCompatibility(finisher) {
    return function (descriptor) {
        if (isModernDecoratorDescriptor(descriptor)) {
            return Object.assign(descriptor, {
                finisher: finisher
            });
        }
        else {
            return finisher(descriptor);
        }
    };
}
var isModernDecoratorDescriptor = function (obj) {
    return obj && obj.kind !== undefined;
};
var ModelDecorator = function (config) {
    return shimDecoratorProposalCompatibility(function (target) {
        modelFactory(target, config);
        return target;
    });
};
exports.Model = ModelDecorator;
exports.initModel = function (modelClass, config) {
    modelFactory(modelClass, config);
};
var modelFactory = function (ModelClass, config) {
    ensureModelInheritance(ModelClass);
    model_1.applyModelConfig(ModelClass, config || {});
    if (!ModelClass.jsonapiType && !ModelClass.isBaseClass) {
        ModelClass.jsonapiType = inflected_1.pluralize(inflected_1.underscore(ModelClass.name));
        if (env_1.config.productionTip && env_1.inBrowser) {
            logger_1.logger.warn("Inferring model jsonapiType as \"" + ModelClass.jsonapiType + "\".\nYou should explicitly set this on your model if targeting a minified code bundle.");
        }
    }
    ModelClass.registerType();
};
var AttrDecoratorFactory = function (configOrTarget, propertyKey, attrConfig) {
    var attrDefinition = new attribute_1.Attribute({ name: propertyKey });
    var attrFunction = function (ModelClass, propKey) {
        ensureModelInheritance(ModelClass);
        if (!attrDefinition.name) {
            attrDefinition.name = propKey;
        }
        ModelClass.attributeList[propKey] = attrDefinition;
        attrDefinition.apply(ModelClass);
        return attrDefinition.descriptor();
    };
    if (isModernDecoratorDescriptor(configOrTarget)) {
        return Object.assign(configOrTarget, {
            finisher: function (Model) {
                attrFunction(Model, configOrTarget.key);
            }
        });
    }
    else if (model_1.isModelClass(configOrTarget) || model_1.isModelInstance(configOrTarget)) {
        // For type checking. Can't have a model AND no property key
        if (!propertyKey) {
            throw new Error("Must provide a propertyKey");
        }
        var target = configOrTarget;
        if (model_1.isModelClass(target)) {
            if (attrConfig) {
                attrDefinition = new attribute_1.Attribute(attrConfig);
            }
            attrFunction(target, propertyKey);
        }
        else {
            return attrFunction(target.constructor, propertyKey);
        }
    }
    else {
        if (configOrTarget) {
            attrDefinition = new attribute_1.Attribute(configOrTarget);
        }
        return function (target, propKey) {
            return attrFunction(target.constructor, propKey);
        };
    }
};
exports.Attr = AttrDecoratorFactory;
var LinkDecoratorFactory = function (fieldDetail) {
    var trackLink = function (Model, propKey) {
        ensureModelInheritance(Model);
        Model.linkList.push(propKey);
    };
    if (isModernDecoratorDescriptor(fieldDetail)) {
        return Object.assign(fieldDetail, {
            finisher: function (Model) {
                trackLink(Model, fieldDetail.key);
            }
        });
    }
    else {
        return function (target, propKey) {
            trackLink(target.constructor, propKey);
        };
    }
};
exports.Link = LinkDecoratorFactory;
var ensureModelInheritance = function (ModelClass) {
    if (ModelClass.currentClass !== ModelClass) {
        ModelClass.currentClass.inherited(ModelClass);
    }
};
/*
 * Yup that's a super-Java-y method name.  Decorators in
 * ES7/TS are either of the form:
 *
 * @decorator foo : string
 * or
 * @decorator(options) foo : string
 *
 * The first is a function that directly decorates the
 * property, while this second is a factory function
 * that returns a decorator function.
 *
 * This method builds the factory function for each of our
 * association types.
 *
 * Additionally, users without decorator support can apply these
 * to their ES6-compatible classes directly if they prefer:
 *
 * ``` javascript
 * class Person extends ApplicationRecord {
 *   fullName() { `${this.firstName} ${this.lastName} `}
 * }
 * Attr(Person, 'firstName')
 * Attr(Person, 'lastName')
 * BelongsTo(Person, 'mother', { type: Person })
 * ```
 *
 */
var AssociationDecoratorFactoryBuilder = function (AttrType) {
    var DecoratorFactory = function (targetOrConfig, propertyKey, optsOrType) {
        var extend = function (ModelClass) {
            ensureModelInheritance(ModelClass);
            return ModelClass;
        };
        var opts;
        var factoryFn = function (target, propKey) {
            if (optsOrType === undefined) {
                var inferredType = inflected_1.pluralize(inflected_1.underscore(propKey));
                opts = {
                    jsonapiType: inferredType
                };
            }
            else if (typeof optsOrType === "string") {
                opts = {
                    jsonapiType: optsOrType
                };
            }
            else if (model_1.isModelClass(optsOrType)) {
                opts = {
                    type: optsOrType
                };
            }
            else {
                opts = {
                    persist: optsOrType.persist,
                    name: optsOrType.name
                };
                if (typeof optsOrType.type === "string") {
                    opts.jsonapiType = optsOrType.type;
                }
                else {
                    opts.type = optsOrType.type;
                }
            }
            var attrDefinition = new AttrType(opts);
            if (!attrDefinition.name) {
                attrDefinition.name = propKey;
            }
            var ModelClass = extend(target.constructor);
            ModelClass.attributeList[propKey] = attrDefinition;
            attrDefinition.owner = target.constructor;
            attrDefinition.apply(ModelClass);
            return attrDefinition.descriptor();
        };
        if (isModernDecoratorDescriptor(targetOrConfig)) {
            return Object.assign(targetOrConfig, {
                finisher: function (ModelClass) {
                    factoryFn(ModelClass.prototype, targetOrConfig.key);
                }
            });
        }
        else if (model_1.isModelClass(targetOrConfig) && propertyKey) {
            var target = targetOrConfig;
            factoryFn(target.prototype, propertyKey);
        }
        else {
            var fn = function (targetOrDescriptor, propKey) {
                if (isModernDecoratorDescriptor(targetOrDescriptor)) {
                    return Object.assign(targetOrDescriptor, {
                        finisher: function (ModelClass) {
                            factoryFn(ModelClass.prototype, targetOrDescriptor.key);
                        }
                    });
                }
                else {
                    optsOrType = targetOrConfig;
                    return factoryFn(targetOrDescriptor, propKey);
                }
            };
            return fn;
        }
    };
    return DecoratorFactory;
};
var HasManyDecoratorFactory = AssociationDecoratorFactoryBuilder(associations_1.HasMany);
exports.HasMany = HasManyDecoratorFactory;
var HasOneDecoratorFactory = AssociationDecoratorFactoryBuilder(associations_1.HasOne);
exports.HasOne = HasOneDecoratorFactory;
var BelongsToDecoratorFactory = AssociationDecoratorFactoryBuilder(associations_1.BelongsTo);
exports.BelongsTo = BelongsToDecoratorFactory;
//# sourceMappingURL=decorators.js.map

/***/ }),

/***/ 17345:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.nonenumerable = function (target, key) {
    // first property defined in prototype, that's why we use getters/setters
    // (otherwise assignment in object will override property in prototype)
    Object.defineProperty(target, key, {
        get: function () {
            return undefined;
        },
        set: function (val) {
            // here we have reference to instance and can set property directly to it
            Object.defineProperty(this, key, {
                value: val,
                writable: true,
                configurable: true,
                enumerable: false
            });
        },
        configurable: true,
        enumerable: false
    });
};
//# sourceMappingURL=decorators.js.map

/***/ }),

/***/ 21392:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var parameterize = function (obj, prefix) {
    var str = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value !== undefined && value !== null && value !== "") {
                if (prefix) {
                    key = prefix + "[" + key + "]";
                }
                if (Array.isArray(value)) {
                    value = value.map(function (v) {
                        return maybeEncode(v);
                    });
                    if (value.length > 0) {
                        str.push(key + "=" + value.join(","));
                    }
                }
                else if (typeof value === "object") {
                    str.push(parameterize(value, key));
                }
                else {
                    str.push(key + "=" + maybeEncode(value));
                }
            }
        }
    }
    // remove blanks
    str = str.filter(function (p) {
        return !!p;
    });
    return str.join("&");
};
exports["default"] = parameterize;
// IE does not encode by default like other browsers
var maybeEncode = function (value) {
    var isBrowser = typeof window !== "undefined";
    var isIE = isBrowser && window.navigator.userAgent.match(/(MSIE|Trident)/);
    var isEncoded = typeof value === "string" && value.indexOf("%") !== -1;
    var shouldEncode = isBrowser && isIE && !isEncoded;
    return shouldEncode ? encodeURIComponent(value) : value;
};
//# sourceMappingURL=parameterize.js.map

/***/ }),

/***/ 21862:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5870);
var parameterize_1 = __webpack_require__(21392);
var include_directive_1 = __webpack_require__(83091);
var proxies_1 = __webpack_require__(28461);
var request_1 = __webpack_require__(82183);
var refresh_jwt_1 = __webpack_require__(83132);
var clonedeep_1 = __webpack_require__(97776);
var Scope = /** @class */ (function () {
    function Scope(model) {
        this._associations = {};
        this._pagination = {};
        this._filter = {};
        this._sort = {};
        this._fields = {};
        this._extra_fields = {};
        this._include = {};
        this._stats = {};
        this._extraParams = {};
        this._extraFetchOptions = {};
        this.model = model;
    }
    Scope.prototype.all = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._fetch(this.model.url())];
                    case 1:
                        response = (_a.sent());
                        return [2 /*return*/, this._buildCollectionResult(response)];
                }
            });
        });
    };
    Scope.prototype.find = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var json;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._fetch(this.model.url(id))];
                    case 1:
                        json = (_a.sent());
                        return [2 /*return*/, this._buildRecordResult(json)];
                }
            });
        });
    };
    Scope.prototype.first = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newScope, rawResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newScope = this.per(1);
                        return [4 /*yield*/, newScope._fetch(newScope.model.url())];
                    case 1:
                        rawResult = (_a.sent());
                        return [2 /*return*/, this._buildRecordResult(rawResult)];
                }
            });
        });
    };
    Scope.prototype.merge = function (obj) {
        var _this = this;
        var copy = this.copy();
        Object.keys(obj).forEach(function (k) {
            var serverCasedKey = _this.model.serializeKey(k);
            copy._associations[serverCasedKey] = obj[k];
        });
        return copy;
    };
    Scope.prototype.page = function (pageNumber) {
        var copy = this.copy();
        copy._pagination.number = pageNumber;
        return copy;
    };
    Scope.prototype.per = function (size) {
        var copy = this.copy();
        copy._pagination.size = size;
        return copy;
    };
    Scope.prototype.where = function (clause) {
        var copy = this.copy();
        clause = this._serverCasedWhereClause(clause);
        for (var key in clause) {
            if (clause.hasOwnProperty(key)) {
                copy._filter[key] = clause[key];
            }
        }
        return copy;
    };
    Scope.prototype.extraParams = function (clause) {
        var copy = this.copy();
        for (var key in clause) {
            if (clause.hasOwnProperty(key)) {
                copy._extraParams[key] = clause[key];
            }
        }
        return copy;
    };
    Scope.prototype.stats = function (clause) {
        var copy = this.copy();
        clause = this._serverCasedStatsClause(clause);
        for (var key in clause) {
            if (clause.hasOwnProperty(key)) {
                copy._stats[key] = clause[key];
            }
        }
        return copy;
    };
    Scope.prototype.order = function (clause) {
        var copy = this.copy();
        clause = this._serverCasedOrderClause(clause);
        if (typeof clause === "object") {
            for (var key in clause) {
                if (clause.hasOwnProperty(key)) {
                    copy._sort[key] = clause[key];
                }
            }
        }
        else {
            copy._sort[clause] = "asc";
        }
        return copy;
    };
    Scope.prototype.select = function (clause) {
        var copy = this.copy();
        clause = this._serverCasedFieldsClause(clause);
        if (Array.isArray(clause)) {
            var _clause = clause;
            var jsonapiType = this.model.jsonapiType;
            copy._fields[jsonapiType] = _clause;
        }
        else {
            for (var key in clause) {
                if (clause.hasOwnProperty(key)) {
                    copy._fields[key] = clause[key];
                }
            }
        }
        return copy;
    };
    Scope.prototype.selectExtra = function (clause) {
        var copy = this.copy();
        clause = this._serverCasedFieldsClause(clause);
        if (Array.isArray(clause)) {
            var _clause = clause;
            var jsonapiType = this.model.jsonapiType;
            copy._extra_fields[jsonapiType] = _clause;
        }
        else {
            for (var key in clause) {
                if (clause.hasOwnProperty(key)) {
                    copy._extra_fields[key] = clause[key];
                }
            }
        }
        return copy;
    };
    Scope.prototype.includes = function (clause) {
        var copy = this.copy();
        clause = this._serverCasedIncludesClause(clause);
        var directive = new include_directive_1.IncludeDirective(clause);
        var directiveObject = directive.toScopeObject();
        for (var key in directiveObject) {
            if (directiveObject.hasOwnProperty(key)) {
                copy._include[key] = directiveObject[key];
            }
        }
        return copy;
    };
    Scope.prototype.extraFetchOptions = function (options) {
        var copy = this.copy();
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                copy._extraFetchOptions[key] = options[key];
            }
        }
        return copy;
    };
    // The `Model` class has a `scope()` method to return the scope for it.
    // This method makes it possible for methods to expect either a model or
    // a scope and reliably cast them to a scope for use via `scope()`
    Scope.prototype.scope = function () {
        return this;
    };
    Scope.prototype.asQueryParams = function () {
        var _this = this;
        var qp = {
            page: this._pagination,
            filter: this._filter,
            sort: this._sortParam(this._sort) || [],
            fields: this._fields,
            extra_fields: this._extra_fields,
            stats: this._stats,
            include: new include_directive_1.IncludeDirective(this._include).toString()
        };
        this._mergeAssociationQueryParams(qp, this._associations);
        Object.keys(this._extraParams).forEach(function (k) {
            qp[k] = _this._extraParams[k];
        });
        return qp;
    };
    Scope.prototype.toQueryParams = function () {
        var paramString = parameterize_1.default(this.asQueryParams());
        if (paramString !== "") {
            return paramString;
        }
    };
    Scope.prototype.fetchOptions = function () {
        return tslib_1.__assign({}, this.model.fetchOptions(), this._extraFetchOptions);
    };
    Scope.prototype.copy = function () {
        var newScope = clonedeep_1.cloneDeep(this);
        return newScope;
    };
    // private
    Scope.prototype._mergeAssociationQueryParams = function (queryParams, associations) {
        var _this = this;
        var _loop_1 = function (key) {
            if (associations.hasOwnProperty(key)) {
                var associationScope = associations[key];
                var associationQueryParams = associationScope.asQueryParams();
                queryParams.page[key] = associationQueryParams.page;
                queryParams.filter[key] = associationQueryParams.filter;
                queryParams.stats[key] = associationQueryParams.stats;
                Object.assign(queryParams.fields, associationQueryParams.fields);
                Object.assign(queryParams.extra_fields, associationQueryParams.extra_fields);
                associationQueryParams.sort.forEach(function (s) {
                    var transformed = _this._transformAssociationSortParam(key, s);
                    queryParams.sort.push(transformed);
                });
            }
        };
        for (var key in associations) {
            _loop_1(key);
        }
    };
    Scope.prototype._transformAssociationSortParam = function (associationName, param) {
        if (param.indexOf("-") !== -1) {
            param = param.replace("-", "");
            associationName = "-" + associationName;
        }
        return associationName + "." + param;
    };
    Scope.prototype._sortParam = function (clause) {
        if (clause && Object.keys(clause).length > 0) {
            var params = [];
            for (var key in clause) {
                if (clause.hasOwnProperty(key)) {
                    if (clause[key] !== "asc") {
                        key = "-" + key;
                    }
                    params.push(key);
                }
            }
            return params;
        }
    };
    Scope.prototype._fetch = function (url) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var qp, request, response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qp = this.toQueryParams();
                        if (qp) {
                            url = url + "?" + qp;
                        }
                        request = new request_1.Request(this.model.middlewareStack, this.model.logger);
                        return [4 /*yield*/, request.get(url, this.fetchOptions())];
                    case 1:
                        response = _a.sent();
                        refresh_jwt_1.refreshJWT(this.model, response);
                        return [2 /*return*/, response.jsonPayload];
                }
            });
        });
    };
    Scope.prototype._buildRecordResult = function (jsonResult) {
        var record;
        var rawRecord;
        if (jsonResult.data instanceof Array) {
            rawRecord = jsonResult.data[0];
            if (!rawRecord) {
                return new proxies_1.NullProxy(jsonResult);
            }
        }
        else {
            rawRecord = jsonResult.data;
        }
        record = this.model.fromJsonapi(rawRecord, jsonResult);
        return new proxies_1.RecordProxy(record, jsonResult);
    };
    Scope.prototype._buildCollectionResult = function (jsonResult) {
        var _this = this;
        var recordArray = [];
        jsonResult.data.forEach(function (record) {
            recordArray.push(_this.model.fromJsonapi(record, jsonResult));
        });
        return new proxies_1.CollectionProxy(recordArray, jsonResult);
    };
    Scope.prototype._serverCasedWhereClause = function (clause) {
        return this._serverCasedClause(clause, false);
    };
    Scope.prototype._serverCasedOrderClause = function (clause) {
        if (typeof clause === "string") {
            return this._serverCasedClause(clause, true);
        }
        else {
            return this._serverCasedClause(clause, false);
        }
    };
    Scope.prototype._serverCasedFieldsClause = function (clause) {
        return this._serverCasedClause(clause, true);
    };
    Scope.prototype._serverCasedIncludesClause = function (clause) {
        return this._serverCasedClause(clause, true);
    };
    Scope.prototype._serverCasedStatsClause = function (clause) {
        return this._serverCasedClause(clause, true);
    };
    Scope.prototype._serverCasedClause = function (thing, transformValues) {
        var _this = this;
        if (transformValues === void 0) { transformValues = false; }
        if (typeof thing === "string") {
            return transformValues ? this.model.serializeKey(thing) : thing;
        }
        else if (thing instanceof Array) {
            return thing.map(function (item) { return _this._serverCasedClause(item, transformValues); });
        }
        else if (thing instanceof Object) {
            var serverCasedThing = {};
            for (var property in thing) {
                if (thing.hasOwnProperty(property)) {
                    var serverCasedProperty = this.model.serializeKey(property);
                    var serverCasedPropertyValue = this._serverCasedClause(thing[property], transformValues);
                    serverCasedThing[serverCasedProperty] = serverCasedPropertyValue;
                }
            }
            return serverCasedThing;
        }
        else {
            return thing;
        }
    };
    return Scope;
}());
exports.Scope = Scope;
//# sourceMappingURL=scope.js.map

/***/ }),

/***/ 28461:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var collection_proxy_1 = __webpack_require__(45444);
exports.CollectionProxy = collection_proxy_1.CollectionProxy;
var record_proxy_1 = __webpack_require__(12918);
exports.RecordProxy = record_proxy_1.RecordProxy;
var null_proxy_1 = __webpack_require__(35805);
exports.NullProxy = null_proxy_1.NullProxy;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 35805:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var NullProxy = /** @class */ (function () {
    function NullProxy(raw_json) {
        this._raw_json = raw_json;
    }
    Object.defineProperty(NullProxy.prototype, "raw", {
        get: function () {
            return this._raw_json;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullProxy.prototype, "data", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NullProxy.prototype, "meta", {
        get: function () {
            return this.raw.meta || {};
        },
        enumerable: true,
        configurable: true
    });
    return NullProxy;
}());
exports.NullProxy = NullProxy;
//# sourceMappingURL=null-proxy.js.map

/***/ }),

/***/ 38129:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5870);
function asyncForEach(array, callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var index;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < array.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, callback(array[index], index, array)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    index += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var MiddlewareStack = /** @class */ (function () {
    function MiddlewareStack(before, after) {
        if (before === void 0) { before = []; }
        if (after === void 0) { after = []; }
        this._beforeFilters = [];
        this._afterFilters = [];
        this._beforeFilters = before;
        this._afterFilters = after;
    }
    Object.defineProperty(MiddlewareStack.prototype, "beforeFilters", {
        get: function () {
            return this._beforeFilters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiddlewareStack.prototype, "afterFilters", {
        get: function () {
            return this._afterFilters;
        },
        enumerable: true,
        configurable: true
    });
    MiddlewareStack.prototype.beforeFetch = function (requestUrl, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, asyncForEach(this._beforeFilters, function (filter) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, filter(requestUrl, options)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MiddlewareStack.prototype.afterFetch = function (response, json) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, asyncForEach(this._afterFilters, function (filter) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, filter(response, json)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MiddlewareStack;
}());
exports.MiddlewareStack = MiddlewareStack;
//# sourceMappingURL=middleware-stack.js.map

/***/ }),

/***/ 44775:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var memo = 0;
var generate = function () {
    memo++;
    return "temp-id-" + memo;
};
exports.generateTempId = generate;
var tempId = {
    generate: generate
};
exports.tempId = tempId;
//# sourceMappingURL=temp-id.js.map

/***/ }),

/***/ 45232:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var deserialize = function (registry, datum, payload) {
    var deserializer = new Deserializer(registry, payload);
    return deserializer.deserialize(datum);
};
exports.deserialize = deserialize;
var deserializeInstance = function (instance, resource, payload, includeDirective) {
    if (includeDirective === void 0) { includeDirective = {}; }
    var deserializer = new Deserializer(instance.klass.typeRegistry, payload);
    return deserializer.deserializeInstance(instance, resource, includeDirective);
};
exports.deserializeInstance = deserializeInstance;
var Deserializer = /** @class */ (function () {
    function Deserializer(registry, payload) {
        this._deserialized = [];
        this._resources = [];
        this.registry = registry;
        this.payload = payload;
        this.addResources(payload.data);
        this.addResources(payload.included);
    }
    Deserializer.prototype.addResources = function (data) {
        if (!data) {
            return;
        }
        if (Array.isArray(data)) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var datum = data_1[_i];
                this._resources.push(datum);
            }
        }
        else {
            this._resources.push(data);
        }
    };
    Deserializer.prototype.instanceFor = function (type) {
        var klass = this.registry.get(type);
        if (!klass) {
            throw new Error("Unknown type \"" + type + "\"");
        }
        return new klass();
    };
    Deserializer.prototype.relationshipInstanceFor = function (datum, records) {
        var record = records.find(function (r) {
            return !!(r.klass.jsonapiType === datum.type &&
                ((r.id && datum.id && r.id === datum.id) ||
                    (r.temp_id && datum["temp-id"] && r.temp_id === datum["temp-id"])));
        });
        if (!record) {
            record = this.instanceFor(datum.type);
        }
        return record;
    };
    // todo null temp id
    Deserializer.prototype.lookupAssociated = function (recordSet, record) {
        return recordSet.find(function (r) {
            return !!(r.klass.jsonapiType === record.klass.jsonapiType &&
                ((r.temp_id && record.temp_id && r.temp_id === record.temp_id) ||
                    (r.id && record.id && r.id === record.id)));
        });
    };
    Deserializer.prototype.pushRelation = function (model, associationName, record) {
        var modelIdx = model;
        var associationRecords = modelIdx[associationName];
        var existingInstance = this.lookupAssociated(associationRecords, record);
        if (!existingInstance) {
            modelIdx[associationName].push(record);
        }
    };
    Deserializer.prototype.deserialize = function (datum) {
        var instance = this.instanceFor(datum.type);
        return this.deserializeInstance(instance, datum, {});
    };
    Deserializer.prototype.deserializeInstance = function (instance, datum, includeDirective) {
        if (includeDirective === void 0) { includeDirective = {}; }
        var existing = this.alreadyDeserialized(datum);
        if (existing) {
            return existing;
        }
        // assign ids
        instance.id = datum.id;
        instance.temp_id = datum["temp-id"];
        // assign attrs
        instance.assignAttributes(datum.attributes);
        // assign links
        instance.assignLinks(datum.links);
        // assign meta
        instance.setMeta(datum.meta, false);
        // so we don't double-process the same thing
        // must push before relationships
        this._deserialized.push(instance);
        this._processRelationships(instance, datum.relationships || {}, includeDirective);
        // remove objects marked for destruction
        this._removeDeletions(instance, includeDirective);
        // came from server, must be persisted
        instance.isPersisted = true;
        instance.reset();
        return instance;
    };
    Deserializer.prototype._removeDeletions = function (model, includeDirective) {
        var _this = this;
        Object.keys(includeDirective).forEach(function (key) {
            var modelIdx = model;
            var relatedObjects = modelIdx[key];
            if (relatedObjects) {
                if (Array.isArray(relatedObjects)) {
                    relatedObjects.forEach(function (relatedObject, index) {
                        if (relatedObject.isMarkedForDestruction) {
                            modelIdx.klass.store.destroy(relatedObject);
                        }
                        else if (relatedObject.isMarkedForDisassociation) {
                            modelIdx[key].splice(index, 1);
                        }
                        else {
                            _this._removeDeletions(relatedObject, includeDirective[key] || {});
                        }
                    });
                }
                else {
                    var relatedObject = relatedObjects;
                    if (relatedObject.isMarkedForDestruction) {
                        modelIdx.klass.store.destroy(relatedObject);
                    }
                    else if (relatedObject.isMarkedForDisassociation) {
                        modelIdx[key] = null;
                    }
                    else {
                        _this._removeDeletions(relatedObject, includeDirective[key] || {});
                    }
                }
            }
        });
    };
    Deserializer.prototype._processRelationships = function (instance, relationships, includeDirective) {
        var _this = this;
        this._iterateValidRelationships(instance, relationships, function (relationName, relationData) {
            var nestedIncludeDirective = includeDirective[relationName];
            var instanceIdx = instance;
            if (Array.isArray(relationData)) {
                for (var _i = 0, relationData_1 = relationData; _i < relationData_1.length; _i++) {
                    var datum = relationData_1[_i];
                    var hydratedDatum = _this.findResource(datum);
                    var associationRecords = instanceIdx[relationName];
                    var relatedInstance = _this.relationshipInstanceFor(hydratedDatum, associationRecords);
                    relatedInstance = _this.deserializeInstance(relatedInstance, hydratedDatum, nestedIncludeDirective);
                    _this.pushRelation(instance, relationName, relatedInstance);
                }
            }
            else {
                var hydratedDatum = _this.findResource(relationData);
                var existing = instanceIdx[relationName];
                var associated = existing || _this.instanceFor(hydratedDatum.type);
                associated = _this.deserializeInstance(associated, hydratedDatum, nestedIncludeDirective);
                if (!existing) {
                    instanceIdx[relationName] = associated;
                }
            }
        });
    };
    Deserializer.prototype._iterateValidRelationships = function (instance, relationships, callback) {
        for (var key in relationships) {
            if (relationships.hasOwnProperty(key)) {
                var relationName = instance.klass.deserializeKey(key);
                if (instance.klass.attributeList[relationName]) {
                    var relationData = relationships[key].data;
                    if (!relationData) {
                        continue;
                    } // only links, empty, etc
                    callback(relationName, relationData);
                }
            }
        }
    };
    Deserializer.prototype.alreadyDeserialized = function (resourceIdentifier) {
        return this._deserialized.find(function (m) {
            return !!(m.klass.jsonapiType === resourceIdentifier.type &&
                ((m.id && resourceIdentifier.id && m.id === resourceIdentifier.id) ||
                    (m.temp_id &&
                        resourceIdentifier.temp_id &&
                        m.temp_id === resourceIdentifier["temp-id"])));
        });
    };
    Deserializer.prototype.findResource = function (resourceIdentifier) {
        var found = this._resources.find(function (r) {
            return !!(r.type === resourceIdentifier.type &&
                ((r.id && resourceIdentifier.id && r.id === resourceIdentifier.id) ||
                    (r["temp-id"] &&
                        resourceIdentifier["temp-id"] &&
                        r["temp-id"] === resourceIdentifier["temp-id"])));
        });
        return found || resourceIdentifier;
    };
    return Deserializer;
}());
//# sourceMappingURL=deserialize.js.map

/***/ }),

/***/ 45444:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var CollectionProxy = /** @class */ (function () {
    function CollectionProxy(collection, raw_json) {
        if (raw_json === void 0) { raw_json = { data: [] }; }
        this._collection = collection;
        this._raw_json = raw_json;
    }
    Object.defineProperty(CollectionProxy.prototype, "raw", {
        get: function () {
            return this._raw_json;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CollectionProxy.prototype, "data", {
        get: function () {
            return this._collection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CollectionProxy.prototype, "meta", {
        get: function () {
            return this.raw.meta || {};
        },
        enumerable: true,
        configurable: true
    });
    return CollectionProxy;
}());
exports.CollectionProxy = CollectionProxy;
//# sourceMappingURL=collection-proxy.js.map

/***/ }),

/***/ 45521:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var ValidationErrorBuilder = /** @class */ (function () {
    function ValidationErrorBuilder(model, payload) {
        this.model = model;
        this.payload = payload;
    }
    ValidationErrorBuilder.apply = function (model, payload) {
        var instance = new ValidationErrorBuilder(model, payload);
        instance.apply();
    };
    ValidationErrorBuilder.prototype.apply = function () {
        var _this = this;
        var errorsAccumulator = {};
        if (!this.payload.errors) {
            return;
        }
        this.payload.errors.forEach(function (err) {
            var meta = err.meta;
            if (!meta) {
                throw new Error("invalid json");
            }
            var metaRelationship = meta.relationship;
            if (metaRelationship) {
                _this._processRelationship(_this.model, metaRelationship, err);
            }
            else {
                _this._processResource(errorsAccumulator, meta, err);
            }
        });
        this.model.errors = errorsAccumulator;
    };
    ValidationErrorBuilder.prototype._processResource = function (errorsAccumulator, meta, error) {
        var attribute = this.model.klass.deserializeKey(meta.attribute);
        errorsAccumulator[attribute] = {
            title: error.title,
            code: error.code,
            attribute: meta.attribute,
            message: meta.message,
            fullMessage: attribute === "base" ? meta.message : error.detail,
            rawPayload: error
        };
    };
    ValidationErrorBuilder.prototype._processRelationship = function (model, meta, err) {
        var relatedObject = model[model.klass.deserializeKey(meta.name)];
        if (Array.isArray(relatedObject)) {
            relatedObject = relatedObject.find(function (r) {
                // For now graphiti is returning the related object id as an integer
                // where the related object's ID is a string
                return ((r.id && String(r.id) === String(meta.id)) ||
                    (r.temp_id && r.temp_id === meta["temp-id"]));
            });
        }
        if (meta.relationship) {
            this._processRelationship(relatedObject, meta.relationship, err);
        }
        else {
            var relatedAccumulator_1 = {};
            this._processResource(relatedAccumulator_1, meta, err);
            // make sure to assign a new error object, instead of mutating
            // the existing one, otherwise js frameworks with object tracking
            // won't be able to keep up. Validate vue.js when changing this code:
            var newErrs_1 = {};
            Object.keys(relatedObject.errors).forEach(function (key) {
                newErrs_1[key] = relatedObject.errors[key];
            });
            Object.keys(relatedAccumulator_1).forEach(function (key) {
                var error = relatedAccumulator_1[key];
                if (error !== undefined) {
                    newErrs_1[key] = error;
                }
            });
            relatedObject.errors = newErrs_1;
        }
    };
    return ValidationErrorBuilder;
}());
exports.ValidationErrorBuilder = ValidationErrorBuilder;
//# sourceMappingURL=validation-error-builder.js.map

/***/ }),

/***/ 46294:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.attr = function (options) {
    if (!options) {
        options = {};
    }
    return new Attribute(options);
};
exports.STRICT_EQUALITY_DIRTY_CHECKER = function (prior, current) { return prior !== current; };
var Attribute = /** @class */ (function () {
    function Attribute(options) {
        this.isRelationship = false;
        this.type = undefined;
        this.persist = true;
        this.dirtyChecker = exports.STRICT_EQUALITY_DIRTY_CHECKER;
        if (!options) {
            return;
        }
        if (options.name) {
            this.name = options.name;
        }
        if (options.type) {
            this.type = options.type;
        }
        if (options.persist !== undefined) {
            this.persist = !!options.persist;
        }
        if (options.dirtyChecker) {
            this.dirtyChecker = options.dirtyChecker;
        }
    }
    Attribute.prototype.apply = function (ModelClass) {
        Object.defineProperty(ModelClass.prototype, this.name, this.descriptor());
    };
    // The model calls this setter
    Attribute.prototype.setter = function (context, val) {
        var privateContext = context;
        privateContext._attributes[this.name] = val;
    };
    // The model calls this getter
    Attribute.prototype.getter = function (context) {
        return context.attributes[this.name];
    };
    // This returns the getters/setters for use on the *model*
    Attribute.prototype.descriptor = function () {
        var attrDef = this;
        return {
            configurable: true,
            enumerable: true,
            get: function () {
                return attrDef.getter(this);
            },
            set: function (value) {
                attrDef.setter(this, value);
            }
        };
    };
    return Attribute;
}());
exports.Attribute = Attribute;
var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;
/*
 *  Function taken from VueJS's props assertion code here:
 *  https://github.com/vuejs/vue/blob/1dd6b6f046c3093950e599ccc6bbe7a393b8a494/src/core/util/props.js
 *
 *  We aren't using this yet, but I don't want to lose the reference
 *  to it so I'm keeping it around.
 *
 */
var assertType = function (value, type) {
    var valid;
    var expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
        var t = typeof value;
        valid = t === expectedType.toLowerCase();
        // for primitive wrapper objects
        if (!valid && t === "object") {
            valid = value instanceof type;
        }
    }
    else if (expectedType === "Object") {
        valid = isPlainObject(value);
    }
    else if (expectedType === "Array") {
        valid = Array.isArray(value);
    }
    else {
        valid = value instanceof type;
    }
    return {
        valid: valid,
        expectedType: expectedType
    };
};
/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
/* tslint:disable-next-line:ban-types */
var getType = function (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : "";
};
var isType = function (type, fn) {
    if (!Array.isArray(fn)) {
        return getType(fn) === getType(type);
    }
    for (var i = 0, len = fn.length; i < len; i++) {
        if (getType(fn[i]) === getType(type)) {
            return true;
        }
    }
    return false;
};
/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var isPlainObject = function (obj) {
    return _toString.call(obj) === "[object Object]";
};
//# sourceMappingURL=attribute.js.map

/***/ }),

/***/ 49412:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// Build a hash like
// {
//   posts: [{id: 1, type: 'posts'}],
//   category: [{id: 1, type: 'categories}]
// }
// Will be array regardless of relationship type
// This will only contain persisted objects
// Used for dirty tracking associations
exports["default"] = (function (model, relationNames) {
    var identifiers = {};
    relationNames.forEach(function (relationName) {
        var relatedObjects = model.relationship(relationName);
        if (relatedObjects) {
            if (!Array.isArray(relatedObjects)) {
                relatedObjects = [relatedObjects];
            }
            relatedObjects.forEach(function (r) {
                if (r.isPersisted) {
                    if (!identifiers[relationName]) {
                        identifiers[relationName] = [];
                    }
                    identifiers[relationName].push(r.resourceIdentifier);
                }
            });
        }
    });
    return identifiers;
});
//# sourceMappingURL=relationship-identifiers.js.map

/***/ }),

/***/ 49477:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var InMemoryStorageBackend = /** @class */ (function () {
    function InMemoryStorageBackend() {
        this._data = {};
    }
    InMemoryStorageBackend.prototype.getItem = function (key) {
        return this._data[key] || null; // Cast undefined to null
    };
    InMemoryStorageBackend.prototype.setItem = function (key, value) {
        this._data[key] = value;
    };
    InMemoryStorageBackend.prototype.removeItem = function (key) {
        delete this._data[key];
    };
    return InMemoryStorageBackend;
}());
exports.InMemoryStorageBackend = InMemoryStorageBackend;
var defaultBackend;
// In case no localStorage available, defauilt to a noop implementation
try {
    defaultBackend = localStorage;
}
catch (e) {
    defaultBackend = new InMemoryStorageBackend();
}
var CredentialStorage = /** @class */ (function () {
    function CredentialStorage(jwtKey, backend) {
        if (backend === void 0) { backend = defaultBackend; }
        this._jwtKey = jwtKey;
        this._backend = backend;
    }
    Object.defineProperty(CredentialStorage.prototype, "backend", {
        get: function () {
            return this._backend;
        },
        enumerable: true,
        configurable: true
    });
    CredentialStorage.prototype.getJWT = function () {
        return this._backend.getItem(this._jwtKey) || undefined;
    };
    CredentialStorage.prototype.setJWT = function (value) {
        if (value) {
            this._backend.setItem(this._jwtKey, value);
        }
        else {
            this._backend.removeItem(this._jwtKey);
        }
    };
    return CredentialStorage;
}());
exports.CredentialStorage = CredentialStorage;
//# sourceMappingURL=credential-storage.js.map

/***/ }),

/***/ 52495:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var include_directive_1 = __webpack_require__(83091);
var temp_id_1 = __webpack_require__(44775);
var WritePayload = /** @class */ (function () {
    function WritePayload(model, relationships, idOnly) {
        if (idOnly === void 0) { idOnly = false; }
        this.included = [];
        this.idOnly = false;
        var includeDirective = new include_directive_1.IncludeDirective(relationships);
        this.includeDirective = includeDirective.toScopeObject();
        this.model = model;
        this.idOnly = idOnly;
        if (!model.klass.jsonapiType) {
            throw new Error("Cannot serialize model: Undefined jsonapiType");
        }
        this.jsonapiType = model.klass.jsonapiType;
    }
    WritePayload.prototype.attributes = function () {
        var _this = this;
        var attrs = {};
        this._eachAttribute(function (key, value, attrDef) {
            if (!_this.model.isPersisted || _this.model.changes()[key]) {
                var writeKey = _this.model.klass.serializeKey(key);
                if (attrDef.type === Number && value === "") {
                    attrs[writeKey] = null;
                }
                else {
                    attrs[writeKey] = value;
                }
            }
        });
        return attrs;
    };
    WritePayload.prototype.removeDeletions = function (model, includeDirective) {
        var _this = this;
        Object.keys(includeDirective).forEach(function (key) {
            var nested = includeDirective[key];
            var modelIdx = model;
            var relatedObjects = modelIdx[key];
            if (relatedObjects) {
                if (Array.isArray(relatedObjects)) {
                    relatedObjects.forEach(function (relatedObject, index) {
                        if (relatedObject.isMarkedForDestruction ||
                            relatedObject.isMarkedForDisassociation) {
                            modelIdx[key].splice(index, 1);
                        }
                        else {
                            _this.removeDeletions(relatedObject, nested);
                        }
                    });
                }
                else {
                    var relatedObject = relatedObjects;
                    if (relatedObject.isMarkedForDestruction ||
                        relatedObject.isMarkedForDisassociation) {
                        modelIdx[key] = null;
                    }
                    else {
                        _this.removeDeletions(relatedObject, nested);
                    }
                }
            }
        });
    };
    WritePayload.prototype.postProcess = function () {
        this.removeDeletions(this.model, this.includeDirective);
        this.model.resetRelationTracking(this.includeDirective);
    };
    WritePayload.prototype.relationships = function () {
        var _this = this;
        var _relationships = {};
        Object.keys(this.includeDirective).forEach(function (key) {
            var nested = _this.includeDirective[key];
            var idOnly = false;
            if (key.indexOf(".") > -1) {
                key = key.split(".")[0];
                idOnly = true;
            }
            var data;
            var relatedModels = _this.model[key];
            if (relatedModels) {
                if (Array.isArray(relatedModels)) {
                    data = [];
                    relatedModels.forEach(function (relatedModel) {
                        if (!_this._isNewAndMarkedForDestruction(relatedModel) &&
                            (idOnly ||
                                _this.model.hasDirtyRelation(key, relatedModel) ||
                                relatedModel.isDirty(nested))) {
                            data.push(_this._processRelatedModel(relatedModel, nested, idOnly));
                        }
                    });
                    if (data.length === 0) {
                        data = null;
                    }
                }
                else {
                    // Either the related model is dirty, or it's a dirty relation
                    // (maybe the "department" is not dirty, but the employee changed departments
                    // or the model is new
                    if (!_this._isNewAndMarkedForDestruction(relatedModels) &&
                        (idOnly ||
                            _this.model.hasDirtyRelation(key, relatedModels) ||
                            relatedModels.isDirty(nested))) {
                        data = _this._processRelatedModel(relatedModels, nested, idOnly);
                    }
                }
                if (data) {
                    _relationships[_this.model.klass.serializeKey(key)] = { data: data };
                }
            }
        });
        return _relationships;
    };
    WritePayload.prototype.asJSON = function () {
        var data = {
            type: this.jsonapiType
        };
        if (this.model.id) {
            data.id = this.model.id;
        }
        if (this.model.temp_id) {
            data["temp-id"] = this.model.temp_id;
        }
        if (!this.idOnly) {
            var _attributes = this.attributes();
            if (Object.keys(_attributes).length > 0) {
                data.attributes = _attributes;
            }
        }
        var relationshipData = this.relationships();
        if (Object.keys(relationshipData).length > 0) {
            data.relationships = relationshipData;
        }
        var json = { data: data };
        if (this.included.length > 0) {
            json.included = this.included;
        }
        var _meta = this.model.meta;
        if (this.model.isMetaDirty && Object.keys(_meta).length > 0) {
            data.meta = _meta;
        }
        return json;
    };
    // private
    WritePayload.prototype._isNewAndMarkedForDestruction = function (model) {
        return !model.isPersisted && model.isMarkedForDestruction;
    };
    WritePayload.prototype._processRelatedModel = function (model, nested, idOnly) {
        var _this = this;
        model.clearErrors();
        if (!model.isPersisted) {
            model.temp_id = temp_id_1.tempId.generate();
        }
        var wp = new WritePayload(model, nested, idOnly);
        var relatedJSON = wp.asJSON().data;
        if (!this._isNewAndMarkedForDestruction(model)) {
            this._pushInclude(relatedJSON);
        }
        wp.included.forEach(function (incl) {
            if (!_this._isNewAndMarkedForDestruction(model)) {
                _this._pushInclude(incl);
            }
        });
        var resourceIdentifier = this._resourceIdentifierFor(model);
        return resourceIdentifier;
    };
    WritePayload.prototype._resourceIdentifierFor = function (model) {
        if (!model.klass.jsonapiType) {
            throw new Error("Cannot serialize model: Undefined jsonapiType for model " + model);
        }
        var identifier = {
            type: model.klass.jsonapiType
        };
        if (model.id) {
            identifier.id = model.id;
        }
        if (model.temp_id) {
            identifier["temp-id"] = model.temp_id;
        }
        var method;
        if (model.isPersisted) {
            if (model.isMarkedForDestruction) {
                method = "destroy";
            }
            else if (model.isMarkedForDisassociation) {
                method = "disassociate";
            }
            else {
                method = "update";
            }
        }
        else {
            method = "create";
        }
        identifier.method = method;
        return identifier;
    };
    WritePayload.prototype._pushInclude = function (include) {
        if (!this._isIncluded(include)) {
            this.included.push(include);
        }
    };
    WritePayload.prototype._isIncluded = function (include) {
        this.included.forEach(function (incl) {
            if (incl.type === include.type) {
                if (incl.id === include.id || incl["temp-id"] === include["temp-id"]) {
                    return true;
                }
            }
        });
        return false;
    };
    WritePayload.prototype._eachAttribute = function (callback) {
        var _this = this;
        var modelAttrs = this.model.typedAttributes;
        Object.keys(modelAttrs).forEach(function (key) {
            var attrDef = _this.model.klass.attributeList[key];
            if (attrDef.persist) {
                var value = modelAttrs[key];
                callback(key, value, attrDef);
            }
        });
    };
    return WritePayload;
}());
exports.WritePayload = WritePayload;
//# sourceMappingURL=write-payload.js.map

/***/ }),

/***/ 60473:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var EventBusAny = __webpack_require__(23110);
var EventBus = EventBusAny;
exports.EventBus = EventBus;
//# sourceMappingURL=event-bus.js.map

/***/ }),

/***/ 63555:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5870);
var validation_error_builder_1 = __webpack_require__(45521);
var refresh_jwt_1 = __webpack_require__(83132);
var relationship_identifiers_1 = __webpack_require__(49412);
var request_1 = __webpack_require__(82183);
var write_payload_1 = __webpack_require__(52495);
var credential_storage_1 = __webpack_require__(49477);
var id_map_1 = __webpack_require__(99034);
var deserialize_1 = __webpack_require__(45232);
var dirty_check_1 = __webpack_require__(87678);
var scope_1 = __webpack_require__(21862);
var jsonapi_type_registry_1 = __webpack_require__(74757);
var inflected_1 = __webpack_require__(42088);
var logger_1 = __webpack_require__(88068);
var middleware_stack_1 = __webpack_require__(38129);
var event_bus_1 = __webpack_require__(60473);
var clonedeep_1 = __webpack_require__(97776);
var decorators_1 = __webpack_require__(17345);
exports.applyModelConfig = function (ModelClass, config) {
    var k;
    config = tslib_1.__assign({}, config); // clone since we're going to mutate it
    // Handle all JWT configuration at once since it's run-order dependent
    // We'll delete each key we encounter then pass the rest off to
    // a loop for assigning other arbitrary options
    if (config.credentialStorageBackend) {
        ModelClass.credentialStorageBackend = config.credentialStorageBackend;
        delete config.jwtStorage;
    }
    if (config.jwtStorage) {
        ModelClass.jwtStorage = config.jwtStorage;
        delete config.jwtStorage;
    }
    if (config.jwt) {
        ModelClass.setJWT(config.jwt);
        delete config.jwt;
    }
    for (k in config) {
        if (config.hasOwnProperty(k)) {
            ModelClass[k] = config[k];
        }
    }
    if (ModelClass.isBaseClass === undefined) {
        ModelClass.setAsBase();
    }
    else if (ModelClass.isBaseClass === true) {
        ModelClass.isBaseClass = false;
    }
};
var SpraypaintBase = /** @class */ (function () {
    function SpraypaintBase(attrs) {
        this.stale = false;
        this.storeKey = "";
        this.relationships = {};
        this._persisted = false;
        this._markedForDestruction = false;
        this._markedForDisassociation = false;
        this._originalRelationships = {};
        this._metaDirty = false;
        this._errors = {};
        this._initializeAttributes();
        this._initializeLinks();
        this.assignAttributes(attrs);
        this._originalAttributes = clonedeep_1.cloneDeep(this._attributes);
        this._originalLinks = clonedeep_1.cloneDeep(this._links);
        this._originalRelationships = this.relationshipResourceIdentifiers(Object.keys(this.relationships));
    }
    Object.defineProperty(SpraypaintBase, "credentialStorage", {
        get: function () {
            return this._credentialStorage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase, "jwtStorage", {
        get: function () {
            return this._jwtStorage;
        },
        set: function (val) {
            if (val !== this._jwtStorage) {
                this._jwtStorage = val;
                this.credentialStorageBackend = this._credentialStorageBackend;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase, "credentialStorageBackend", {
        get: function () {
            return this._credentialStorageBackend;
        },
        set: function (backend) {
            this._credentialStorageBackend = backend;
            this._credentialStorage = new credential_storage_1.CredentialStorage(this.jwtStorage || "jwt", this._credentialStorageBackend);
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.initializeCredentialStorage = function () {
        if (this.jwtStorage && typeof localStorage !== "undefined") {
            this.credentialStorageBackend = localStorage;
        }
        else {
            this.credentialStorageBackend = new credential_storage_1.InMemoryStorageBackend();
        }
    };
    SpraypaintBase.fromJsonapi = function (resource, payload) {
        return deserialize_1.deserialize(this.typeRegistry, resource, payload);
    };
    SpraypaintBase.inherited = function (subclass) {
        subclass.parentClass = this;
        subclass.currentClass = subclass;
        subclass.prototype.klass = subclass;
        subclass.attributeList = clonedeep_1.cloneDeep(subclass.attributeList);
        subclass.linkList = clonedeep_1.cloneDeep(subclass.linkList);
    };
    SpraypaintBase.setAsBase = function () {
        this.isBaseClass = true;
        this.jsonapiType = undefined;
        if (!this.typeRegistry) {
            this.typeRegistry = new jsonapi_type_registry_1.JsonapiTypeRegistry(this);
        }
        if (!this.middlewareStack) {
            this._middlewareStack = new middleware_stack_1.MiddlewareStack();
        }
        if (!this._IDMap) {
            this._IDMap = new id_map_1.IDMap();
        }
    };
    SpraypaintBase.isSubclassOf = function (maybeSuper) {
        var current = this.currentClass;
        while (current) {
            if (current === maybeSuper) {
                return true;
            }
            current = current.parentClass;
        }
        return false;
    };
    Object.defineProperty(SpraypaintBase, "baseClass", {
        get: function () {
            var current = this.currentClass;
            while (current) {
                if (current.isBaseClass) {
                    return current;
                }
                current = current.parentClass;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase, "store", {
        get: function () {
            if (this.baseClass === undefined) {
                throw new Error("No base class for " + this.name);
            }
            return this.baseClass._IDMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase, "typeRegistry", {
        get: function () {
            if (this.baseClass === undefined) {
                throw new Error("No base class for " + this.name);
            }
            return this.baseClass._typeRegistry;
        },
        set: function (registry) {
            if (!this.isBaseClass) {
                throw new Error("Cannot set a registry on a non-base class");
            }
            this._typeRegistry = registry;
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.registerType = function () {
        if (!this.jsonapiType) {
            return;
        }
        var existingType = this.typeRegistry.get(this.jsonapiType);
        if (existingType) {
            // Don't try to register a type of we're looking
            // at a subclass. Otherwise we'll make a register
            // call which will fail in order to get a helpful
            // error message from the registry
            if (this.isSubclassOf(existingType)) {
                return;
            }
        }
        this.typeRegistry.register(this.jsonapiType, this);
    };
    SpraypaintBase.extend = function (options) {
        var Subclass = /** @class */ (function (_super) {
            tslib_1.__extends(Subclass, _super);
            function Subclass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Subclass;
        }((this)));
        this.inherited(Subclass);
        var attrs = {};
        if (options.attrs) {
            for (var key in options.attrs) {
                if (options.attrs.hasOwnProperty(key)) {
                    var attr = options.attrs[key];
                    if (!attr.name) {
                        attr.name = key;
                    }
                    attr.owner = Subclass;
                    attrs[key] = attr;
                }
            }
        }
        Subclass.attributeList = Object.assign({}, Subclass.attributeList, attrs);
        Subclass.linkList = Subclass.linkList.slice();
        exports.applyModelConfig(Subclass, options.static || {});
        Subclass.registerType();
        if (options.methods) {
            for (var methodName in options.methods) {
                if (options.methods.hasOwnProperty(methodName)) {
                    ;
                    Subclass.prototype[methodName] = options.methods[methodName];
                }
            }
        }
        return Subclass;
    };
    SpraypaintBase.prototype._initializeAttributes = function () {
        this._attributes = {};
        this._copyPrototypeDescriptors();
    };
    SpraypaintBase.prototype._initializeLinks = function () {
        this._links = {};
    };
    /*
     * VueJS, along with a few other frameworks rely on objects being "reactive". In practice, this
     * means that when passing an object into an context where you would need change detection, vue
     * will inspect it for any enumerable properties that exist and might be depended on in templates
     * and other functions that will trigger changes.  In the case of vue, it intentionally avoids
     * resolving properties on the prototype chain and instead determines which it should override
     * using `Object.hasOwnProperty()`.  To get proper observability, we need to move all attribute
     * methods plus a few other utility getters to the object itself.
     */
    SpraypaintBase.prototype._copyPrototypeDescriptors = function () {
        var _this = this;
        var attrs = this.klass.attributeList;
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var attr = attrs[key];
                Object.defineProperty(this, key, attr.descriptor());
            }
        }
        ;
        [
            "errors",
            "isPersisted",
            "isMarkedForDestruction",
            "isMarkedForDisassociation"
        ].forEach(function (property) {
            var descriptor = Object.getOwnPropertyDescriptor(SpraypaintBase.prototype, property);
            if (descriptor) {
                Object.defineProperty(_this, property, descriptor);
            }
        });
    };
    SpraypaintBase.prototype.isType = function (jsonapiType) {
        return this.klass.jsonapiType === jsonapiType;
    };
    Object.defineProperty(SpraypaintBase.prototype, "isPersisted", {
        get: function () {
            return this._persisted;
        },
        set: function (val) {
            this._persisted = val;
            if (val)
                this.reset();
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.prototype.onSyncRelationships = function () {
        var _this = this;
        if (this._onSyncRelationships)
            return this._onSyncRelationships;
        this._onSyncRelationships = function (event, relationships) {
            _this.relationships = relationships;
        };
        return this._onSyncRelationships;
    };
    SpraypaintBase.prototype.onStoreChange = function () {
        var _this = this;
        if (this._onStoreChange)
            return this._onStoreChange;
        this._onStoreChange = function (event, attrs) {
            var diff = {};
            // Update all non-dirty attributes
            Object.keys(attrs).forEach(function (k) {
                var self = _this;
                var changes = _this.changes();
                var attrDef = _this.klass.attributeList[k];
                if (attrDef.dirtyChecker(self[k], attrs[k]) && !changes[k]) {
                    diff[k] = [self[k], attrs[k]];
                    self[k] = attrs[k];
                    // ensure this property is not marked as dirty
                    self._originalAttributes[k] = attrs[k];
                }
            });
            // fire afterSync hook if applicable
            var hasDiff = Object.keys(diff).length > 0;
            if (hasDiff && typeof _this.afterSync !== "undefined") {
                _this.afterSync(diff);
            }
        };
        return this._onStoreChange;
    };
    SpraypaintBase.prototype.unlisten = function () {
        var _this = this;
        if (!this.klass.sync)
            return;
        if (this.storeKey) {
            event_bus_1.EventBus.removeEventListener(this.storeKey, this.onStoreChange());
            event_bus_1.EventBus.removeEventListener(this.storeKey + "-sync-relationships", this.onSyncRelationships());
        }
        Object.keys(this.relationships).forEach(function (k) {
            var related = _this.relationships[k];
            if (related) {
                if (Array.isArray(related)) {
                    related.forEach(function (r) { return r.unlisten(); });
                }
                else {
                    related.unlisten();
                }
            }
        });
    };
    SpraypaintBase.prototype.listen = function () {
        if (!this.klass.sync)
            return;
        if (!this._onStoreChange) {
            // not already registered
            event_bus_1.EventBus.addEventListener(this.storeKey, this.onStoreChange());
            event_bus_1.EventBus.addEventListener(this.storeKey + "-sync-relationships", this.onSyncRelationships());
        }
    };
    SpraypaintBase.prototype.syncRelationships = function () {
        event_bus_1.EventBus.dispatch(this.storeKey + "-sync-relationships", {}, this.relationships);
    };
    SpraypaintBase.prototype.reset = function () {
        if (this.klass.sync) {
            this.klass.store.updateOrCreate(this);
            this.listen();
        }
        this._originalAttributes = clonedeep_1.cloneDeep(this._attributes);
        this._originalRelationships = this.relationshipResourceIdentifiers(Object.keys(this.relationships));
    };
    SpraypaintBase.prototype.rollback = function () {
        this._attributes = clonedeep_1.cloneDeep(this._originalAttributes);
    };
    Object.defineProperty(SpraypaintBase.prototype, "isMarkedForDestruction", {
        get: function () {
            return this._markedForDestruction;
        },
        set: function (val) {
            this._markedForDestruction = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase.prototype, "isMarkedForDisassociation", {
        get: function () {
            return this._markedForDisassociation;
        },
        set: function (val) {
            this._markedForDisassociation = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        set: function (attrs) {
            this._attributes = {};
            this.assignAttributes(attrs);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase.prototype, "stored", {
        get: function () {
            return this.klass.store.find(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase.prototype, "typedAttributes", {
        /*
         * This is a (hopefully) temporary method for typescript users.
         *
         * Currently the attributes() setter takes an arbitrary hash which
         * may or may not include valid attributes. In non-strict mode, it
         * silently drops those that it doesn't know. This is all perfectly fine
         * from a functionality point, but it means we can't correctly type
         * the attributes() getter return object, as it must match the setter's
         * type. I propose we change the type definition to require sending
         * abitrary hashes through the assignAttributes() method instead.
         */
        get: function () {
            return this._attributes;
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.prototype.relationship = function (name) {
        return this.relationships[name];
    };
    SpraypaintBase.prototype.assignAttributes = function (attrs) {
        if (!attrs) {
            return;
        }
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var attributeName = key;
                attributeName = this.klass.deserializeKey(key);
                if (key === "id" || this.klass.attributeList[attributeName]) {
                    ;
                    this[attributeName] = attrs[key];
                }
                else if (this.klass.strictAttributes) {
                    throw new Error("Unknown attribute: " + key);
                }
            }
        }
    };
    SpraypaintBase.prototype.setMeta = function (metaObj, markDirty) {
        if (markDirty === void 0) { markDirty = true; }
        this.__meta__ = metaObj;
        if (markDirty) {
            this._metaDirty = true;
        }
    };
    Object.defineProperty(SpraypaintBase.prototype, "meta", {
        get: function () {
            return this.__meta__ || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase.prototype, "isMetaDirty", {
        get: function () {
            return this._metaDirty;
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.prototype.relationshipResourceIdentifiers = function (relationNames) {
        return relationship_identifiers_1.default(this, relationNames);
    };
    SpraypaintBase.prototype.fromJsonapi = function (resource, payload, includeDirective) {
        if (includeDirective === void 0) { includeDirective = {}; }
        return deserialize_1.deserializeInstance(this, resource, payload, includeDirective);
    };
    Object.defineProperty(SpraypaintBase.prototype, "resourceIdentifier", {
        get: function () {
            if (this.klass.jsonapiType === undefined) {
                throw new Error("Cannot build resource identifier for class. No JSONAPI Type specified.");
            }
            return {
                id: this.id,
                type: this.klass.jsonapiType
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase.prototype, "errors", {
        get: function () {
            return this._errors;
        },
        set: function (errs) {
            this._errors = errs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpraypaintBase.prototype, "hasError", {
        get: function () {
            return !!Object.keys(this._errors).length;
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.prototype.clearErrors = function () {
        this.errors = {};
    };
    SpraypaintBase.prototype.isDirty = function (relationships) {
        var dc = new dirty_check_1.default(this);
        return dc.check(relationships);
    };
    SpraypaintBase.prototype.changes = function () {
        var dc = new dirty_check_1.default(this);
        return dc.dirtyAttributes();
    };
    SpraypaintBase.prototype.hasDirtyRelation = function (relationName, relatedModel) {
        var dc = new dirty_check_1.default(this);
        return !this.isPersisted || dc.checkRelation(relationName, relatedModel);
    };
    SpraypaintBase.prototype.dup = function () {
        var attrs = Object.assign({}, this.attributes, this.relationships);
        var cloned = new this.klass(attrs);
        cloned.id = this.id;
        cloned.isPersisted = this.isPersisted;
        cloned.isMarkedForDestruction = this.isMarkedForDestruction;
        cloned.isMarkedForDisassociation = this.isMarkedForDisassociation;
        cloned.errors = Object.assign({}, this.errors);
        cloned.links = Object.assign({}, this.links);
        return cloned;
    };
    /*
     *
     * Model Persistence Methods
     *
     */
    SpraypaintBase.fetchOptions = function () {
        var _a;
        var options = {
            credentials: "same-origin",
            headers: (_a = {
                    Accept: "application/vnd.api+json"
                },
                _a["Content-Type"] = "application/vnd.api+json",
                _a)
        };
        if (this.credentials) {
            options.credentials = this.credentials;
        }
        if (this.clientApplication) {
            options.headers["Client-Application"] = this.clientApplication;
        }
        var jwt = this.getJWT();
        if (jwt) {
            options.headers.Authorization = this.generateAuthHeader(jwt);
        }
        return options;
    };
    SpraypaintBase.url = function (id) {
        var endpoint = this.endpoint || "/" + this.jsonapiType;
        var base = "" + this.fullBasePath() + endpoint;
        if (id) {
            base = base + "/" + id;
        }
        return base;
    };
    SpraypaintBase.fullBasePath = function () {
        return "" + this.baseUrl + this.apiNamespace;
    };
    Object.defineProperty(SpraypaintBase, "middlewareStack", {
        get: function () {
            if (this.baseClass) {
                var stack = this.baseClass._middlewareStack;
                // Normally we want to use the middleware stack defined on the baseClass, but in the event
                // that our subclass has overridden one or the other, we create a middleware stack that
                // replaces the normal filters with the class override.
                if (this.beforeFetch || this.afterFetch) {
                    var before_1 = this.beforeFetch
                        ? [this.beforeFetch]
                        : stack.beforeFilters;
                    var after_1 = this.afterFetch ? [this.afterFetch] : stack.afterFilters;
                    return new middleware_stack_1.MiddlewareStack(before_1, after_1);
                }
                else {
                    return stack;
                }
            }
            else {
                // Shouldn't ever get here, as this should only happen on SpraypaintBase
                return new middleware_stack_1.MiddlewareStack();
            }
        },
        set: function (stack) {
            this._middlewareStack = stack;
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.scope = function () {
        return new scope_1.Scope(this);
    };
    SpraypaintBase.first = function () {
        return this.scope().first();
    };
    SpraypaintBase.all = function () {
        return this.scope().all();
    };
    SpraypaintBase.find = function (id) {
        return this.scope().find(id);
    };
    SpraypaintBase.where = function (clause) {
        return this.scope().where(clause);
    };
    SpraypaintBase.page = function (pageNum) {
        return this.scope().page(pageNum);
    };
    SpraypaintBase.per = function (size) {
        return this.scope().per(size);
    };
    SpraypaintBase.extraParams = function (clause) {
        return this.scope().extraParams(clause);
    };
    SpraypaintBase.extraFetchOptions = function (options) {
        return this.scope().extraFetchOptions(options);
    };
    SpraypaintBase.order = function (clause) {
        return this.scope().order(clause);
    };
    SpraypaintBase.select = function (clause) {
        return this.scope().select(clause);
    };
    SpraypaintBase.selectExtra = function (clause) {
        return this.scope().selectExtra(clause);
    };
    SpraypaintBase.stats = function (clause) {
        return this.scope().stats(clause);
    };
    SpraypaintBase.includes = function (clause) {
        return this.scope().includes(clause);
    };
    SpraypaintBase.merge = function (obj) {
        return this.scope().merge(obj);
    };
    SpraypaintBase.setJWT = function (token) {
        this.credentialStorage.setJWT(token);
    };
    SpraypaintBase.getJWT = function () {
        return this.credentialStorage.getJWT();
    };
    Object.defineProperty(SpraypaintBase, "jwt", {
        get: function () {
            return this.getJWT();
        },
        set: function (token) {
            this.setJWT(token);
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.generateAuthHeader = function (jwt) {
        return "Token token=\"" + jwt + "\"";
    };
    SpraypaintBase.getJWTOwner = function () {
        this.logger.warn("SpraypaintBase#getJWTOwner() is deprecated. Use #baseClass property instead");
        return this.baseClass;
    };
    SpraypaintBase.serializeKey = function (key) {
        switch (this.keyCase.server) {
            case "dash": {
                return inflected_1.dasherize(inflected_1.underscore(key));
            }
            case "snake": {
                return inflected_1.underscore(key);
            }
            case "camel": {
                return inflected_1.camelize(inflected_1.underscore(key), false);
            }
        }
    };
    SpraypaintBase.deserializeKey = function (key) {
        switch (this.keyCase.client) {
            case "dash": {
                return inflected_1.dasherize(inflected_1.underscore(key));
            }
            case "snake": {
                return inflected_1.underscore(key);
            }
            case "camel": {
                return inflected_1.camelize(inflected_1.underscore(key), false);
            }
        }
    };
    SpraypaintBase.prototype.destroy = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, verb, request, response, err_1, base;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.klass.url(this.id);
                        verb = "delete";
                        request = new request_1.Request(this._middleware(), this.klass.logger);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request.delete(url, this._fetchOptions())];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        throw err_1;
                    case 4:
                        if (!(response.status === 202)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._handleAcceptedResponse(response, this.onDeferredDestroy)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        base = this.klass.baseClass;
                        base.store.destroy(this);
                        return [4 /*yield*/, this._handleResponse(response, function () {
                                _this.isPersisted = false;
                            })];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpraypaintBase.prototype.save = function (options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, verb, request, payload, response, scope, json, err_2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.klass.url();
                        verb = "post";
                        request = new request_1.Request(this._middleware(), this.klass.logger, {
                            patchAsPost: this.klass.patchAsPost
                        });
                        payload = new write_payload_1.WritePayload(this, options.with);
                        if (this.isPersisted) {
                            url = this.klass.url(this.id);
                            verb = "patch";
                        }
                        if (options.returnScope) {
                            scope = options.returnScope;
                            if (scope.model !== this.klass) {
                                throw new Error("returnScope must be a scope of type Scope<" + this.klass.name + ">");
                            }
                            url = url + "?" + scope.toQueryParams();
                        }
                        this.clearErrors();
                        json = payload.asJSON();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request[verb](url, json, this._fetchOptions())];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        throw err_2;
                    case 4:
                        if (!(response.status === 202 || response.status === 204)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._handleAcceptedResponse(response, this.onDeferredUpdate)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [4 /*yield*/, this._handleResponse(response, function () {
                            _this.fromJsonapi(response.jsonPayload.data, response.jsonPayload, payload.includeDirective);
                            payload.postProcess();
                        })];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpraypaintBase.prototype._handleAcceptedResponse = function (response, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var responseObject;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (response.jsonPayload && callback) {
                            responseObject = this.klass.fromJsonapi(response.jsonPayload.data, response.jsonPayload);
                            callback(responseObject);
                        }
                        return [4 /*yield*/, this._handleResponse(response, function () { })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SpraypaintBase.prototype._handleResponse = function (response, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                refresh_jwt_1.refreshJWT(this.klass, response);
                if (response.status === 422) {
                    try {
                        validation_error_builder_1.ValidationErrorBuilder.apply(this, response.jsonPayload);
                    }
                    catch (e) {
                        throw new request_1.ResponseError(response, "validation failed", e);
                    }
                    return [2 /*return*/, false];
                }
                else {
                    callback();
                    return [2 /*return*/, true];
                }
                return [2 /*return*/];
            });
        });
    };
    SpraypaintBase.prototype._fetchOptions = function () {
        return this.klass.fetchOptions();
    };
    SpraypaintBase.prototype._middleware = function () {
        return this.klass.middlewareStack;
    };
    // Todo:
    // * needs to recurse the directive
    // * remove the corresponding code from isPersisted and handle here (likely
    // only an issue with test setup)
    // * Make all calls go through resetRelationTracking();
    SpraypaintBase.prototype.resetRelationTracking = function (includeDirective) {
        this._originalRelationships = this.relationshipResourceIdentifiers(Object.keys(includeDirective));
    };
    Object.defineProperty(SpraypaintBase.prototype, "links", {
        get: function () {
            return this._links;
        },
        set: function (links) {
            this._links = {};
            this.assignLinks(links);
        },
        enumerable: true,
        configurable: true
    });
    SpraypaintBase.prototype.assignLinks = function (links) {
        if (!links)
            return;
        for (var key in links) {
            var attributeName = this.klass.deserializeKey(key);
            if (this.klass.linkList.indexOf(attributeName) > -1) {
                this._links[attributeName] = links[key];
            }
        }
    };
    SpraypaintBase.baseUrl = "http://please-set-a-base-url.com";
    SpraypaintBase.apiNamespace = "/";
    SpraypaintBase.keyCase = { server: "snake", client: "camel" };
    SpraypaintBase.strictAttributes = false;
    SpraypaintBase.logger = logger_1.logger;
    SpraypaintBase.sync = false;
    SpraypaintBase.clientApplication = null;
    SpraypaintBase.patchAsPost = false;
    SpraypaintBase.attributeList = {};
    SpraypaintBase.linkList = [];
    SpraypaintBase.currentClass = SpraypaintBase;
    SpraypaintBase._jwtStorage = "jwt";
    /*
     *
     * This is to allow for sane type checking in collaboration with the
     * isModelClass function exported below.  It is very hard to find out
     * whether something is a class of a certain type or subtype
     * (as opposed to an instance of that class), so we set a magic prop on
     * this for use around the codebase. For example, if you have a function:
     *
     * ``` typescript
     * function(arg : typeof SpraypaintBase | { foo : string }) {
     *   if(arg.isSpraypaintModel) {
     *     let modelClass : typeof SpraypaintBase = arg
     *   }
     * }
     * ```
     *
     */
    SpraypaintBase.isSpraypaintModel = true;
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "afterSync", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "relationships", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "klass", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_persisted", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_markedForDestruction", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_markedForDisassociation", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_originalRelationships", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_attributes", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_originalAttributes", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_links", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_originalLinks", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "__meta__", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_metaDirty", void 0);
    tslib_1.__decorate([
        decorators_1.nonenumerable
    ], SpraypaintBase.prototype, "_errors", void 0);
    return SpraypaintBase;
}());
exports.SpraypaintBase = SpraypaintBase;
SpraypaintBase.prototype.klass = SpraypaintBase;
SpraypaintBase.initializeCredentialStorage();
exports.isModelClass = function (arg) {
    if (!arg) {
        return false;
    }
    return arg.currentClass && arg.currentClass.isSpraypaintModel;
};
exports.isModelInstance = function (arg) {
    if (!arg) {
        return false;
    }
    return exports.isModelClass(arg.constructor.currentClass);
};
//# sourceMappingURL=model.js.map

/***/ }),

/***/ 74350:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var lodash_1 = __webpack_require__(2543);
exports.isEmpty = lodash_1.isEmpty;
//# sourceMappingURL=isempty.js.map

/***/ }),

/***/ 74757:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var JsonapiTypeRegistry = /** @class */ (function () {
    function JsonapiTypeRegistry(base) {
        this._typeMap = {};
        this._baseClass = base;
    }
    JsonapiTypeRegistry.prototype.register = function (type, model) {
        if (this._typeMap[type]) {
            throw new Error("Type \"" + type + "\" already registered on base class " + this._baseClass);
        }
        this._typeMap[type] = model;
    };
    JsonapiTypeRegistry.prototype.get = function (type) {
        return this._typeMap[type];
    };
    return JsonapiTypeRegistry;
}());
exports.JsonapiTypeRegistry = JsonapiTypeRegistry;
//# sourceMappingURL=jsonapi-type-registry.js.map

/***/ }),

/***/ 82183:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(5870);
var colorize_1 = __webpack_require__(1960);
var Request = /** @class */ (function () {
    function Request(middleware, logger, config) {
        this.middleware = middleware;
        this.logger = logger;
        this.config = Object.assign({ patchAsPost: false }, config);
    }
    Request.prototype.get = function (url, options) {
        options.method = "GET";
        return this._fetchWithLogging(url, options);
    };
    Request.prototype.post = function (url, payload, options) {
        options.method = "POST";
        options.body = JSON.stringify(payload);
        return this._fetchWithLogging(url, options);
    };
    Request.prototype.patch = function (url, payload, options) {
        if (this.config.patchAsPost) {
            options.method = "POST";
            if (!options.headers)
                options.headers = {};
            options.headers["X-HTTP-Method-Override"] = "PATCH";
        }
        else {
            options.method = "PATCH";
        }
        options.body = JSON.stringify(payload);
        return this._fetchWithLogging(url, options);
    };
    Request.prototype.delete = function (url, options) {
        options.method = "DELETE";
        return this._fetchWithLogging(url, options);
    };
    // private
    Request.prototype._logRequest = function (verb, url) {
        this.logger.info(colorize_1.default("cyan", verb + ": ") + colorize_1.default("magenta", url));
    };
    Request.prototype._logResponse = function (responseJSON) {
        this.logger.debug(colorize_1.default("bold", JSON.stringify(responseJSON, null, 4)));
    };
    Request.prototype._fetchWithLogging = function (url, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._logRequest(options.method || "UNDEFINED METHOD", url);
                        return [4 /*yield*/, this._fetch(url, options)];
                    case 1:
                        response = _a.sent();
                        this._logResponse(response.jsonPayload);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Request.prototype._fetch = function (url, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1, response, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.middleware.beforeFetch(url, options)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw new RequestError("beforeFetch failed; review middleware.beforeFetch stack", url, options, e_1);
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fetch(url, options)];
                    case 4:
                        response = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        throw new ResponseError(null, e_2.message, e_2);
                    case 6: return [4 /*yield*/, this._handleResponse(response, options)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Request.prototype._handleResponse = function (response, requestOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var wasDelete, json, e_3, isEmptyResponse, e_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wasDelete = requestOptions.method === "DELETE" &&
                            [204, 200].indexOf(response.status) > -1;
                        if (wasDelete)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, response.clone().json()];
                    case 2:
                        json = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        isEmptyResponse = [202, 204].indexOf(response.status) > -1;
                        if (isEmptyResponse)
                            return [2 /*return*/];
                        throw new ResponseError(response, "invalid json", e_3);
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.middleware.afterFetch(response, json)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_4 = _a.sent();
                        // afterFetch middleware failed
                        throw new ResponseError(response, "afterFetch failed; review middleware.afterFetch stack", e_4);
                    case 7:
                        if (response.status >= 500) {
                            throw new ResponseError(response, "Server Error");
                            // Allow 422 since we specially handle validation errors
                        }
                        else if (response.status !== 422 && json.data === undefined) {
                            if (response.status === 404) {
                                throw new ResponseError(response, "record not found");
                            }
                            else {
                                // Bad JSON, for instance an errors payload
                                throw new ResponseError(response, "invalid json");
                            }
                        }
                        ;
                        response.jsonPayload = json;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Request;
}());
exports.Request = Request;
var RequestError = /** @class */ (function (_super) {
    tslib_1.__extends(RequestError, _super);
    function RequestError(message, url, options, originalError) {
        var _this = _super.call(this, message) || this;
        _this.stack = originalError.stack;
        _this.url = url;
        _this.options = options;
        _this.originalError = originalError;
        return _this;
    }
    return RequestError;
}(Error));
var ResponseError = /** @class */ (function (_super) {
    tslib_1.__extends(ResponseError, _super);
    function ResponseError(response, message, originalError) {
        var _this = _super.call(this, message || "Invalid Response") || this;
        _this.response = response;
        _this.originalError = originalError;
        return _this;
    }
    return ResponseError;
}(Error));
exports.ResponseError = ResponseError;
//# sourceMappingURL=request.js.map

/***/ }),

/***/ 83091:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var IncludeDirective = /** @class */ (function () {
    function IncludeDirective(arg) {
        this.dct = {};
        var includeHash = this._parseIncludeArgs(arg);
        for (var key in includeHash) {
            if (includeHash.hasOwnProperty(key)) {
                this.dct[key] = new IncludeDirective(includeHash[key]);
            }
        }
    }
    IncludeDirective.prototype.toScopeObject = function () {
        var hash = {};
        for (var key in this.dct) {
            if (this.dct.hasOwnProperty(key)) {
                hash[key] = this.dct[key].toScopeObject();
            }
        }
        return hash;
    };
    IncludeDirective.prototype.toString = function () {
        var stringArray = [];
        var _loop_1 = function (key) {
            if (this_1.dct.hasOwnProperty(key)) {
                var stringValue = this_1.dct[key].toString();
                if (stringValue === "") {
                    stringArray.push(key);
                }
                else {
                    var split = stringValue.split(",");
                    split = split.map(function (x) { return key + "." + x; });
                    stringArray.push(split.join(","));
                }
            }
        };
        var this_1 = this;
        for (var key in this.dct) {
            _loop_1(key);
        }
        return stringArray.join(",");
    };
    IncludeDirective.prototype._parseIncludeArgs = function (includeArgs) {
        if (Array.isArray(includeArgs)) {
            return this._parseArray(includeArgs);
        }
        else if (typeof includeArgs === "string") {
            var obj = {};
            obj[includeArgs] = {};
            return obj;
        }
        else if (typeof includeArgs === "object") {
            return this._parseObject(includeArgs);
        }
        else {
            return {};
        }
    };
    IncludeDirective.prototype._parseObject = function (includeObj) {
        var parsed = {};
        for (var key in includeObj) {
            if (includeObj.hasOwnProperty(key)) {
                parsed[key] = this._parseIncludeArgs(includeObj[key]);
            }
        }
        return parsed;
    };
    IncludeDirective.prototype._parseArray = function (includeArray) {
        var parsed = {};
        for (var _i = 0, includeArray_1 = includeArray; _i < includeArray_1.length; _i++) {
            var value = includeArray_1[_i];
            var parsedEl = this._parseIncludeArgs(value);
            for (var key in parsedEl) {
                if (parsedEl.hasOwnProperty(key)) {
                    parsed[key] = parsedEl[key];
                }
            }
        }
        return parsed;
    };
    return IncludeDirective;
}());
exports.IncludeDirective = IncludeDirective;
//# sourceMappingURL=include-directive.js.map

/***/ }),

/***/ 83132:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.refreshJWT = function (klass, serverResponse) {
    var jwt = serverResponse.headers.get("X-JWT");
    if (jwt) {
        klass.setJWT(jwt);
    }
};
//# sourceMappingURL=refresh-jwt.js.map

/***/ }),

/***/ 85560:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.inBrowser = typeof window !== "undefined";
exports.isProd = "production" === "production";
exports.config = {
    productionTip: !exports.isProd
};
//# sourceMappingURL=env.js.map

/***/ }),

/***/ 87678:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var include_directive_1 = __webpack_require__(83091);
var isempty_1 = __webpack_require__(74350);
var DirtyChecker = /** @class */ (function () {
    function DirtyChecker(model) {
        this.model = model;
    }
    // Check if we are switching persisted objects. Either:
    // * adding a new already-persisted object to a hasMany array
    // * switching an existing persisted hasOne/belongsTo object
    DirtyChecker.prototype.checkRelation = function (relationName, relatedModel) {
        var dirty = false;
        if (relatedModel.isPersisted) {
            var identifiers = this.model._originalRelationships[relationName] || [];
            var found = identifiers.find(function (ri) {
                return (JSON.stringify(ri) === JSON.stringify(relatedModel.resourceIdentifier));
            });
            if (!found) {
                dirty = true;
            }
        }
        return dirty;
    };
    // Either:
    // * attributes changed
    // * marked for destruction / disassociation
    // * not persisted (and thus must be send to server)
    // * not itself dirty, but has nested relations that are dirty
    DirtyChecker.prototype.check = function (relationships) {
        if (relationships === void 0) { relationships = {}; }
        var includeDirective = new include_directive_1.IncludeDirective(relationships);
        var includeHash = includeDirective.toScopeObject();
        return (this._hasDirtyAttributes() ||
            this._hasDirtyRelationships(includeHash) ||
            this.model.isMarkedForDestruction ||
            this.model.isMarkedForDisassociation ||
            this._isUnpersisted());
    };
    DirtyChecker.prototype.dirtyAttributes = function () {
        var dirty = {};
        for (var _i = 0, _a = Object.keys(this.model.attributes); _i < _a.length; _i++) {
            var key = _a[_i];
            var prior = this.model._originalAttributes[key];
            var current = this.model.attributes[key];
            var attrDef = this.model.klass.attributeList[key];
            if (!this.model.isPersisted) {
                dirty[key] = [null, current];
            }
            else if (attrDef.dirtyChecker(prior, current)) {
                dirty[key] = [prior, current];
            }
        }
        return dirty;
    };
    // TODO: allow attributes == {} configurable
    DirtyChecker.prototype._isUnpersisted = function () {
        return (!this.model.isPersisted &&
            JSON.stringify(this.model.attributes) !== JSON.stringify({}));
    };
    DirtyChecker.prototype._hasDirtyAttributes = function () {
        return !isempty_1.isEmpty(this.dirtyAttributes());
    };
    DirtyChecker.prototype._hasDirtyRelationships = function (includeHash) {
        var _this = this;
        var dirty = false;
        this._eachRelatedObject(includeHash, function (relationName, relatedObject, nested) {
            if (relatedObject.isDirty(nested)) {
                dirty = true;
            }
            if (_this.checkRelation(relationName, relatedObject)) {
                dirty = true;
            }
        });
        return dirty;
    };
    DirtyChecker.prototype._eachRelatedObject = function (includeHash, callback) {
        var _this = this;
        Object.keys(includeHash).forEach(function (key) {
            var nested = includeHash[key];
            var relatedObjects = _this.model[key];
            if (!Array.isArray(relatedObjects)) {
                relatedObjects = [relatedObjects];
            }
            relatedObjects.forEach(function (relatedObject) {
                if (relatedObject) {
                    callback(key, relatedObject, nested);
                }
            });
        });
    };
    return DirtyChecker;
}());
exports["default"] = DirtyChecker;
//# sourceMappingURL=dirty-check.js.map

/***/ }),

/***/ 87878:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var model_1 = __webpack_require__(63555);
exports.SpraypaintBase = model_1.SpraypaintBase;
var attribute_1 = __webpack_require__(46294);
exports.Attribute = attribute_1.Attribute;
exports.attr = attribute_1.attr;
var associations_1 = __webpack_require__(2320);
exports.hasMany = associations_1.hasMany;
exports.hasOne = associations_1.hasOne;
exports.belongsTo = associations_1.belongsTo;
var decorators_1 = __webpack_require__(12922);
exports.Model = decorators_1.Model;
exports.Attr = decorators_1.Attr;
exports.HasMany = decorators_1.HasMany;
exports.HasOne = decorators_1.HasOne;
exports.BelongsTo = decorators_1.BelongsTo;
exports.Link = decorators_1.Link;
var middleware_stack_1 = __webpack_require__(38129);
exports.MiddlewareStack = middleware_stack_1.MiddlewareStack;
var scope_1 = __webpack_require__(21862);
exports.Scope = scope_1.Scope;
var request_1 = __webpack_require__(82183);
exports.Request = request_1.Request;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 88068:
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/* tslint:disable:no-console */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["debug"] = 1] = "debug";
    LogLevel[LogLevel["info"] = 2] = "info";
    LogLevel[LogLevel["warn"] = 3] = "warn";
    LogLevel[LogLevel["error"] = 4] = "error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LOG_LEVELS = {
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};
var Logger = /** @class */ (function () {
    function Logger(level) {
        if (level === void 0) { level = "warn"; }
        this._level = LogLevel.info;
        if (typeof level === "number") {
            this._level = level;
        }
        else {
            this.level = level;
        }
    }
    Logger.prototype.debug = function (stmt) {
        if (this._level <= LogLevel.debug) {
            console.info(stmt);
        }
    };
    Logger.prototype.info = function (stmt) {
        if (this._level <= LogLevel.info) {
            console.info(stmt);
        }
    };
    Logger.prototype.warn = function (stmt) {
        if (this._level <= LogLevel.warn) {
            console.warn(stmt);
        }
    };
    Logger.prototype.error = function (stmt) {
        if (this._level <= LogLevel.warn) {
            console.error(stmt);
        }
    };
    Object.defineProperty(Logger.prototype, "level", {
        get: function () {
            var key;
            for (key in LogLevel) {
                if (LogLevel.hasOwnProperty(key)) {
                    var val = LogLevel[key];
                    if (val === this._level) {
                        return key;
                    }
                }
            }
            throw new Error("Invalid log level: " + this._level);
        },
        set: function (value) {
            var lvlValue = LogLevel[value];
            if (lvlValue) {
                this._level = lvlValue;
            }
            else {
                throw new Error("Log level must be one of " + Object.keys(LOG_LEVELS).join(", "));
            }
        },
        enumerable: true,
        configurable: true
    });
    return Logger;
}());
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map

/***/ }),

/***/ 97776:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var lodash_1 = __webpack_require__(2543);
exports.cloneDeep = lodash_1.cloneDeep;
//# sourceMappingURL=clonedeep.js.map

/***/ }),

/***/ 99034:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var clonedeep_1 = __webpack_require__(97776);
var event_bus_1 = __webpack_require__(60473);
var IDMap = /** @class */ (function () {
    function IDMap() {
        this.data = {};
    }
    Object.defineProperty(IDMap.prototype, "count", {
        get: function () {
            return Object.keys(this.data).length;
        },
        enumerable: true,
        configurable: true
    });
    IDMap.prototype.find = function (model, key) {
        if (key === void 0) { key = null; }
        if (!key)
            key = model.storeKey;
        return this.data[key];
    };
    IDMap.prototype.findAll = function (models) {
        var _this = this;
        var records = [];
        models.forEach(function (m) {
            var found = _this.find(m);
            if (found) {
                records.push(found);
            }
        });
        return records;
    };
    IDMap.prototype.create = function (model, key) {
        model.storeKey = key;
        model.stale = false;
        this.data[key] = clonedeep_1.cloneDeep(model.attributes);
    };
    IDMap.prototype.updateOrCreate = function (model) {
        if (model.storeKey) {
            this.create(model, model.storeKey);
        }
        else {
            var key = this.keyFor(model);
            this.create(model, key);
        }
        event_bus_1.EventBus.dispatch(model.storeKey, {}, this.data[model.storeKey]);
    };
    IDMap.prototype.destroy = function (model) {
        model.stale = true;
        delete this.data[model.storeKey];
    };
    IDMap.prototype.keyFor = function (model) {
        return model.klass.jsonapiType + "-" + model.id;
    };
    return IDMap;
}());
exports.IDMap = IDMap;
//# sourceMappingURL=id-map.js.map

/***/ })

}]);