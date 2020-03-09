/* Polyfill service v3.52.3
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 *
 * Features requested: Element.prototype.classList,Element.prototype.matches,Promise,Promise.prototype.finally
 *
 * - _DOMTokenList, License: ISC (required by "DOMTokenList", "Element.prototype.classList")
 * - _ESAbstract.ArrayCreate, License: CC0 (required by "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.Call, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "_ESAbstract.ToPropertyKey", "Object.getOwnPropertyDescriptor", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.CreateDataProperty, License: CC0 (required by "_ESAbstract.CreateDataPropertyOrThrow", "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.CreateDataPropertyOrThrow, License: CC0 (required by "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.CreateMethodProperty, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "Object.create", "Object.getOwnPropertyNames", "Object.getOwnPropertyDescriptor", "Object.freeze", "Object.keys", "Object.defineProperties", "Array.prototype.includes", "Array.prototype.indexOf", "Function.prototype.bind", "Object.getPrototypeOf", "_ESAbstract.OrdinaryCreateFromConstructor", "_ESAbstract.Construct", "_ESAbstract.ArraySpeciesCreate")
 * - _ESAbstract.Get, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ArraySpeciesCreate", "Object.defineProperties", "Object.create", "Array.prototype.includes", "Object.getOwnPropertyNames", "Array.prototype.indexOf", "_ESAbstract.OrdinaryToPrimitive", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "_ESAbstract.ToPropertyKey", "Object.getOwnPropertyDescriptor", "_ESAbstract.GetPrototypeFromConstructor", "_ESAbstract.OrdinaryCreateFromConstructor", "_ESAbstract.Construct")
 * - _ESAbstract.HasOwnProperty, License: CC0 (required by "Object.getOwnPropertyDescriptor", "Symbol", "Symbol.toStringTag", "Promise")
 * - _ESAbstract.HasProperty, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "Array.prototype.indexOf", "Object.getOwnPropertyNames")
 * - _ESAbstract.IsArray, License: CC0 (required by "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.IsCallable, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "Function.prototype.bind", "Object.getOwnPropertyDescriptor", "_ESAbstract.GetMethod", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "_ESAbstract.ToPropertyKey", "_ESAbstract.IsConstructor", "_ESAbstract.ArraySpeciesCreate", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.SameValueNonNumber, License: CC0 (required by "_ESAbstract.SameValueZero", "Array.prototype.includes", "Object.getOwnPropertyNames", "Symbol", "Symbol.toStringTag", "Promise")
 * - _ESAbstract.ToBoolean, License: CC0 (required by "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise")
 * - _ESAbstract.ToInteger, License: CC0 (required by "_ESAbstract.ToLength", "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "Array.prototype.includes", "Object.getOwnPropertyNames", "Array.prototype.indexOf")
 * - _ESAbstract.ToLength, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "Array.prototype.includes", "Object.getOwnPropertyNames", "Array.prototype.indexOf")
 * - _ESAbstract.ToObject, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "Object.getOwnPropertyNames", "Object.getOwnPropertyDescriptor", "Object.defineProperties", "Object.create", "Array.prototype.includes", "Array.prototype.indexOf", "_ESAbstract.GetV", "_ESAbstract.GetMethod", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "_ESAbstract.ToPropertyKey", "_ESAbstract.IsConstructor", "_ESAbstract.ArraySpeciesCreate")
 * - _ESAbstract.GetV, License: CC0 (required by "_ESAbstract.GetMethod", "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ToPropertyKey", "Object.getOwnPropertyDescriptor", "_ESAbstract.IsConstructor", "_ESAbstract.ArraySpeciesCreate")
 * - _ESAbstract.GetMethod, License: CC0 (required by "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ToPropertyKey", "Object.getOwnPropertyDescriptor", "_ESAbstract.IsConstructor", "_ESAbstract.ArraySpeciesCreate")
 * - _ESAbstract.Type, License: CC0 (required by "Object.create", "Symbol", "Symbol.toStringTag", "Promise", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToString", "Array.prototype.forEach", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ArraySpeciesCreate", "Object.defineProperties", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.IsConstructor", "_ESAbstract.SameValueZero", "Array.prototype.includes", "Object.getOwnPropertyNames", "_ESAbstract.OrdinaryToPrimitive", "_ESAbstract.GetPrototypeFromConstructor", "_ESAbstract.OrdinaryCreateFromConstructor", "_ESAbstract.Construct")
 * - _ESAbstract.GetPrototypeFromConstructor, License: CC0 (required by "_ESAbstract.OrdinaryCreateFromConstructor", "_ESAbstract.Construct", "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.OrdinaryCreateFromConstructor, License: CC0 (required by "_ESAbstract.Construct", "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.IsConstructor, License: CC0 (required by "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map", "_ESAbstract.Construct")
 * - _ESAbstract.Construct, License: CC0 (required by "_ESAbstract.ArraySpeciesCreate", "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.ArraySpeciesCreate, License: CC0 (required by "Array.prototype.filter", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.map")
 * - _ESAbstract.OrdinaryToPrimitive, License: CC0 (required by "_ESAbstract.ToPrimitive", "_ESAbstract.ToString", "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ToPropertyKey", "Object.getOwnPropertyDescriptor")
 * - _ESAbstract.SameValueZero, License: CC0 (required by "Array.prototype.includes", "Object.getOwnPropertyNames", "Symbol", "Symbol.toStringTag", "Promise")
 * - _ESAbstract.ToPrimitive, License: CC0 (required by "_ESAbstract.ToString", "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "_ESAbstract.ToPropertyKey", "Object.getOwnPropertyDescriptor")
 * - _ESAbstract.ToString, License: CC0 (required by "Array.prototype.forEach", "Symbol", "Symbol.toStringTag", "Promise", "Array.prototype.filter", "Array.prototype.map", "Array.prototype.includes", "Object.getOwnPropertyNames", "Array.prototype.indexOf", "_ESAbstract.ToPropertyKey", "Object.getOwnPropertyDescriptor")
 * - _ESAbstract.ToPropertyKey, License: CC0 (required by "Object.getOwnPropertyDescriptor", "Symbol", "Symbol.toStringTag", "Promise")
 * - Array.prototype.includes, License: MIT (required by "Object.getOwnPropertyNames", "Symbol", "Symbol.toStringTag", "Promise")
 * - DOMTokenList, License: CC0 (required by "Element.prototype.classList")
 * - Element.prototype.classList, License: ISC
 * - Element.prototype.matches, License: CC0
 * - Object.getOwnPropertyDescriptor, License: CC0 (required by "Symbol", "Symbol.toStringTag", "Promise", "Object.defineProperties", "Object.create")
 * - Object.keys, License: MIT (required by "Symbol", "Symbol.toStringTag", "Promise", "Object.getOwnPropertyNames", "Object.defineProperties", "Object.create")
 * - Object.getOwnPropertyNames, License: CC0 (required by "Symbol", "Symbol.toStringTag", "Promise")
 * - Symbol, License: MIT (required by "Symbol.toStringTag", "Promise")
 * - Symbol.toStringTag, License: MIT (required by "Promise")
 * - Promise, License: MIT */

(function(self, undefined) {

if (typeof window !== "undefined") {

// _DOMTokenList
	/*
	Copyright (c) 2016, John Gardner

	Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	*/
	var _DOMTokenList = (function() { // eslint-disable-line no-unused-vars
		var dpSupport = true;
		var defineGetter = function (object, name, fn, configurable) {
			if (Object.defineProperty)
				Object.defineProperty(object, name, {
					configurable: false === dpSupport ? true : !!configurable,
					get: fn
				});

			else object.__defineGetter__(name, fn);
		};

		/** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
		try {
			defineGetter({}, "support");
		}
		catch (e) {
			dpSupport = false;
		}


		var _DOMTokenList = function (el, prop) {
			var that = this;
			var tokens = [];
			var tokenMap = {};
			var length = 0;
			var maxLength = 0;
			var addIndexGetter = function (i) {
				defineGetter(that, i, function () {
					preop();
					return tokens[i];
				}, false);

			};
			var reindex = function () {

				/** Define getter functions for array-like access to the tokenList's contents. */
				if (length >= maxLength)
					for (; maxLength < length; ++maxLength) {
						addIndexGetter(maxLength);
					}
			};

			/** Helper function called at the start of each class method. Internal use only. */
			var preop = function () {
				var error;
				var i;
				var args = arguments;
				var rSpace = /\s+/;

				/** Validate the token/s passed to an instance method, if any. */
				if (args.length)
					for (i = 0; i < args.length; ++i)
						if (rSpace.test(args[i])) {
							error = new SyntaxError('String "' + args[i] + '" ' + "contains" + ' an invalid character');
							error.code = 5;
							error.name = "InvalidCharacterError";
							throw error;
						}


				/** Split the new value apart by whitespace*/
				if (typeof el[prop] === "object") {
					tokens = ("" + el[prop].baseVal).replace(/^\s+|\s+$/g, "").split(rSpace);
				} else {
					tokens = ("" + el[prop]).replace(/^\s+|\s+$/g, "").split(rSpace);
				}

				/** Avoid treating blank strings as single-item token lists */
				if ("" === tokens[0]) tokens = [];

				/** Repopulate the internal token lists */
				tokenMap = {};
				for (i = 0; i < tokens.length; ++i)
					tokenMap[tokens[i]] = true;
				length = tokens.length;
				reindex();
			};

			/** Populate our internal token list if the targeted attribute of the subject element isn't empty. */
			preop();

			/** Return the number of tokens in the underlying string. Read-only. */
			defineGetter(that, "length", function () {
				preop();
				return length;
			});

			/** Override the default toString/toLocaleString methods to return a space-delimited list of tokens when typecast. */
			that.toLocaleString =
				that.toString = function () {
					preop();
					return tokens.join(" ");
				};

			that.item = function (idx) {
				preop();
				return tokens[idx];
			};

			that.contains = function (token) {
				preop();
				return !!tokenMap[token];
			};

			that.add = function () {
				preop.apply(that, args = arguments);

				for (var args, token, i = 0, l = args.length; i < l; ++i) {
					token = args[i];
					if (!tokenMap[token]) {
						tokens.push(token);
						tokenMap[token] = true;
					}
				}

				/** Update the targeted attribute of the attached element if the token list's changed. */
				if (length !== tokens.length) {
					length = tokens.length >>> 0;
					if (typeof el[prop] === "object") {
						el[prop].baseVal = tokens.join(" ");
					} else {
						el[prop] = tokens.join(" ");
					}
					reindex();
				}
			};

			that.remove = function () {
				preop.apply(that, args = arguments);

				/** Build a hash of token names to compare against when recollecting our token list. */
				for (var args, ignore = {}, i = 0, t = []; i < args.length; ++i) {
					ignore[args[i]] = true;
					delete tokenMap[args[i]];
				}

				/** Run through our tokens list and reassign only those that aren't defined in the hash declared above. */
				for (i = 0; i < tokens.length; ++i)
					if (!ignore[tokens[i]]) t.push(tokens[i]);

				tokens = t;
				length = t.length >>> 0;

				/** Update the targeted attribute of the attached element. */
				if (typeof el[prop] === "object") {
					el[prop].baseVal = tokens.join(" ");
				} else {
					el[prop] = tokens.join(" ");
				}
				reindex();
			};

			that.toggle = function (token, force) {
				preop.apply(that, [token]);

				/** Token state's being forced. */
				if (undefined !== force) {
					if (force) {
						that.add(token);
						return true;
					} else {
						that.remove(token);
						return false;
					}
				}

				/** Token already exists in tokenList. Remove it, and return FALSE. */
				if (tokenMap[token]) {
					that.remove(token);
					return false;
				}

				/** Otherwise, add the token and return TRUE. */
				that.add(token);
				return true;
			};

			return that;
		};

		return _DOMTokenList;
	}());

// _ESAbstract.ArrayCreate
// 9.4.2.2. ArrayCreate ( length [ , proto ] )
	function ArrayCreate(length /* [, proto] */) { // eslint-disable-line no-unused-vars
		// 1. Assert: length is an integer Number ≥ 0.
		// 2. If length is -0, set length to +0.
		if (1 / length === -Infinity) {
			length = 0;
		}
		// 3. If length>2^32-1, throw a RangeError exception.
		if (length > (Math.pow(2, 32) - 1)) {
			throw new RangeError('Invalid array length');
		}
		// 4. If proto is not present, set proto to the intrinsic object %ArrayPrototype%.
		// 5. Let A be a newly created Array exotic object.
		var A = [];
		// 6. Set A's essential internal methods except for [[DefineOwnProperty]] to the default ordinary object definitions specified in 9.1.
		// 7. Set A.[[DefineOwnProperty]] as specified in 9.4.2.1.
		// 8. Set A.[[Prototype]] to proto.
		// 9. Set A.[[Extensible]] to true.
		// 10. Perform ! OrdinaryDefineOwnProperty(A, "length", PropertyDescriptor{[[Value]]: length, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: false}).
		A.length = length;
		// 11. Return A.
		return A;
	}

// _ESAbstract.Call
	/* global IsCallable */
// 7.3.12. Call ( F, V [ , argumentsList ] )
	function Call(F, V /* [, argumentsList] */) { // eslint-disable-line no-unused-vars
		// 1. If argumentsList is not present, set argumentsList to a new empty List.
		var argumentsList = arguments.length > 2 ? arguments[2] : [];
		// 2. If IsCallable(F) is false, throw a TypeError exception.
		if (IsCallable(F) === false) {
			throw new TypeError(Object.prototype.toString.call(F) + 'is not a function.');
		}
		// 3. Return ? F.[[Call]](V, argumentsList).
		return F.apply(V, argumentsList);
	}

// _ESAbstract.CreateDataProperty
// 7.3.4. CreateDataProperty ( O, P, V )
// NOTE
// This abstract operation creates a property whose attributes are set to the same defaults used for properties created by the ECMAScript language assignment operator.
// Normally, the property will not already exist. If it does exist and is not configurable or if O is not extensible, [[DefineOwnProperty]] will return false.
	function CreateDataProperty(O, P, V) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(O) is Object.
		// 2. Assert: IsPropertyKey(P) is true.
		// 3. Let newDesc be the PropertyDescriptor{ [[Value]]: V, [[Writable]]: true, [[Enumerable]]: true, [[Configurable]]: true }.
		var newDesc = {
			value: V,
			writable: true,
			enumerable: true,
			configurable: true
		};
		// 4. Return ? O.[[DefineOwnProperty]](P, newDesc).
		try {
			Object.defineProperty(O, P, newDesc);
			return true;
		} catch (e) {
			return false;
		}
	}

// _ESAbstract.CreateDataPropertyOrThrow
	/* global CreateDataProperty */
// 7.3.6. CreateDataPropertyOrThrow ( O, P, V )
	function CreateDataPropertyOrThrow(O, P, V) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(O) is Object.
		// 2. Assert: IsPropertyKey(P) is true.
		// 3. Let success be ? CreateDataProperty(O, P, V).
		var success = CreateDataProperty(O, P, V);
		// 4. If success is false, throw a TypeError exception.
		if (!success) {
			throw new TypeError('Cannot assign value `' + Object.prototype.toString.call(V) + '` to property `' + Object.prototype.toString.call(P) + '` on object `' + Object.prototype.toString.call(O) + '`');
		}
		// 5. Return success.
		return success;
	}

// _ESAbstract.CreateMethodProperty
// 7.3.5. CreateMethodProperty ( O, P, V )
	function CreateMethodProperty(O, P, V) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(O) is Object.
		// 2. Assert: IsPropertyKey(P) is true.
		// 3. Let newDesc be the PropertyDescriptor{[[Value]]: V, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}.
		var newDesc = {
			value: V,
			writable: true,
			enumerable: false,
			configurable: true
		};
		// 4. Return ? O.[[DefineOwnProperty]](P, newDesc).
		Object.defineProperty(O, P, newDesc);
	}

// _ESAbstract.Get
// 7.3.1. Get ( O, P )
	function Get(O, P) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(O) is Object.
		// 2. Assert: IsPropertyKey(P) is true.
		// 3. Return ? O.[[Get]](P, O).
		return O[P];
	}

// _ESAbstract.HasOwnProperty
// 7.3.11 HasOwnProperty (O, P)
	function HasOwnProperty(o, p) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(O) is Object.
		// 2. Assert: IsPropertyKey(P) is true.
		// 3. Let desc be ? O.[[GetOwnProperty]](P).
		// 4. If desc is undefined, return false.
		// 5. Return true.
		// Polyfill.io - As we expect user agents to support ES3 fully we can skip the above steps and use Object.prototype.hasOwnProperty to do them for us.
		return Object.prototype.hasOwnProperty.call(o, p);
	}

// _ESAbstract.HasProperty
// 7.3.10. HasProperty ( O, P )
	function HasProperty(O, P) { // eslint-disable-line no-unused-vars
		// Assert: Type(O) is Object.
		// Assert: IsPropertyKey(P) is true.
		// Return ? O.[[HasProperty]](P).
		return P in O;
	}

// _ESAbstract.IsArray
// 7.2.2. IsArray ( argument )
	function IsArray(argument) { // eslint-disable-line no-unused-vars
		// 1. If Type(argument) is not Object, return false.
		// 2. If argument is an Array exotic object, return true.
		// 3. If argument is a Proxy exotic object, then
		// a. If argument.[[ProxyHandler]] is null, throw a TypeError exception.
		// b. Let target be argument.[[ProxyTarget]].
		// c. Return ? IsArray(target).
		// 4. Return false.

		// Polyfill.io - We can skip all the above steps and check the string returned from Object.prototype.toString().
		return Object.prototype.toString.call(argument) === '[object Array]';
	}

// _ESAbstract.IsCallable
// 7.2.3. IsCallable ( argument )
	function IsCallable(argument) { // eslint-disable-line no-unused-vars
		// 1. If Type(argument) is not Object, return false.
		// 2. If argument has a [[Call]] internal method, return true.
		// 3. Return false.

		// Polyfill.io - Only function objects have a [[Call]] internal method. This means we can simplify this function to check that the argument has a type of function.
		return typeof argument === 'function';
	}

// _ESAbstract.SameValueNonNumber
// 7.2.12. SameValueNonNumber ( x, y )
	function SameValueNonNumber(x, y) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(x) is not Number.
		// 2. Assert: Type(x) is the same as Type(y).
		// 3. If Type(x) is Undefined, return true.
		// 4. If Type(x) is Null, return true.
		// 5. If Type(x) is String, then
		// a. If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices), return true; otherwise, return false.
		// 6. If Type(x) is Boolean, then
		// a. If x and y are both true or both false, return true; otherwise, return false.
		// 7. If Type(x) is Symbol, then
		// a. If x and y are both the same Symbol value, return true; otherwise, return false.
		// 8. If x and y are the same Object value, return true. Otherwise, return false.

		// Polyfill.io - We can skip all above steps because the === operator does it all for us.
		return x === y;
	}

// _ESAbstract.ToBoolean
// 7.1.2. ToBoolean ( argument )
// The abstract operation ToBoolean converts argument to a value of type Boolean according to Table 9:
	/*
	--------------------------------------------------------------------------------------------------------------
	| Argument Type | Result                                                                                     |
	--------------------------------------------------------------------------------------------------------------
	| Undefined     | Return false.                                                                              |
	| Null          | Return false.                                                                              |
	| Boolean       | Return argument.                                                                           |
	| Number        | If argument is +0, -0, or NaN, return false; otherwise return true.                        |
	| String        | If argument is the empty String (its length is zero), return false; otherwise return true. |
	| Symbol        | Return true.                                                                               |
	| Object        | Return true.                                                                               |
	--------------------------------------------------------------------------------------------------------------
	*/
	function ToBoolean(argument) { // eslint-disable-line no-unused-vars
		return Boolean(argument);
	}

// _ESAbstract.ToInteger
// 7.1.4. ToInteger ( argument )
	function ToInteger(argument) { // eslint-disable-line no-unused-vars
		// 1. Let number be ? ToNumber(argument).
		var number = Number(argument);
		// 2. If number is NaN, return +0.
		if (isNaN(number)) {
			return 0;
		}
		// 3. If number is +0, -0, +∞, or -∞, return number.
		if (1/number === Infinity || 1/number === -Infinity || number === Infinity || number === -Infinity) {
			return number;
		}
		// 4. Return the number value that is the same sign as number and whose magnitude is floor(abs(number)).
		return ((number < 0) ? -1 : 1) * Math.floor(Math.abs(number));
	}

// _ESAbstract.ToLength
	/* global ToInteger */
// 7.1.15. ToLength ( argument )
	function ToLength(argument) { // eslint-disable-line no-unused-vars
		// 1. Let len be ? ToInteger(argument).
		var len = ToInteger(argument);
		// 2. If len ≤ +0, return +0.
		if (len <= 0) {
			return 0;
		}
		// 3. Return min(len, 253-1).
		return Math.min(len, Math.pow(2, 53) -1);
	}

// _ESAbstract.ToObject
// 7.1.13 ToObject ( argument )
// The abstract operation ToObject converts argument to a value of type Object according to Table 12:
// Table 12: ToObject Conversions
	/*
	|----------------------------------------------------------------------------------------------------------------------------------------------------|
	| Argument Type | Result                                                                                                                             |
	|----------------------------------------------------------------------------------------------------------------------------------------------------|
	| Undefined     | Throw a TypeError exception.                                                                                                       |
	| Null          | Throw a TypeError exception.                                                                                                       |
	| Boolean       | Return a new Boolean object whose [[BooleanData]] internal slot is set to argument. See 19.3 for a description of Boolean objects. |
	| Number        | Return a new Number object whose [[NumberData]] internal slot is set to argument. See 20.1 for a description of Number objects.    |
	| String        | Return a new String object whose [[StringData]] internal slot is set to argument. See 21.1 for a description of String objects.    |
	| Symbol        | Return a new Symbol object whose [[SymbolData]] internal slot is set to argument. See 19.4 for a description of Symbol objects.    |
	| Object        | Return argument.                                                                                                                   |
	|----------------------------------------------------------------------------------------------------------------------------------------------------|
	*/
	function ToObject(argument) { // eslint-disable-line no-unused-vars
		if (argument === null || argument === undefined) {
			throw TypeError();
		}
		return Object(argument);
	}

// _ESAbstract.GetV
	/* global ToObject */
// 7.3.2 GetV (V, P)
	function GetV(v, p) { // eslint-disable-line no-unused-vars
		// 1. Assert: IsPropertyKey(P) is true.
		// 2. Let O be ? ToObject(V).
		var o = ToObject(v);
		// 3. Return ? O.[[Get]](P, V).
		return o[p];
	}

// _ESAbstract.GetMethod
	/* global GetV, IsCallable */
// 7.3.9. GetMethod ( V, P )
	function GetMethod(V, P) { // eslint-disable-line no-unused-vars
		// 1. Assert: IsPropertyKey(P) is true.
		// 2. Let func be ? GetV(V, P).
		var func = GetV(V, P);
		// 3. If func is either undefined or null, return undefined.
		if (func === null || func === undefined) {
			return undefined;
		}
		// 4. If IsCallable(func) is false, throw a TypeError exception.
		if (IsCallable(func) === false) {
			throw new TypeError('Method not callable: ' + P);
		}
		// 5. Return func.
		return func;
	}

// _ESAbstract.Type
// "Type(x)" is used as shorthand for "the type of x"...
	function Type(x) { // eslint-disable-line no-unused-vars
		switch (typeof x) {
		case 'undefined':
			return 'undefined';
		case 'boolean':
			return 'boolean';
		case 'number':
			return 'number';
		case 'string':
			return 'string';
		case 'symbol':
			return 'symbol';
		default:
			// typeof null is 'object'
			if (x === null) return 'null';
			// Polyfill.io - This is here because a Symbol polyfill will have a typeof `object`.
			if ('Symbol' in self && (x instanceof self.Symbol || x.constructor === self.Symbol)) return 'symbol';
			return 'object';
		}
	}

// _ESAbstract.GetPrototypeFromConstructor
	/* global Get, Type */
// 9.1.14. GetPrototypeFromConstructor ( constructor, intrinsicDefaultProto )
	function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) { // eslint-disable-line no-unused-vars
		// 1. Assert: intrinsicDefaultProto is a String value that is this specification's name of an intrinsic object. The corresponding object must be an intrinsic that is intended to be used as the [[Prototype]] value of an object.
		// 2. Assert: IsCallable(constructor) is true.
		// 3. Let proto be ? Get(constructor, "prototype").
		var proto = Get(constructor, "prototype");
		// 4. If Type(proto) is not Object, then
		if (Type(proto) !== 'object') {
			// a. Let realm be ? GetFunctionRealm(constructor).
			// b. Set proto to realm's intrinsic object named intrinsicDefaultProto.
			proto = intrinsicDefaultProto;
		}
		// 5. Return proto.
		return proto;
	}

// _ESAbstract.OrdinaryCreateFromConstructor
	/* global GetPrototypeFromConstructor */
// 9.1.13. OrdinaryCreateFromConstructor ( constructor, intrinsicDefaultProto [ , internalSlotsList ] )
	function OrdinaryCreateFromConstructor(constructor, intrinsicDefaultProto) { // eslint-disable-line no-unused-vars
		var internalSlotsList = arguments[2] || {};
		// 1. Assert: intrinsicDefaultProto is a String value that is this specification's name of an intrinsic object.
		// The corresponding object must be an intrinsic that is intended to be used as the[[Prototype]] value of an object.

		// 2. Let proto be ? GetPrototypeFromConstructor(constructor, intrinsicDefaultProto).
		var proto = GetPrototypeFromConstructor(constructor, intrinsicDefaultProto);

		// 3. Return ObjectCreate(proto, internalSlotsList).
		// Polyfill.io - We do not pass internalSlotsList to Object.create because Object.create does not use the default ordinary object definitions specified in 9.1.
		var obj = Object.create(proto);
		for (var name in internalSlotsList) {
			if (Object.prototype.hasOwnProperty.call(internalSlotsList, name)) {
				Object.defineProperty(obj, name, {
					configurable: true,
					enumerable: false,
					writable: true,
					value: internalSlotsList[name]
				});
			}
		}
		return obj;
	}

// _ESAbstract.IsConstructor
	/* global Type */
// 7.2.4. IsConstructor ( argument )
	function IsConstructor(argument) { // eslint-disable-line no-unused-vars
		// 1. If Type(argument) is not Object, return false.
		if (Type(argument) !== 'object') {
			return false;
		}
		// 2. If argument has a [[Construct]] internal method, return true.
		// 3. Return false.

		// Polyfill.io - `new argument` is the only way  to truly test if a function is a constructor.
		// We choose to not use`new argument` because the argument could have side effects when called.
		// Instead we check to see if the argument is a function and if it has a prototype.
		// Arrow functions do not have a [[Construct]] internal method, nor do they have a prototype.
		return typeof argument === 'function' && !!argument.prototype;
	}

// _ESAbstract.Construct
	/* global IsConstructor, OrdinaryCreateFromConstructor, Call */
// 7.3.13. Construct ( F [ , argumentsList [ , newTarget ]] )
	function Construct(F /* [ , argumentsList [ , newTarget ]] */) { // eslint-disable-line no-unused-vars
		// 1. If newTarget is not present, set newTarget to F.
		var newTarget = arguments.length > 2 ? arguments[2] : F;

		// 2. If argumentsList is not present, set argumentsList to a new empty List.
		var argumentsList = arguments.length > 1 ? arguments[1] : [];

		// 3. Assert: IsConstructor(F) is true.
		if (!IsConstructor(F)) {
			throw new TypeError('F must be a constructor.');
		}

		// 4. Assert: IsConstructor(newTarget) is true.
		if (!IsConstructor(newTarget)) {
			throw new TypeError('newTarget must be a constructor.');
		}

		// 5. Return ? F.[[Construct]](argumentsList, newTarget).
		// Polyfill.io - If newTarget is the same as F, it is equivalent to new F(...argumentsList).
		if (newTarget === F) {
			return new (Function.prototype.bind.apply(F, [null].concat(argumentsList)))();
		} else {
			// Polyfill.io - This is mimicking section 9.2.2 step 5.a.
			var obj = OrdinaryCreateFromConstructor(newTarget, Object.prototype);
			return Call(F, obj, argumentsList);
		}
	}

// _ESAbstract.ArraySpeciesCreate
	/* global IsArray, ArrayCreate, Get, Type, IsConstructor, Construct */
// 9.4.2.3. ArraySpeciesCreate ( originalArray, length )
	function ArraySpeciesCreate(originalArray, length) { // eslint-disable-line no-unused-vars
		// 1. Assert: length is an integer Number ≥ 0.
		// 2. If length is -0, set length to +0.
		if (length === 0 && 1/length === -Infinity) {
			length = 0;
		}

		// 3. Let isArray be ? IsArray(originalArray).
		var isArray = IsArray(originalArray);

		// 4. If isArray is false, return ? ArrayCreate(length).
		if (isArray === false) {
			return ArrayCreate(length);
		}

		// 5. Let C be ? Get(originalArray, "constructor").
		var C = Get(originalArray, 'constructor');

		// Polyfill.io - We skip this section as not sure how to make a cross-realm normal Array, a same-realm Array.
		// 6. If IsConstructor(C) is true, then
		// if (IsConstructor(C)) {
		// a. Let thisRealm be the current Realm Record.
		// b. Let realmC be ? GetFunctionRealm(C).
		// c. If thisRealm and realmC are not the same Realm Record, then
		// i. If SameValue(C, realmC.[[Intrinsics]].[[%Array%]]) is true, set C to undefined.
		// }
		// 7. If Type(C) is Object, then
		if (Type(C) === 'object') {
			// a. Set C to ? Get(C, @@species).
			C = 'Symbol' in self && 'species' in self.Symbol ? Get(C, self.Symbol.species) : undefined;
			// b. If C is null, set C to undefined.
			if (C === null) {
				C = undefined;
			}
		}
		// 8. If C is undefined, return ? ArrayCreate(length).
		if (C === undefined) {
			return ArrayCreate(length);
		}
		// 9. If IsConstructor(C) is false, throw a TypeError exception.
		if (!IsConstructor(C)) {
			throw new TypeError('C must be a constructor');
		}
		// 10. Return ? Construct(C, « length »).
		return Construct(C, [length]);
	}

// _ESAbstract.OrdinaryToPrimitive
	/* global Get, IsCallable, Call, Type */
// 7.1.1.1. OrdinaryToPrimitive ( O, hint )
	function OrdinaryToPrimitive(O, hint) { // eslint-disable-line no-unused-vars
		// 1. Assert: Type(O) is Object.
		// 2. Assert: Type(hint) is String and its value is either "string" or "number".
		// 3. If hint is "string", then
		if (hint === 'string') {
			// a. Let methodNames be « "toString", "valueOf" ».
			var methodNames = ['toString', 'valueOf'];
			// 4. Else,
		} else {
			// a. Let methodNames be « "valueOf", "toString" ».
			methodNames = ['valueOf', 'toString'];
		}
		// 5. For each name in methodNames in List order, do
		for (var i = 0; i < methodNames.length; ++i) {
			var name = methodNames[i];
			// a. Let method be ? Get(O, name).
			var method = Get(O, name);
			// b. If IsCallable(method) is true, then
			if (IsCallable(method)) {
				// i. Let result be ? Call(method, O).
				var result = Call(method, O);
				// ii. If Type(result) is not Object, return result.
				if (Type(result) !== 'object') {
					return result;
				}
			}
		}
		// 6. Throw a TypeError exception.
		throw new TypeError('Cannot convert to primitive.');
	}

// _ESAbstract.SameValueZero
	/* global Type, SameValueNonNumber */
// 7.2.11. SameValueZero ( x, y )
	function SameValueZero (x, y) { // eslint-disable-line no-unused-vars
		// 1. If Type(x) is different from Type(y), return false.
		if (Type(x) !== Type(y)) {
			return false;
		}
		// 2. If Type(x) is Number, then
		if (Type(x) === 'number') {
			// a. If x is NaN and y is NaN, return true.
			if (isNaN(x) && isNaN(y)) {
				return true;
			}
			// b. If x is +0 and y is -0, return true.
			if (1/x === Infinity && 1/y === -Infinity) {
				return true;
			}
			// c. If x is -0 and y is +0, return true.
			if (1/x === -Infinity && 1/y === Infinity) {
				return true;
			}
			// d. If x is the same Number value as y, return true.
			if (x === y) {
				return true;
			}
			// e. Return false.
			return false;
		}
		// 3. Return SameValueNonNumber(x, y).
		return SameValueNonNumber(x, y);
	}

// _ESAbstract.ToPrimitive
	/* global Type, GetMethod, Call, OrdinaryToPrimitive */
// 7.1.1. ToPrimitive ( input [ , PreferredType ] )
	function ToPrimitive(input /* [, PreferredType] */) { // eslint-disable-line no-unused-vars
		var PreferredType = arguments.length > 1 ? arguments[1] : undefined;
		// 1. Assert: input is an ECMAScript language value.
		// 2. If Type(input) is Object, then
		if (Type(input) === 'object') {
			// a. If PreferredType is not present, let hint be "default".
			if (arguments.length < 2) {
				var hint = 'default';
				// b. Else if PreferredType is hint String, let hint be "string".
			} else if (PreferredType === String) {
				hint = 'string';
				// c. Else PreferredType is hint Number, let hint be "number".
			} else if (PreferredType === Number) {
				hint = 'number';
			}
			// d. Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
			var exoticToPrim = typeof self.Symbol === 'function' && typeof self.Symbol.toPrimitive === 'symbol' ? GetMethod(input, self.Symbol.toPrimitive) : undefined;
			// e. If exoticToPrim is not undefined, then
			if (exoticToPrim !== undefined) {
				// i. Let result be ? Call(exoticToPrim, input, « hint »).
				var result = Call(exoticToPrim, input, [hint]);
				// ii. If Type(result) is not Object, return result.
				if (Type(result) !== 'object') {
					return result;
				}
				// iii. Throw a TypeError exception.
				throw new TypeError('Cannot convert exotic object to primitive.');
			}
			// f. If hint is "default", set hint to "number".
			if (hint === 'default') {
				hint = 'number';
			}
			// g. Return ? OrdinaryToPrimitive(input, hint).
			return OrdinaryToPrimitive(input, hint);
		}
		// 3. Return input
		return input;
	}
// _ESAbstract.ToString
	/* global Type, ToPrimitive */
// 7.1.12. ToString ( argument )
// The abstract operation ToString converts argument to a value of type String according to Table 11:
// Table 11: ToString Conversions
	/*
	|---------------|--------------------------------------------------------|
	| Argument Type | Result                                                 |
	|---------------|--------------------------------------------------------|
	| Undefined     | Return "undefined".                                    |
	|---------------|--------------------------------------------------------|
	| Null	        | Return "null".                                         |
	|---------------|--------------------------------------------------------|
	| Boolean       | If argument is true, return "true".                    |
	|               | If argument is false, return "false".                  |
	|---------------|--------------------------------------------------------|
	| Number        | Return NumberToString(argument).                       |
	|---------------|--------------------------------------------------------|
	| String        | Return argument.                                       |
	|---------------|--------------------------------------------------------|
	| Symbol        | Throw a TypeError exception.                           |
	|---------------|--------------------------------------------------------|
	| Object        | Apply the following steps:                             |
	|               | Let primValue be ? ToPrimitive(argument, hint String). |
	|               | Return ? ToString(primValue).                          |
	|---------------|--------------------------------------------------------|
	*/
	function ToString(argument) { // eslint-disable-line no-unused-vars
		switch(Type(argument)) {
		case 'symbol':
			throw new TypeError('Cannot convert a Symbol value to a string');
		case 'object':
			var primValue = ToPrimitive(argument, String);
			return ToString(primValue);
		default:
			return String(argument);
		}
	}

// _ESAbstract.ToPropertyKey
	/* globals ToPrimitive, Type, ToString */
// 7.1.14. ToPropertyKey ( argument )
	function ToPropertyKey(argument) { // eslint-disable-line no-unused-vars
		// 1. Let key be ? ToPrimitive(argument, hint String).
		var key = ToPrimitive(argument, String);
		// 2. If Type(key) is Symbol, then
		if (Type(key) === 'symbol') {
			// a. Return key.
			return key;
		}
		// 3. Return ! ToString(key).
		return ToString(key);
	}

// Array.prototype.includes
	/* global CreateMethodProperty, Get, SameValueZero, ToInteger, ToLength, ToObject, ToString */
// 22.1.3.11. Array.prototype.includes ( searchElement [ , fromIndex ] )
	CreateMethodProperty(Array.prototype, 'includes', function includes(searchElement /* [ , fromIndex ] */) {
		'use strict';
		// 1. Let O be ? ToObject(this value).
		var O = ToObject(this);
		// 2. Let len be ? ToLength(? Get(O, "length")).
		var len = ToLength(Get(O, "length"));
		// 3. If len is 0, return false.
		if (len === 0) {
			return false;
		}
		// 4. Let n be ? ToInteger(fromIndex). (If fromIndex is undefined, this step produces the value 0.)
		var n = ToInteger(arguments[1]);
		// 5. If n ≥ 0, then
		if (n >= 0) {
			// a. Let k be n.
			var k = n;
			// 6. Else n < 0,
		} else {
			// a. Let k be len + n.
			k = len + n;
			// b. If k < 0, let k be 0.
			if (k < 0) {
				k = 0;
			}
		}
		// 7. Repeat, while k < len
		while (k < len) {
			// a. Let elementK be the result of ? Get(O, ! ToString(k)).
			var elementK = Get(O, ToString(k));
			// b. If SameValueZero(searchElement, elementK) is true, return true.
			if (SameValueZero(searchElement, elementK)) {
				return true;
			}
			// c. Increase k by 1.
			k = k + 1;
		}
		// 8. Return false.
		return false;
	});

// DOMTokenList
	/* global _DOMTokenList */
	(function (global) {
		var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

		if (
			!nativeImpl ||
			(
				!!document.createElementNS &&
				!!document.createElementNS('http://www.w3.org/2000/svg', 'svg') &&
				!(document.createElementNS("http://www.w3.org/2000/svg", "svg").classList instanceof DOMTokenList)
			)
		) {
			global.DOMTokenList = _DOMTokenList;
		}

		// Add second argument to native DOMTokenList.toggle() if necessary
		(function () {
			var e = document.createElement('span');
			if (!('classList' in e)) return;
			e.classList.toggle('x', false);
			if (!e.classList.contains('x')) return;
			e.classList.constructor.prototype.toggle = function toggle(token /*, force*/) {
				var force = arguments[1];
				if (force === undefined) {
					var add = !this.contains(token);
					this[add ? 'add' : 'remove'](token);
					return add;
				}
				force = !!force;
				this[force ? 'add' : 'remove'](token);
				return force;
			};
		}());

		// Add multiple arguments to native DOMTokenList.add() if necessary
		(function () {
			var e = document.createElement('span');
			if (!('classList' in e)) return;
			e.classList.add('a', 'b');
			if (e.classList.contains('b')) return;
			var native = e.classList.constructor.prototype.add;
			e.classList.constructor.prototype.add = function () {
				var args = arguments;
				var l = arguments.length;
				for (var i = 0; i < l; i++) {
					native.call(this, args[i]);
				}
			};
		}());

		// Add multiple arguments to native DOMTokenList.remove() if necessary
		(function () {
			var e = document.createElement('span');
			if (!('classList' in e)) return;
			e.classList.add('a');
			e.classList.add('b');
			e.classList.remove('a', 'b');
			if (!e.classList.contains('b')) return;
			var native = e.classList.constructor.prototype.remove;
			e.classList.constructor.prototype.remove = function () {
				var args = arguments;
				var l = arguments.length;
				for (var i = 0; i < l; i++) {
					native.call(this, args[i]);
				}
			};
		}());

	}(self));

// Element.prototype.classList
	/* global _DOMTokenList */
	/*
	Copyright (c) 2016, John Gardner

	Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
	*/
	(function (global) {
		var dpSupport = true;
		var defineGetter = function (object, name, fn, configurable) {
			if (Object.defineProperty)
				Object.defineProperty(object, name, {
					configurable: false === dpSupport ? true : !!configurable,
					get: fn
				});

			else object.__defineGetter__(name, fn);
		};
		/** Ensure the browser allows Object.defineProperty to be used on native JavaScript objects. */
		try {
			defineGetter({}, "support");
		}
		catch (e) {
			dpSupport = false;
		}
		/** Polyfills a property with a DOMTokenList */
		var addProp = function (o, name, attr) {

			defineGetter(o.prototype, name, function () {
				var tokenList;

				var THIS = this,

					/** Prevent this from firing twice for some reason. What the hell, IE. */
					gibberishProperty = "__defineGetter__" + "DEFINE_PROPERTY" + name;
				if(THIS[gibberishProperty]) return tokenList;
				THIS[gibberishProperty] = true;

				/**
				 * IE8 can't define properties on native JavaScript objects, so we'll use a dumb hack instead.
				 *
				 * What this is doing is creating a dummy element ("reflection") inside a detached phantom node ("mirror")
				 * that serves as the target of Object.defineProperty instead. While we could simply use the subject HTML
				 * element instead, this would conflict with element types which use indexed properties (such as forms and
				 * select lists).
				 */
				if (false === dpSupport) {

					var visage;
					var mirror = addProp.mirror || document.createElement("div");
					var reflections = mirror.childNodes;
					var l = reflections.length;

					for (var i = 0; i < l; ++i)
						if (reflections[i]._R === THIS) {
							visage = reflections[i];
							break;
						}

					/** Couldn't find an element's reflection inside the mirror. Materialise one. */
					visage || (visage = mirror.appendChild(document.createElement("div")));

					tokenList = DOMTokenList.call(visage, THIS, attr);
				} else tokenList = new _DOMTokenList(THIS, attr);

				defineGetter(THIS, name, function () {
					return tokenList;
				});
				delete THIS[gibberishProperty];

				return tokenList;
			}, true);
		};

		addProp(global.Element, "classList", "className");
		addProp(global.HTMLElement, "classList", "className");
		addProp(global.HTMLLinkElement, "relList", "rel");
		addProp(global.HTMLAnchorElement, "relList", "rel");
		addProp(global.HTMLAreaElement, "relList", "rel");
	}(self));

// Element.prototype.matches
	Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {

		var element = this;
		var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
		var index = 0;

		while (elements[index] && elements[index] !== element) {
			++index;
		}

		return !!elements[index];
	};

// Object.getOwnPropertyDescriptor
	/* global CreateMethodProperty, ToObject, ToPropertyKey, HasOwnProperty, Type */
	(function () {
		var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		var supportsDOMDescriptors = (function () {
			try {
				return Object.defineProperty(document.createElement('div'), 'one', {
					get: function () {
						return 1;
					}
				}).one === 1;
			} catch (e) {
				return false;
			}
		});

		var toString = ({}).toString;
		var split = ''.split;

		// 19.1.2.8 Object.getOwnPropertyDescriptor ( O, P )
		CreateMethodProperty(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(O, P) {
			// 1. Let obj be ? ToObject(O).
			var obj = ToObject(O);
			// Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
			obj = (Type(obj) === 'string' || obj instanceof String) && toString.call(O) == '[object String]' ? split.call(O, '') : Object(O);

			// 2. Let key be ? ToPropertyKey(P).
			var key = ToPropertyKey(P);

			// 3. Let desc be ? obj.[[GetOwnProperty]](key).
			// 4. Return FromPropertyDescriptor(desc).
			// Polyfill.io Internet Explorer 8 natively supports property descriptors only on DOM objects.
			// We will fallback to the polyfill implementation if the native implementation throws an error.
			if (supportsDOMDescriptors) {
				try {
					return nativeGetOwnPropertyDescriptor(obj, key);
					// eslint-disable-next-line no-empty
				} catch (error) {}
			}
			if (HasOwnProperty(obj, key)) {
				return {
					enumerable: true,
					configurable: true,
					writable: true,
					value: obj[key]
				};
			}
		});
	}());

// Object.keys
	/* global CreateMethodProperty */
	CreateMethodProperty(Object, "keys", (function() {
		'use strict';

		// modified from https://github.com/es-shims/object-keys

		var has = Object.prototype.hasOwnProperty;
		var toStr = Object.prototype.toString;
		var isEnumerable = Object.prototype.propertyIsEnumerable;
		var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
		var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
		var dontEnums = [
			'toString',
			'toLocaleString',
			'valueOf',
			'hasOwnProperty',
			'isPrototypeOf',
			'propertyIsEnumerable',
			'constructor'
		];
		var equalsConstructorPrototype = function (o) {
			var ctor = o.constructor;
			return ctor && ctor.prototype === o;
		};
		var excludedKeys = {
			$console: true,
			$external: true,
			$frame: true,
			$frameElement: true,
			$frames: true,
			$innerHeight: true,
			$innerWidth: true,
			$outerHeight: true,
			$outerWidth: true,
			$pageXOffset: true,
			$pageYOffset: true,
			$parent: true,
			$scrollLeft: true,
			$scrollTop: true,
			$scrollX: true,
			$scrollY: true,
			$self: true,
			$webkitIndexedDB: true,
			$webkitStorageInfo: true,
			$window: true
		};
		var hasAutomationEqualityBug = (function () {
			if (typeof window === 'undefined') { return false; }
			for (var k in window) {
				try {
					if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
						try {
							equalsConstructorPrototype(window[k]);
						} catch (e) {
							return true;
						}
					}
				} catch (e) {
					return true;
				}
			}
			return false;
		}());
		var equalsConstructorPrototypeIfNotBuggy = function (o) {
			if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
				return equalsConstructorPrototype(o);
			}
			try {
				return equalsConstructorPrototype(o);
			} catch (e) {
				return false;
			}
		};

		function isArgumentsObject(value) {
			var str = toStr.call(value);
			var isArgs = str === '[object Arguments]';
			if (!isArgs) {
				isArgs = str !== '[object Array]' &&
					value !== null &&
					typeof value === 'object' &&
					typeof value.length === 'number' &&
					value.length >= 0 &&
					toStr.call(value.callee) === '[object Function]';
			}
			return isArgs;
		}

		return function keys(object) {
			var isFunction = toStr.call(object) === '[object Function]';
			var isArguments = isArgumentsObject(object);
			var isString = toStr.call(object) === '[object String]';
			var theKeys = [];

			if (object === undefined || object === null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var skipProto = hasProtoEnumBug && isFunction;
			if (isString && object.length > 0 && !has.call(object, 0)) {
				for (var i = 0; i < object.length; ++i) {
					theKeys.push(String(i));
				}
			}

			if (isArguments && object.length > 0) {
				for (var j = 0; j < object.length; ++j) {
					theKeys.push(String(j));
				}
			} else {
				for (var name in object) {
					if (!(skipProto && name === 'prototype') && has.call(object, name)) {
						theKeys.push(String(name));
					}
				}
			}

			if (hasDontEnumBug) {
				var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

				for (var k = 0; k < dontEnums.length; ++k) {
					if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
						theKeys.push(dontEnums[k]);
					}
				}
			}
			return theKeys;
		};
	}()));

// Object.getOwnPropertyNames
	/* global CreateMethodProperty, ToObject */
	(function() {
		var toString = {}.toString;
		var split = "".split;
		var concat = [].concat;
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var nativeGetOwnPropertyNames = Object.getOwnPropertyNames || Object.keys;
		var cachedWindowNames =
			typeof self === "object" ? nativeGetOwnPropertyNames(self) : [];

		// 19.1.2.10 Object.getOwnPropertyNames ( O )
		CreateMethodProperty(
			Object,
			"getOwnPropertyNames",
			function getOwnPropertyNames(O) {
				var object = ToObject(O);

				if (toString.call(object) === "[object Window]") {
					try {
						return nativeGetOwnPropertyNames(object);
					} catch (e) {
						// IE bug where layout engine calls userland Object.getOwnPropertyNames for cross-domain `window` objects
						return concat.call([], cachedWindowNames);
					}
				}

				// Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
				object =
					toString.call(object) == "[object String]"
						? split.call(object, "")
						: Object(object);

				var result = nativeGetOwnPropertyNames(object);
				var extraNonEnumerableKeys = ["length", "prototype"];
				for (var i = 0; i < extraNonEnumerableKeys.length; i++) {
					var key = extraNonEnumerableKeys[i];
					if (hasOwnProperty.call(object, key) && !result.includes(key)) {
						result.push(key);
					}
				}

				if (result.includes("__proto__")) {
					var index = result.indexOf("__proto__");
					result.splice(index, 1);
				}

				return result;
			}
		);
	})();

// Symbol
// A modification of https://github.com/WebReflection/get-own-property-symbols
// (C) Andrea Giammarchi - MIT Licensed

	(function (Object, GOPS, global) {
		'use strict'; //so that ({}).toString.call(null) returns the correct [object Null] rather than [object Window]

		var	setDescriptor;
		var id = 0;
		var random = '' + Math.random();
		var prefix = '__\x01symbol:';
		var prefixLength = prefix.length;
		var internalSymbol = '__\x01symbol@@' + random;
		var DP = 'defineProperty';
		var DPies = 'defineProperties';
		var GOPN = 'getOwnPropertyNames';
		var GOPD = 'getOwnPropertyDescriptor';
		var PIE = 'propertyIsEnumerable';
		var ObjectProto = Object.prototype;
		var hOP = ObjectProto.hasOwnProperty;
		var pIE = ObjectProto[PIE];
		var toString = ObjectProto.toString;
		var concat = Array.prototype.concat;
		var cachedWindowNames = Object.getOwnPropertyNames ? Object.getOwnPropertyNames(self) : [];
		var nGOPN = Object[GOPN];
		var gOPN = function getOwnPropertyNames (obj) {
			if (toString.call(obj) === '[object Window]') {
				try {
					return nGOPN(obj);
				} catch (e) {
					// IE bug where layout engine calls userland gOPN for cross-domain `window` objects
					return concat.call([], cachedWindowNames);
				}
			}
			return nGOPN(obj);
		};
		var gOPD = Object[GOPD];
		var create = Object.create;
		var keys = Object.keys;
		var freeze = Object.freeze || Object;
		var defineProperty = Object[DP];
		var $defineProperties = Object[DPies];
		var descriptor = gOPD(Object, GOPN);
		var addInternalIfNeeded = function (o, uid, enumerable) {
			if (!hOP.call(o, internalSymbol)) {
				try {
					defineProperty(o, internalSymbol, {
						enumerable: false,
						configurable: false,
						writable: false,
						value: {}
					});
				} catch (e) {
					o[internalSymbol] = {};
				}
			}
			o[internalSymbol]['@@' + uid] = enumerable;
		};
		var createWithSymbols = function (proto, descriptors) {
			var self = create(proto);
			gOPN(descriptors).forEach(function (key) {
				if (propertyIsEnumerable.call(descriptors, key)) {
					$defineProperty(self, key, descriptors[key]);
				}
			});
			return self;
		};
		var copyAsNonEnumerable = function (descriptor) {
			var newDescriptor = create(descriptor);
			newDescriptor.enumerable = false;
			return newDescriptor;
		};
		var get = function get(){};
		var onlyNonSymbols = function (name) {
			return name != internalSymbol &&
				!hOP.call(source, name);
		};
		var onlySymbols = function (name) {
			return name != internalSymbol &&
				hOP.call(source, name);
		};
		var propertyIsEnumerable = function propertyIsEnumerable(key) {
			var uid = '' + key;
			return onlySymbols(uid) ? (
				hOP.call(this, uid) &&
				this[internalSymbol]['@@' + uid]
			) : pIE.call(this, key);
		};
		var setAndGetSymbol = function (uid) {
			var descriptor = {
				enumerable: false,
				configurable: true,
				get: get,
				set: function (value) {
					setDescriptor(this, uid, {
						enumerable: false,
						configurable: true,
						writable: true,
						value: value
					});
					addInternalIfNeeded(this, uid, true);
				}
			};
			try {
				defineProperty(ObjectProto, uid, descriptor);
			} catch (e) {
				ObjectProto[uid] = descriptor.value;
			}
			return freeze(source[uid] = defineProperty(
				Object(uid),
				'constructor',
				sourceConstructor
			));
		};
		var Symbol = function Symbol() {
			var description = arguments[0];
			if (this instanceof Symbol) {
				throw new TypeError('Symbol is not a constructor');
			}
			return setAndGetSymbol(
				prefix.concat(description || '', random, ++id)
			);
		};
		var source = create(null);
		var sourceConstructor = {value: Symbol};
		var sourceMap = function (uid) {
			return source[uid];
		};
		var $defineProperty = function defineProp(o, key, descriptor) {
			var uid = '' + key;
			if (onlySymbols(uid)) {
				setDescriptor(o, uid, descriptor.enumerable ?
					copyAsNonEnumerable(descriptor) : descriptor);
				addInternalIfNeeded(o, uid, !!descriptor.enumerable);
			} else {
				defineProperty(o, key, descriptor);
			}
			return o;
		};

		var onlyInternalSymbols = function (obj) {
			return function (name) {
				return hOP.call(obj, internalSymbol) && hOP.call(obj[internalSymbol], '@@' + name);
			};
		};
		var $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
				return gOPN(o).filter(o === ObjectProto ? onlyInternalSymbols(o) : onlySymbols).map(sourceMap);
			}
		;

		descriptor.value = $defineProperty;
		defineProperty(Object, DP, descriptor);

		descriptor.value = $getOwnPropertySymbols;
		defineProperty(Object, GOPS, descriptor);

		descriptor.value = function getOwnPropertyNames(o) {
			return gOPN(o).filter(onlyNonSymbols);
		};
		defineProperty(Object, GOPN, descriptor);

		descriptor.value = function defineProperties(o, descriptors) {
			var symbols = $getOwnPropertySymbols(descriptors);
			if (symbols.length) {
				keys(descriptors).concat(symbols).forEach(function (uid) {
					if (propertyIsEnumerable.call(descriptors, uid)) {
						$defineProperty(o, uid, descriptors[uid]);
					}
				});
			} else {
				$defineProperties(o, descriptors);
			}
			return o;
		};
		defineProperty(Object, DPies, descriptor);

		descriptor.value = propertyIsEnumerable;
		defineProperty(ObjectProto, PIE, descriptor);

		descriptor.value = Symbol;
		defineProperty(global, 'Symbol', descriptor);

		// defining `Symbol.for(key)`
		descriptor.value = function (key) {
			var uid = prefix.concat(prefix, key, random);
			return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
		};
		defineProperty(Symbol, 'for', descriptor);

		// defining `Symbol.keyFor(symbol)`
		descriptor.value = function (symbol) {
			if (onlyNonSymbols(symbol))
				throw new TypeError(symbol + ' is not a symbol');
			return hOP.call(source, symbol) ?
				symbol.slice(prefixLength * 2, -random.length) :
				void 0
				;
		};
		defineProperty(Symbol, 'keyFor', descriptor);

		descriptor.value = function getOwnPropertyDescriptor(o, key) {
			var descriptor = gOPD(o, key);
			if (descriptor && onlySymbols(key)) {
				descriptor.enumerable = propertyIsEnumerable.call(o, key);
			}
			return descriptor;
		};
		defineProperty(Object, GOPD, descriptor);

		descriptor.value = function (proto, descriptors) {
			return arguments.length === 1 || typeof descriptors === "undefined" ?
				create(proto) :
				createWithSymbols(proto, descriptors);
		};
		defineProperty(Object, 'create', descriptor);

		var strictModeSupported = (function(){ 'use strict'; return this; }).call(null) === null;
		if (strictModeSupported) {
			descriptor.value = function () {
				var str = toString.call(this);
				return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
			};
		} else {
			descriptor.value = function () {
				// https://github.com/Financial-Times/polyfill-library/issues/164#issuecomment-486965300
				// Polyfill.io this code is here for the situation where a browser does not
				// support strict mode and is executing `Object.prototype.toString.call(null)`.
				// This code ensures that we return the correct result in that situation however,
				// this code also introduces a bug where it will return the incorrect result for
				// `Object.prototype.toString.call(window)`. We can't have the correct result for
				// both `window` and `null`, so we have opted for `null` as we believe this is the more
				// common situation.
				if (this === window) {
					return '[object Null]';
				}

				var str = toString.call(this);
				return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
			};
		}
		defineProperty(ObjectProto, 'toString', descriptor);

		setDescriptor = function (o, key, descriptor) {
			var protoDescriptor = gOPD(ObjectProto, key);
			delete ObjectProto[key];
			defineProperty(o, key, descriptor);
			if (o !== ObjectProto) {
				defineProperty(ObjectProto, key, protoDescriptor);
			}
		};

	}(Object, 'getOwnPropertySymbols', this));

// Symbol.toStringTag
	/* global Symbol */
	Object.defineProperty(Symbol, 'toStringTag', {
		value: Symbol('toStringTag')
	});

// Promise
	/*
	 Yaku v0.19.3
	 (c) 2015 Yad Smood. http://ysmood.org
	 License MIT
	*/
	/*
	 Yaku v0.17.9
	 (c) 2015 Yad Smood. http://ysmood.org
	 License MIT
	*/
	(function () {
		'use strict';

		var $undefined
			, $null = null
			, isBrowser = typeof self === 'object'
			, root = self
			, nativePromise = root.Promise
			, process = root.process
			, console = root.console
			, isLongStackTrace = true
			, Arr = Array
			, Err = Error

			, $rejected = 1
			, $resolved = 2
			, $pending = 3

			, $Symbol = 'Symbol'
			, $iterator = 'iterator'
			, $species = 'species'
			, $speciesKey = $Symbol + '(' + $species + ')'
			, $return = 'return'

			, $unhandled = '_uh'
			, $promiseTrace = '_pt'
			, $settlerTrace = '_st'

			, $invalidThis = 'Invalid this'
			, $invalidArgument = 'Invalid argument'
			, $fromPrevious = '\nFrom previous '
			, $promiseCircularChain = 'Chaining cycle detected for promise'
			, $unhandledRejectionMsg = 'Uncaught (in promise)'
			, $rejectionHandled = 'rejectionHandled'
			, $unhandledRejection = 'unhandledRejection'

			, $tryCatchFn
			, $tryCatchThis
			, $tryErr = { e: $null }
			, $noop = function () {}
			, $cleanStackReg = /^.+\/node_modules\/yaku\/.+\n?/mg
		;

		/**
		 * This class follows the [Promises/A+](https://promisesaplus.com) and
		 * [ES6](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects) spec
		 * with some extra helpers.
		 * @param  {Function} executor Function object with two arguments resolve, reject.
		 * The first argument fulfills the promise, the second argument rejects it.
		 * We can call these functions, once our operation is completed.
		 */
		var Yaku = function (executor) {
			var self = this,
				err;

			// "this._s" is the internao state of: pending, resolved or rejected
			// "this._v" is the internal value

			if (!isObject(self) || self._s !== $undefined)
				throw genTypeError($invalidThis);

			self._s = $pending;

			if (isLongStackTrace) self[$promiseTrace] = genTraceInfo();

			if (executor !== $noop) {
				if (!isFunction(executor))
					throw genTypeError($invalidArgument);

				err = genTryCatcher(executor)(
					genSettler(self, $resolved),
					genSettler(self, $rejected)
				);

				if (err === $tryErr)
					settlePromise(self, $rejected, err.e);
			}
		};

		Yaku['default'] = Yaku;

		extend(Yaku.prototype, {
			/**
			 * Appends fulfillment and rejection handlers to the promise,
			 * and returns a new promise resolving to the return value of the called handler.
			 * @param  {Function} onFulfilled Optional. Called when the Promise is resolved.
			 * @param  {Function} onRejected  Optional. Called when the Promise is rejected.
			 * @return {Yaku} It will return a new Yaku which will resolve or reject after
			 * @example
			 * the current Promise.
			 * ```js
			 * var Promise = require('yaku');
			 * var p = Promise.resolve(10);
			 *
			 * p.then((v) => {
			 *     console.log(v);
			 * });
			 * ```
			 */
			then: function (onFulfilled, onRejected) {
				if (this._s === undefined) throw genTypeError();

				return addHandler(
					this,
					newCapablePromise(Yaku.speciesConstructor(this, Yaku)),
					onFulfilled,
					onRejected
				);
			},

			/**
			 * The `catch()` method returns a Promise and deals with rejected cases only.
			 * It behaves the same as calling `Promise.prototype.then(undefined, onRejected)`.
			 * @param  {Function} onRejected A Function called when the Promise is rejected.
			 * This function has one argument, the rejection reason.
			 * @return {Yaku} A Promise that deals with rejected cases only.
			 * @example
			 * ```js
			 * var Promise = require('yaku');
			 * var p = Promise.reject(new Error("ERR"));
			 *
			 * p['catch']((v) => {
			 *     console.log(v);
			 * });
			 * ```
			 */
			'catch': function (onRejected) {
				return this.then($undefined, onRejected);
			},

			/**
			 * Register a callback to be invoked when a promise is settled (either fulfilled or rejected).
			 * Similar with the try-catch-finally, it's often used for cleanup.
			 * @param  {Function} onFinally A Function called when the Promise is settled.
			 * It will not receive any argument.
			 * @return {Yaku} A Promise that will reject if onFinally throws an error or returns a rejected promise.
			 * Else it will resolve previous promise's final state (either fulfilled or rejected).
			 * @example
			 * ```js
			 * var Promise = require('yaku');
			 * var p = Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
			 * p.finally(() => {
			 *     console.log('finally');
			 * });
			 * ```
			 */
			'finally': function (onFinally) {
				return this.then(function (val) {
					return Yaku.resolve(onFinally()).then(function () {
						return val;
					});
				}, function (err) {
					return Yaku.resolve(onFinally()).then(function () {
						throw err;
					});
				});
			},

			// The number of current promises that attach to this Yaku instance.
			_c: 0,

			// The parent Yaku.
			_p: $null
		});

		/**
		 * The `Promise.resolve(value)` method returns a Promise object that is resolved with the given value.
		 * If the value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable,
		 * adopting its eventual state; otherwise the returned promise will be fulfilled with the value.
		 * @param  {Any} value Argument to be resolved by this Promise.
		 * Can also be a Promise or a thenable to resolve.
		 * @return {Yaku}
		 * @example
		 * ```js
		 * var Promise = require('yaku');
		 * var p = Promise.resolve(10);
		 * ```
		 */
		Yaku.resolve = function (val) {
			return isYaku(val) ? val : settleWithX(newCapablePromise(this), val);
		};

		/**
		 * The `Promise.reject(reason)` method returns a Promise object that is rejected with the given reason.
		 * @param  {Any} reason Reason why this Promise rejected.
		 * @return {Yaku}
		 * @example
		 * ```js
		 * var Promise = require('yaku');
		 * var p = Promise.reject(new Error("ERR"));
		 * ```
		 */
		Yaku.reject = function (reason) {
			return settlePromise(newCapablePromise(this), $rejected, reason);
		};

		/**
		 * The `Promise.race(iterable)` method returns a promise that resolves or rejects
		 * as soon as one of the promises in the iterable resolves or rejects,
		 * with the value or reason from that promise.
		 * @param  {iterable} iterable An iterable object, such as an Array.
		 * @return {Yaku} The race function returns a Promise that is settled
		 * the same way as the first passed promise to settle.
		 * It resolves or rejects, whichever happens first.
		 * @example
		 * ```js
		 * var Promise = require('yaku');
		 * Promise.race([
		 *     123,
		 *     Promise.resolve(0)
		 * ])
		 * .then((value) => {
		 *     console.log(value); // => 123
		 * });
		 * ```
		 */
		Yaku.race = function (iterable) {
			var self = this
				, p = newCapablePromise(self)

				, resolve = function (val) {
				settlePromise(p, $resolved, val);
			}

				, reject = function (val) {
				settlePromise(p, $rejected, val);
			}

				, ret = genTryCatcher(each)(iterable, function (v) {
				self.resolve(v).then(resolve, reject);
			});

			if (ret === $tryErr) return self.reject(ret.e);

			return p;
		};

		/**
		 * The `Promise.all(iterable)` method returns a promise that resolves when
		 * all of the promises in the iterable argument have resolved.
		 *
		 * The result is passed as an array of values from all the promises.
		 * If something passed in the iterable array is not a promise,
		 * it's converted to one by Promise.resolve. If any of the passed in promises rejects,
		 * the all Promise immediately rejects with the value of the promise that rejected,
		 * discarding all the other promises whether or not they have resolved.
		 * @param  {iterable} iterable An iterable object, such as an Array.
		 * @return {Yaku}
		 * @example
		 * ```js
		 * var Promise = require('yaku');
		 * Promise.all([
		 *     123,
		 *     Promise.resolve(0)
		 * ])
		 * .then((values) => {
		 *     console.log(values); // => [123, 0]
		 * });
		 * ```
		 * @example
		 * Use with iterable.
		 * ```js
		 * var Promise = require('yaku');
		 * Promise.all((function * () {
		 *     yield 10;
		 *     yield new Promise(function (r) { setTimeout(r, 1000, "OK") });
		 * })())
		 * .then((values) => {
		 *     console.log(values); // => [123, 0]
		 * });
		 * ```
		 */
		Yaku.all = function (iterable) {
			var self = this
				, p1 = newCapablePromise(self)
				, res = []
				, ret
			;

			function reject (reason) {
				settlePromise(p1, $rejected, reason);
			}

			ret = genTryCatcher(each)(iterable, function (item, i) {
				self.resolve(item).then(function (value) {
					res[i] = value;
					if (!--ret) settlePromise(p1, $resolved, res);
				}, reject);
			});

			if (ret === $tryErr) return self.reject(ret.e);

			if (!ret) settlePromise(p1, $resolved, []);

			return p1;
		};

		/**
		 * The ES6 Symbol object that Yaku should use, by default it will use the
		 * global one.
		 * @type {Object}
		 * @example
		 * ```js
		 * var core = require("core-js/library");
		 * var Promise = require("yaku");
		 * Promise.Symbol = core.Symbol;
		 * ```
		 */
		Yaku.Symbol = root[$Symbol] || {};

		// To support browsers that don't support `Object.defineProperty`.
		genTryCatcher(function () {
			Object.defineProperty(Yaku, getSpecies(), {
				get: function () { return this; }
			});
		})();

		/**
		 * Use this api to custom the species behavior.
		 * https://tc39.github.io/ecma262/#sec-speciesconstructor
		 * @param {Any} O The current this object.
		 * @param {Function} defaultConstructor
		 */
		Yaku.speciesConstructor = function (O, D) {
			var C = O.constructor;

			return C ? (C[getSpecies()] || D) : D;
		};

		/**
		 * Catch all possibly unhandled rejections. If you want to use specific
		 * format to display the error stack, overwrite it.
		 * If it is set, auto `console.error` unhandled rejection will be disabled.
		 * @param {Any} reason The rejection reason.
		 * @param {Yaku} p The promise that was rejected.
		 * @example
		 * ```js
		 * var Promise = require('yaku');
		 * Promise.unhandledRejection = (reason) => {
		 *     console.error(reason);
		 * };
		 *
		 * // The console will log an unhandled rejection error message.
		 * Promise.reject('my reason');
		 *
		 * // The below won't log the unhandled rejection error message.
		 * Promise.reject('v')["catch"](() => {});
		 * ```
		 */
		Yaku.unhandledRejection = function (reason, p) {
			console && console.error(
				$unhandledRejectionMsg,
				isLongStackTrace ? p.longStack : genStackInfo(reason, p)
			);
		};

		/**
		 * Emitted whenever a Promise was rejected and an error handler was
		 * attached to it (for example with `["catch"]()`) later than after an event loop turn.
		 * @param {Any} reason The rejection reason.
		 * @param {Yaku} p The promise that was rejected.
		 */
		Yaku.rejectionHandled = $noop;

		/**
		 * It is used to enable the long stack trace.
		 * Once it is enabled, it can't be reverted.
		 * While it is very helpful in development and testing environments,
		 * it is not recommended to use it in production. It will slow down
		 * application and eat up memory.
		 * It will add an extra property `longStack` to the Error object.
		 * @example
		 * ```js
		 * var Promise = require('yaku');
		 * Promise.enableLongStackTrace();
		 * Promise.reject(new Error("err"))["catch"]((err) => {
		 *     console.log(err.longStack);
		 * });
		 * ```
		 */
		Yaku.enableLongStackTrace = function () {
			isLongStackTrace = true;
		};

		/**
		 * Only Node has `process.nextTick` function. For browser there are
		 * so many ways to polyfill it. Yaku won't do it for you, instead you
		 * can choose what you prefer. For example, this project
		 * [next-tick](https://github.com/medikoo/next-tick).
		 * By default, Yaku will use `process.nextTick` on Node, `setTimeout` on browser.
		 * @type {Function}
		 * @example
		 * ```js
		 * var Promise = require('yaku');
		 * Promise.nextTick = require('next-tick');
		 * ```
		 * @example
		 * You can even use sync resolution if you really know what you are doing.
		 * ```js
		 * var Promise = require('yaku');
		 * Promise.nextTick = fn => fn();
		 * ```
		 */
		Yaku.nextTick = isBrowser ?
			function (fn) {
				nativePromise ?
					new nativePromise(function (resolve) { resolve(); }).then(fn) :
					setTimeout(fn);
			} :
			process.nextTick;

		// ********************** Private **********************

		Yaku._s = 1;

		/**
		 * All static variable name will begin with `$`. Such as `$rejected`.
		 * @private
		 */

		// ******************************* Utils ********************************

		function getSpecies () {
			return Yaku[$Symbol][$species] || $speciesKey;
		}

		function extend (src, target) {
			for (var k in target) {
				src[k] = target[k];
			}
		}

		function isObject (obj) {
			return obj && typeof obj === 'object';
		}

		function isFunction (obj) {
			return typeof obj === 'function';
		}

		function isInstanceOf (a, b) {
			return a instanceof b;
		}

		function isError (obj) {
			return isInstanceOf(obj, Err);
		}

		function ensureType (obj, fn, msg) {
			if (!fn(obj)) throw genTypeError(msg);
		}

		/**
		 * Wrap a function into a try-catch.
		 * @private
		 * @return {Any | $tryErr}
		 */
		function tryCatcher () {
			try {
				return $tryCatchFn.apply($tryCatchThis, arguments);
			} catch (e) {
				$tryErr.e = e;
				return $tryErr;
			}
		}

		/**
		 * Generate a try-catch wrapped function.
		 * @private
		 * @param  {Function} fn
		 * @return {Function}
		 */
		function genTryCatcher (fn, self) {
			$tryCatchFn = fn;
			$tryCatchThis = self;
			return tryCatcher;
		}

		/**
		 * Generate a scheduler.
		 * @private
		 * @param  {Integer}  initQueueSize
		 * @param  {Function} fn `(Yaku, Value) ->` The schedule handler.
		 * @return {Function} `(Yaku, Value) ->` The scheduler.
		 */
		function genScheduler (initQueueSize, fn) {
			/**
			 * All async promise will be scheduled in
			 * here, so that they can be execute on the next tick.
			 * @private
			 */
			var fnQueue = Arr(initQueueSize)
				, fnQueueLen = 0;

			/**
			 * Run all queued functions.
			 * @private
			 */
			function flush () {
				var i = 0;
				while (i < fnQueueLen) {
					fn(fnQueue[i], fnQueue[i + 1]);
					fnQueue[i++] = $undefined;
					fnQueue[i++] = $undefined;
				}

				fnQueueLen = 0;
				if (fnQueue.length > initQueueSize) fnQueue.length = initQueueSize;
			}

			return function (v, arg) {
				fnQueue[fnQueueLen++] = v;
				fnQueue[fnQueueLen++] = arg;

				if (fnQueueLen === 2) Yaku.nextTick(flush);
			};
		}

		/**
		 * Generate a iterator
		 * @param  {Any} obj
		 * @private
		 * @return {Object || TypeError}
		 */
		function each (iterable, fn) {
			var len
				, i = 0
				, iter
				, item
				, ret
			;

			if (!iterable) throw genTypeError($invalidArgument);

			var gen = iterable[Yaku[$Symbol][$iterator]];
			if (isFunction(gen))
				iter = gen.call(iterable);
			else if (isFunction(iterable.next)) {
				iter = iterable;
			}
			else if (isInstanceOf(iterable, Arr)) {
				len = iterable.length;
				while (i < len) {
					fn(iterable[i], i++);
				}
				return i;
			} else
				throw genTypeError($invalidArgument);

			while (!(item = iter.next()).done) {
				ret = genTryCatcher(fn)(item.value, i++);
				if (ret === $tryErr) {
					isFunction(iter[$return]) && iter[$return]();
					throw ret.e;
				}
			}

			return i;
		}

		/**
		 * Generate type error object.
		 * @private
		 * @param  {String} msg
		 * @return {TypeError}
		 */
		function genTypeError (msg) {
			return new TypeError(msg);
		}

		function genTraceInfo (noTitle) {
			return (noTitle ? '' : $fromPrevious) + new Err().stack;
		}


		// *************************** Promise Helpers ****************************

		/**
		 * Resolve the value returned by onFulfilled or onRejected.
		 * @private
		 * @param {Yaku} p1
		 * @param {Yaku} p2
		 */
		var scheduleHandler = genScheduler(999, function (p1, p2) {
			var x, handler;

			// 2.2.2
			// 2.2.3
			handler = p1._s !== $rejected ? p2._onFulfilled : p2._onRejected;

			// 2.2.7.3
			// 2.2.7.4
			if (handler === $undefined) {
				settlePromise(p2, p1._s, p1._v);
				return;
			}

			// 2.2.7.1
			x = genTryCatcher(callHanler)(handler, p1._v);
			if (x === $tryErr) {
				// 2.2.7.2
				settlePromise(p2, $rejected, x.e);
				return;
			}

			settleWithX(p2, x);
		});

		var scheduleUnhandledRejection = genScheduler(9, function (p) {
			if (!hashOnRejected(p)) {
				p[$unhandled] = 1;
				emitEvent($unhandledRejection, p);
			}
		});

		function emitEvent (name, p) {
			var browserEventName = 'on' + name.toLowerCase()
				, browserHandler = root[browserEventName];

			if (process && process.listeners(name).length)
				name === $unhandledRejection ?
					process.emit(name, p._v, p) : process.emit(name, p);
			else if (browserHandler)
				browserHandler({ reason: p._v, promise: p });
			else
				Yaku[name](p._v, p);
		}

		function isYaku (val) { return val && val._s; }

		function newCapablePromise (Constructor) {
			if (isYaku(Constructor)) return new Constructor($noop);

			var p, r, j;
			p = new Constructor(function (resolve, reject) {
				if (p) throw genTypeError();

				r = resolve;
				j = reject;
			});

			ensureType(r, isFunction);
			ensureType(j, isFunction);

			return p;
		}

		/**
		 * It will produce a settlePromise function to user.
		 * Such as the resolve and reject in this `new Yaku (resolve, reject) ->`.
		 * @private
		 * @param  {Yaku} self
		 * @param  {Integer} state The value is one of `$pending`, `$resolved` or `$rejected`.
		 * @return {Function} `(value) -> undefined` A resolve or reject function.
		 */
		function genSettler (self, state) {
			var isCalled = false;
			return function (value) {
				if (isCalled) return;
				isCalled = true;

				if (isLongStackTrace)
					self[$settlerTrace] = genTraceInfo(true);

				if (state === $resolved)
					settleWithX(self, value);
				else
					settlePromise(self, state, value);
			};
		}

		/**
		 * Link the promise1 to the promise2.
		 * @private
		 * @param {Yaku} p1
		 * @param {Yaku} p2
		 * @param {Function} onFulfilled
		 * @param {Function} onRejected
		 */
		function addHandler (p1, p2, onFulfilled, onRejected) {
			// 2.2.1
			if (isFunction(onFulfilled))
				p2._onFulfilled = onFulfilled;
			if (isFunction(onRejected)) {
				if (p1[$unhandled]) emitEvent($rejectionHandled, p1);

				p2._onRejected = onRejected;
			}

			if (isLongStackTrace) p2._p = p1;
			p1[p1._c++] = p2;

			// 2.2.6
			if (p1._s !== $pending)
				scheduleHandler(p1, p2);

			// 2.2.7
			return p2;
		}

		// iterate tree
		function hashOnRejected (node) {
			// A node shouldn't be checked twice.
			if (node._umark)
				return true;
			else
				node._umark = true;

			var i = 0
				, len = node._c
				, child;

			while (i < len) {
				child = node[i++];
				if (child._onRejected || hashOnRejected(child)) return true;
			}
		}

		function genStackInfo (reason, p) {
			var stackInfo = [];

			function push (trace) {
				return stackInfo.push(trace.replace(/^\s+|\s+$/g, ''));
			}

			if (isLongStackTrace) {
				if (p[$settlerTrace])
					push(p[$settlerTrace]);

				// Hope you guys could understand how the back trace works.
				// We only have to iterate through the tree from the bottom to root.
				(function iter (node) {
					if (node && $promiseTrace in node) {
						iter(node._next);
						push(node[$promiseTrace] + '');
						iter(node._p);
					}
				})(p);
			}

			return (reason && reason.stack ? reason.stack : reason) +
				('\n' + stackInfo.join('\n')).replace($cleanStackReg, '');
		}

		function callHanler (handler, value) {
			// 2.2.5
			return handler(value);
		}

		/**
		 * Resolve or reject a promise.
		 * @private
		 * @param  {Yaku} p
		 * @param  {Integer} state
		 * @param  {Any} value
		 */
		function settlePromise (p, state, value) {
			var i = 0
				, len = p._c;

			// 2.1.2
			// 2.1.3
			if (p._s === $pending) {
				// 2.1.1.1
				p._s = state;
				p._v = value;

				if (state === $rejected) {
					if (isLongStackTrace && isError(value)) {
						value.longStack = genStackInfo(value, p);
					}

					scheduleUnhandledRejection(p);
				}

				// 2.2.4
				while (i < len) {
					scheduleHandler(p, p[i++]);
				}
			}

			return p;
		}

		/**
		 * Resolve or reject promise with value x. The x can also be a thenable.
		 * @private
		 * @param {Yaku} p
		 * @param {Any | Thenable} x A normal value or a thenable.
		 */
		function settleWithX (p, x) {
			// 2.3.1
			if (x === p && x) {
				settlePromise(p, $rejected, genTypeError($promiseCircularChain));
				return p;
			}

			// 2.3.2
			// 2.3.3
			if (x !== $null && (isFunction(x) || isObject(x))) {
				// 2.3.2.1
				var xthen = genTryCatcher(getThen)(x);

				if (xthen === $tryErr) {
					// 2.3.3.2
					settlePromise(p, $rejected, xthen.e);
					return p;
				}

				if (isFunction(xthen)) {
					if (isLongStackTrace && isYaku(x))
						p._next = x;

					// Fix https://bugs.chromium.org/p/v8/issues/detail?id=4162
					if (isYaku(x))
						settleXthen(p, x, xthen);
					else
						Yaku.nextTick(function () {
							settleXthen(p, x, xthen);
						});
				} else
					// 2.3.3.4
					settlePromise(p, $resolved, x);
			} else
				// 2.3.4
				settlePromise(p, $resolved, x);

			return p;
		}

		/**
		 * Try to get a promise's then method.
		 * @private
		 * @param  {Thenable} x
		 * @return {Function}
		 */
		function getThen (x) { return x.then; }

		/**
		 * Resolve then with its promise.
		 * @private
		 * @param  {Yaku} p
		 * @param  {Thenable} x
		 * @param  {Function} xthen
		 */
		function settleXthen (p, x, xthen) {
			// 2.3.3.3
			var err = genTryCatcher(xthen, x)(function (y) {
				// 2.3.3.3.3
				// 2.3.3.3.1
				x && (x = $null, settleWithX(p, y));
			}, function (r) {
				// 2.3.3.3.3
				// 2.3.3.3.2
				x && (x = $null, settlePromise(p, $rejected, r));
			});

			// 2.3.3.3.4.1
			if (err === $tryErr && x) {
				// 2.3.3.3.4.2
				settlePromise(p, $rejected, err.e);
				x = $null;
			}
		}

		root.Promise = Yaku;
	})();
}
})
('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});