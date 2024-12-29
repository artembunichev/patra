export class ExstorageLS {	
	save(data) {
		var str = JSON.stringify(data)
		localStorage.setItem(this.key, str)
	}
	get() {
		return JSON.parse(
			localStorage.getItem(this.key)
		)
	}
}

export var exstorageLS = new ExstorageLS
