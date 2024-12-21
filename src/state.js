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
	stores=["СКЛАД1","СКЛАД2"];
	addStore(name){
		this.stores.push(name)
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
	
	/*************************************/
	
	
	/************** Vendors. ****************/
	
	/*list of vendor names.*/
	vendors=["LEO","ART"];
	
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
