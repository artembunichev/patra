import { makeFullReactive } from "vue-full-reactive"
import {inject} from "vue"
import {mkId} from "./lib/id"

class State {
	constructor(){
		return makeFullReactive(this)
	}
	
	/*
		main
		createVendor
		createItem
		createStore
		vendorList
		storeList
		storeMove
	*/
	page = "main"
	
	
	/************** Errors. **************/
	
	isError = false
	
	/*will be shown in error modal window.*/
	errorText = ""
	
	setError(cause) {
		this.isError = true
		this.errorText = cause
	}
	
	clearError() {
		this.isError = false
		this.errorText = ""
	}
	
	/************************************/
	
	
	/************* Hiders. ****************/
	
	/*
		whether or not a content of this particular
		hider is visible.
	*/
	hiderStates = {
		items: false,
		hist: false,
		buy: false,
		orders: false, 
	}
	
	/**************************************/
	
	
	/************** Stores. ****************/
	
	/*list of store names.*/
	stores=[];
	
	addStore(name){
		this.stores.push(name)
		this.addRecordAboutStoreInItems(name)
	}
	
	/*
		when we create a new store, we want to add
		an info about it for every item was created
		before this store exists.
	*/
	addRecordAboutStoreInItems(store) {
		this.items.forEach(
			(item)=> {
				item.remain[store] = 0
			}
		)
	}
	
	deleteStore(name) {
		this.stores = this.stores.filter(
			(store)=> {
				return store !== name
			}
		)
		this.removeRecordsAboutDeletedStore(name)
	}
	
	/*
		rename the store from `from` to `to`.
		
		returns boolean depending on whether or
		not the rename operation was success.
	*/
	renameStore(from, to) {
		if (from === to) {
			return true
		}
		
		var nameWasAlreadyTaken = this.stores.some(
			(store)=> {
				return store === to
			}
		)
		
		if (nameWasAlreadyTaken) {
			this.setError(
				`Нельзя переименовать склад "${from}" в "${to}" - `
				+ `склад "${to}" уже существует. Может, ты хотел `
				+ `переместить товары со склада "${from}" на "${to}"?`
			)
			return false
		}
		
		/*Actual renaming.*/
		for (var i = 0; i<this.stores.length;++i) {
			if (this.stores[i] === from) {
				this.stores[i] = to
				break;
			}
		}
		
		/*and also update store name in every item.*/
		this.items.forEach(
			(item)=> {
				var remainInFrom = item.remain[from]
				delete item.remain[from]
				item.remain[to] = remainInFrom
			}
		)
		
		return true
	}
	
	/*
		we want to clean all the traces of deleted
		store that linger around in the item's `remain` object.
	*/
	removeRecordsAboutDeletedStore(store) {
		this.items.forEach(
			(item)=> {
				delete item.remain[store]
			}
		)
	}
	
	/*
		move all items from store `from` to `to`.
	*/
	moveAllFromStore(from, to) {
		if (from === to) {
			this.setError(
				`Склад отправки и склад назначения одинаковые ("${to}").`
			)
			return
		}
		
		this.items.forEach(
			(item)=> {
				item.remain[to] += item.remain[from];
				item.remain[from] = 0;
			}
		)
	}
	
	/*see `validateItemName`.*/
	validateStoreName(name) {
		if (!name) {
			this.setError(
				`Не указано название для склада.`
			)
			return false
		}
		
		var isNOTTaken = this.stores.every(
			(store)=> {
				return store !== name
			}
		)
		
		if (!isNOTTaken) {
			this.setError(
				`Склад с названием "${name}" уже существует.`
			)
		}
		
		return isNOTTaken
	}
	
	/*
		how many items every particular store places accumulatively.
		{
			<store name>: <total number of items>
		}
	*/
	get storeItemStats() {
		if (!this.items.length) {
			return this.stores.reduce(
				(acc, store)=> {
					acc[store] = 0
					return acc
				},
				{}
			)
		}
		
		return this.items.reduce(
			(acc, {remain})=> {
				Object.keys(remain).forEach(
					(store)=> {
						if (acc[store] === undefined) {
							acc[store] = 0
						}
						acc[store] += remain[store]
					}
				)
				return acc
			},
			{}
		)
	}
	
	/*************************************/
	
	
	/************** Vendors. ****************/
	
	/*list of vendor names.*/
	vendors=[];
	
	addVendor(name){
		this.vendors.push(name)
	}
	
	/*
		see `validateItemName`.
		
		this method is used for vendor-create form only.
	*/
	validateVendorName(name) {
		if (!name) {
			this.setError(
				"Не указано название для поставщика."
			)
			return false
		}
		
		var isNOTTaken = this.vendors.every(
			(vendor)=> {
				return vendor !== name
			}
		)
		
		if (!isNOTTaken) {
			this.setError(
				`Поставщик с названием "${name}" уже существует.`
			)
		}
		
		return isNOTTaken
	}
	
	/*
		how much items are provided by vendors.
		{
			<vendor>: <number of items>
		}
	*/
	get vendorItemStats() {
		if (!this.items.length) {
			return this.vendors.reduce(
				(acc, vendor)=> {
					acc[vendor] = 0;
					return acc;
				},
				{}
			)
		}
		
		return this.items.reduce(
			(acc, {vendor})=> {
				if (acc[vendor] === undefined) {
					acc[vendor] = 0;
				}
				acc[vendor]++;
				return acc;
			},
			{}
		)
	}
	
	/****************************************/
	
	
	/*************** Items.  **************/
	/*
		item: {
			name: string,
			vendor: string
			remain: {
				<storage>: remainNumber,
				...
			},
			id: string
		}
	*/
	items=[];
	
	addItem({name,vendor,remain}){
		this.items.push(
			{
				name,vendor,remain,
				id: mkId()
			}
		)
	}
	
	validateItemVendor(vendor) {
		if (!vendor) {
			this.setError("Не указан поставщик.")
			return false
		}
		return true
	}
	
	/*
		check passed item name for validity and show error
		modals in case of errors.
		
		true -- name is OK,
		false -- otherwise.
	*/
	validateItemName(name) {
		if (!name) {
			this.setError(
				"Не указано название товара."
			)
			
			return false
		}
		
		var isNOTTaken = this.items.every(
			(item)=> {
				return item.name !== name
			}
		)
		
		if (!isNOTTaken) {
			this.setError(
				`Товар с названием "${name}" уже существует.`
			)
		}
		
		return isNOTTaken
	}
	
	/*
		remain: {
				<storage>: remainNumber,
				...
			}
	*/
	validateItemRemain(remain) {
		var areAllNumbersPositive = (
			Object.values(remain).every(
				(remainNum)=> {
					return remainNum >= 0
				}
			)
		)
		
		if (!areAllNumbersPositive) {
			this.setError("Кол-во остатков не может быть отрицательным.")
		}
		
		return areAllNumbersPositive
	}
	
	/*
		takes: {
			name: string
			vendor: string
			remain: Remain
		}
	*/
	validateItemForm({name, vendor, remain}) {		
		return (
			this.validateItemName(name)
			&& this.validateItemVendor(vendor)
			&& this.validateItemRemain(remain)
		)
	}
	
	/*
		sets name to `newName` for item with id `id`.
		validates it first and maybe shows error modal.
		
		returns `true` name was finally changed,
		otherwise -- `false`.
	*/
	editItemName(id, newName) {
		if (newName === "") {
			return false
		}
		
		var isNameTaken = this.items.some(
			(item)=> {
				return (
					item.id !== id
					&& item.name === newName
				)
			}
		)
		if (isNameTaken) {
			this.setError(
				`Товар с названием ${newName} уже существует.`
			)
			return false
		}
		
		var itemIdx = this.items.findIndex(
			(item)=> item.id === id
		)
		
		this.items[itemIdx].name = newName
		
		return true
	}
	
	/*
		returns the status of operation success.
	*/
	editItemRemain(itemId, store, newRemain) {
		var item = this.getItemById(itemId)
		
		if (newRemain < 0) {
			this.setError(
				"Остаток не может быть отрицательным ("
				+ `попытка записать значение ${newRemain}).`
			)
			return false
		}
		
		/*since `item` is object, then it points to actual record.*/
		item.remain[store] = newRemain
		
		return true
	}
	
	deleteItem(id) {
		this.items = this.items.filter(
			({id: itemId})=> {
				return itemId !== id
			}
		)
	}
	
	getItemById(id) {
		return this.items.find(({id: itemId}) => id == itemId)
	}
	
	
	/*helps to compute a `filteredItems`.*/
	searchPattern = ""
	
	/*
		there are items, which are shown in the
		items hider, because it contains a search bar.
	*/
	get filteredItems() {
		return this.items.filter(
			({name})=> {
				var regex = new RegExp(this.searchPattern)
				return name.match(regex)
			}
		)
	}
	
	/*********************************************/
}

export var state=new State;
export var useState=()=>inject("state")
