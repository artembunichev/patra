import {zerofy} from "./num"

/*
	takes a `Date` object.
	returns a `<0day>.<0mon>.<fullyear> <0h>:<0m>:<0sec>` string.
*/
export function formatDate(date) {
	var day = zerofy(date.getDate())
	var month = zerofy(date.getMonth())
	var year = date.getFullYear()
	var hour = zerofy(date.getHours())
	var min = zerofy(date.getMinutes())
	var sec = zerofy(date.getSeconds())
	return `${day}.${month}.${year} ${hour}:${min}:${sec}`
}

/*
	returns a string: `<0d>.<0m>.<y>`.
*/
export function formatDateShort(date) {
	var day = zerofy(date.getDate())
	var month = zerofy(date.getMonth())
	var year = date.getFullYear()
	
	return `${day}.${month}.${year}`
}
