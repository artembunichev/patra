import { makeFullReactive } from "vue-full-reactive"
import {inject} from "vue"
import {mkId} from "./lib/id"

class State {
	constructor(){
		return makeFullReactive(this)
	}
	
	/* main or createVendor or createItem or createStore. */
	page = "main"
	
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
	
	stores=["СКЛАД1","СКЛАД2"];
	addStore(name){
		this.stores.push(name)
	}
	
	/*see `validateItemName`.*/
	validateStoreName(name) {
		return this.stores.every(
			(store)=> {
				return store !== name
			}
		)
	}
	
	vendors=["LEO","ART"];
	addVendor(name){
		this.vendors.push(name)
	}
	
	/*see `validateItemName`.*/
	validateVendorName(name) {
		return this.vendors.every(
			(vendor)=> {
				return vendor !== name
			}
		)
	}
	
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
	
	/*
		check if this name for item was already taken.
		
		true -- name is OK,
		false -- otherwise.
	*/
	validateItemName(name) {
		return this.items.every(
			(item)=> {
				return item.name !== name
			}
		)
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
}

export var state=new State;
export var useState=()=>inject("state")
