import { makeFullReactive } from "vue-full-reactive"
import {inject} from "vue"
import {mkId} from "./lib/id"

class State {
	constructor(){
		return makeFullReactive(this)
	}
	
	/* main or createVendor or createItem or createStore. */
	page = "main"
	
	stores=["СКЛАД1","СКЛАД2"];
	addStore(name){
		this.stores.push(name)
	}
	
	vendors=["LEO","ART"];
	addVendor(name){
		this.vendors.push(name)
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
		/*ADD CHECK FOR NAME.*/
		this.items.push(
			{
				name,vendor,remain,
				id: mkId()
			}
		)
		console.log(this.items)
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
