export function isNative() {
	var userAgent = navigator.userAgent.toLocaleLowerCase()
	return userAgent.includes( ' electron/' )
}
