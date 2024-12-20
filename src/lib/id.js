export function mkId(len=15) {
	var result = ""
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	var charactersLength = characters.length
	var counter = 0
	while (counter < len) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		)
		counter += 1
	}
	return result
}
