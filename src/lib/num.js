export function zerofy(num) {
	if (num < 10) {
		return `0${num}`
	}
	return `${num}`
}

export function signify(num) {
	if (num > 0) {
		return `+${num}`
	}
	else {
		return `${num}`
	}
}
