import { makeFullReactive } from "vue-full-reactive"
import {inject} from "vue"

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
	
	items=[];
	addItem({name,vendor,remain}){
		/*ADD CHECK FOR NAME.*/
		this.items.push({name,vendor,remain})
	}
}

export var state=new State;
export var useState=()=>inject("state")
