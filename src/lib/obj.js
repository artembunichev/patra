/*
	used for filtering out the keys of
	Vue reactive Proxy-object.
*/
export function actualKeys(obj) {
	var excl = [
			"__defineGetter__",
			"__defineSetter__",
			"hasOwnProperty",
			"__lookupGetter__",
			"__lookupSetter__",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"toString",
			"valueOf",
			"toLocaleString",
			"constructor"
		]
	return Object.keys(obj)
		.filter(
			(k)=> excl.every(e => e!==k)
		)
}
