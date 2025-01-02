/*pluralize a Russian word.*/
export function plur({one, two, many}, count) {
	if (count % 100 < 10 || count % 100 > 20) {
		if (count % 10 === 1) {
			return one
		} else if (count % 10 > 0 && count % 10 < 5) {
			return two
		} else {
			return many
		}
	} else {
		return many
	}
}

export function plurItem(count) {
	return plur(
		{
			one: "товар",
			two: "товара",
			many: "товаров",
		},
		count
	)
}

export function plurRemain(count) {
	return plur(
		{
			one: "остался",
			two: "осталось",
			many: "осталось",
		},
		count
	)
}
