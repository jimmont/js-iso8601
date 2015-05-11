/**
 * adapted from Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
 * TODO tests
 */
(function (global, _Date, undefined) {
	var origParse = _Date.parse || function(){ return NaN; }
	, numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ]
	, isISO8601 = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/
	;
	function Date(year, month, day, hour, min, sec, ms){
		var l = arguments.length;
		if(l){
			if(typeof year === 'string' && isISO8601.test(year)) return new _Date( Date.parse(year) );
			if(l > 1) return new _Date(year, month, day || 1, hour || 0, min || 0, sec || 0, ms || 0);
			return new _Date(year);
		};
		return new _Date();
	};
	Date._Date = _Date;
	Date.UTC = _Date.UTC;
	Date.now = _Date.now || function now() { return new _Date().getTime(); };
	Date.parse = function (date) {
		var timestamp, struct, minutesOffset = 0;

		// ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
		// before falling back to any implementation-specific date parsing, so that’s what we do, even if native
		// implementations could be faster
		//			  1 YYYY				2 MM	   3 DD		   4 HH	5 mm	   6 ss		7 msec		8 Z 9 ±	10 tzHH	11 tzmm
		if ((struct = isISO8601.exec(date))) {
			// avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
			for (var i = 0, k; (k = numericKeys[i]); ++i) {
				struct[k] = +struct[k] || 0;
			}

			// allow undefined days and months
			struct[2] = (+struct[2] || 1) - 1;
			struct[3] = +struct[3] || 1;

			if (struct[8] !== 'Z' && struct[9] !== undefined) {
				minutesOffset = struct[10] * 60 + struct[11];

				if (struct[9] === '+') {
					minutesOffset = 0 - minutesOffset;
				}
			}

			timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
		}
		else {
			timestamp = origParse(date);
		}

		return timestamp;
	};
	global.Date = Date;
}(this, Date));
