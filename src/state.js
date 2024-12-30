import { makeFullReactive } from "vue-full-reactive"
import {inject} from "vue"
import {mkId} from "./lib/id"
import {formatDate, formatDateShort} from "./lib/date"
import {actualKeys} from "./lib/obj"
import {exstorage} from "./lib/exstorage"

class State {
	constructor(){
		var dataFromStorage = this.exstorage.get()
		
		if (!dataFromStorage) {
			this.syncWithExstorage()
		}
		else {
			this.applyDataFromExstorage(dataFromStorage)
		}
		
		return makeFullReactive(this)
	}
	
	exstorage = exstorage
	
	applyDataFromExstorage(data) {
		/*
			version 1:
				{
					stores: this.stores,
					vendors: this.vendors,
					items: this.items,
					hist: this.hist,
					buyList: this.buyList,
					orders: this.orders,
					tempStore: this.tempStore
				}
		*/
		if (data.version === 1) {
			this.stores = data.stores
			this.vendors = data.vendors
			this.items = data.items
			this.hist = data.hist
			this.buyList = data.buyList
			this.orders = data.orders
			this.tempStore = data.tempStore
		}
	}
	
	syncWithExstorage() {
		this.exstorage.save(this.dataForExstorage)
	}
	
	get dataForExstorage() {
		return {
			stores: this.stores,
			vendors: this.vendors,
			items: this.items,
			hist: this.hist,
			buyList: this.buyList,
			orders: this.orders,
			tempStore: this.tempStore,
			version: 1,
		}
	}
	
	/*
		items
		createVendor
		createItem
		createStore
		vendorList
		storeList
		storeMove
		tempStore
		hist
		buy
		orders
	*/
	page = "items"
	
	
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
	
	
	/************** Stores. ****************/
	
	/*list of store names.*/
	stores=[];
	
	addStore(name){
		this.stores.push(name)
		this.addRecordAboutStoreInItems(name)
		
		this.syncWithExstorage()
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
		
		this.syncWithExstorage()
	}
	
	deleteStore(name) {
		this.stores = this.stores.filter(
			(store)=> {
				return store !== name
			}
		)
		this.removeRecordsAboutDeletedStore(name)
		
		this.syncWithExstorage()
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
		
		/*and also update store name in every item's `remain`.*/
		this.items.forEach(
			(item)=> {
				var remainInFrom = item.remain[from]
				delete item.remain[from]
				item.remain[to] = remainInFrom
			}
		)
		
		this.syncWithExstorage()
		
		return true
	}
	
	renameVendor(from, to) {
		if (from === to) {
			return true
		}
		
		var nameWasAlreadyTaken = this.vendors.some(
			(vendor)=> {
				return vendor === to
			}
		)
		
		if (nameWasAlreadyTaken) {
			this.setError(
				`Нельзя переименовать поставщика "${from}" в "${to}" - `
				+ `поставщик "${to}" уже существует.`
			)
			return false
		}
		
		for (var i = 0; i<this.vendors.length;++i) {
			if (this.vendors[i] === from) {
				this.vendors[i] = to
				break;
			}
		}
		
		/*update vendor name in every item used it.*/
		this.items.forEach(
			(item)=> {
				if (item.vendor === from) {
					item.vendor = to
				}
			}
		)
		
		this.syncWithExstorage()
		
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
		
		this.syncWithExstorage()
	}
	
	/*
		move all items from store `from` to `to`.
		
		returns operation success status.
	*/
	moveAllFromStore(from, to) {
		if (from === to) {
			this.setError(
				`Склад отправки и склад назначения одинаковые ("${to}").`
			)
			return false
		}
		
		this.items.forEach(
			(item)=> {
				item.remain[to] += item.remain[from];
				item.remain[from] = 0;
			}
		)
		
		this.syncWithExstorage()
		
		return true
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
		
		this.syncWithExstorage()
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
		
		var zeroObj = this.vendors.reduce(
			(acc, vendor)=> {
				acc[vendor] = 0;
				return acc;
			},
			{}
		)
		
		if (!this.items.length) {
			return zeroObj
		}
		
		return this.items.reduce(
			(acc, {vendor})=> {
				if (acc[vendor] === undefined) {
					acc[vendor] = 0;
				}
				acc[vendor]++;
				return acc;
			},
			zeroObj
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
			id: string,
			comment: string,
		}
	*/
	items=[];
	
	/*
		returns id of an newly created item.
	*/
	addItem({name,vendor,remain, comment}){
		var id = mkId()
		
		this.items.push(
			{
				name,vendor,remain,comment,
				id: id
			}
		)
		
		this.syncWithExstorage()
		
		return id
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
		
		this.syncWithExstorage()
		
		return true
	}
	
	editItemVendor(id, vendor) {
		var item = this.getItemById(id)
		
		item.vendor = vendor
		
		this.syncWithExstorage()
	}
	
	editItemComment(id, comment) {
		var item = this.getItemById(id)
		
		item.comment = comment
		
		this.syncWithExstorage()
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
		
		var oldRemain = item.remain[store]
		
		/*since `item` is object, then it points to actual record.*/
		item.remain[store] = newRemain
		
		var diff = newRemain - oldRemain
		
		this.histCommit({
			when: new Date,
			itemName: item.name,
			store: store,
			diff: diff
		})
		
		if (diff < 0) {
			this.addItemToBuyList(itemId, -diff)
		}
		
		this.syncWithExstorage()
		
		return true
	}
	
	deleteItem(id) {
		this.items = this.items.filter(
			({id: itemId})=> {
				return itemId !== id
			}
		)
		
		this.syncWithExstorage()
	}
	
	getItemById(id) {
		return this.items.find(({id: itemId}) => id == itemId)
	}
	
	/*a total amount of items amongst all the store.*/
	getItemTotalRemain(id) {
		var item = this.getItemById(id)
		return Object.keys(item.remain).reduce(
			(acc,store)=> {
				return acc += item.remain[store]
			},
			0
		)
	}
	
	/*a total amount of this items amongst all the orders.*/
	getItemAmountInTheOrders(id) {
		return this.orders.reduce(
			(acc, order)=> {
				/*filter out completed orders.*/
				if (order.status) {
					return acc
				}
				
				Object.keys(order.items).forEach(
					(itemId)=> {
						if (id === itemId) {
							acc += order.items[itemId]
						}
					}
				)
				return acc
			},
			0
		)
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
				var regex = new RegExp(this.searchPattern, "i")
				return name.match(regex)
			}
		)
	}
	
	/***************** Hist. ***********************/
	
	/*
		list of objects: {
			**formatted string:
			**	<day>.<mon>.<fullyear> <0h>:<0m>:<0sec>
			when: string,
			itemName: string,
			store: string,
			diff: number
		}
	*/
	hist = []
	
	get histReversed() {
		return this.hist.slice().reverse()
	}
	
	/*
		the same item structure as in `hist`, but
		in `when` we pass the `Date` object and here
		we format it.
	*/
	histCommit({when: date,itemName, store, diff}) {
		this.hist.push({
			when: formatDate(date),
			itemName: itemName,
			store: store,
			diff: diff
		})
		
		this.syncWithExstorage()
	}
	
	/*********************************************/
	
	
	/**************  Buy List. **************/
	
	/*
		has a structure like:
			{
				**
					we can get a vendor name from item (by id),
					so we don't need to store is as a field.
				**
				<item_id>: count
			}
	*/
	buyList = {}
	
	get actualBuyListKeys() {
		return actualKeys(this.buyList)	
	}
	
	addItemToBuyList(itemId, diff) {
		if (this.buyList[itemId] === undefined) {
			this.buyList[itemId] = 0
		}
		
		var oldCount = this.buyList[itemId]
		var newCount = oldCount + diff
		
		if (newCount === 0) {
			this.removeItemFromBuyList(itemId)
			return
		}
		
		this.buyList[itemId] = newCount
		
		this.syncWithExstorage()
	}
	
	removeItemFromBuyList(itemId) {
		delete this.buyList[itemId]
		
		this.syncWithExstorage()
	}
	
	/*
		returns a structure like:
			{
				<vendor_name>: {
					<item_id>: count
				}
			}
		
		it's easier to render having structure like this,
		than one as pure `buyList`.
	*/
	get buyListByVendors() {
		return this.actualBuyListKeys
			.reduce(
				(acc, itemId)=> {
					var item = this.getItemById(itemId)
					
					if (acc[item.vendor] === undefined) {
						acc[item.vendor] = {}
					}
					
					acc[item.vendor][itemId] = this.buyList[itemId]
					return acc
				},
				{}
			)
	}
	
	editBuyListItemCount(itemId, count) {
		if (count < 0) {
			this.setError(
				"Кол-во товаров не может быть меньше нуля."
			)
			return false
		}
		
		if (count === 0) {
			this.removeItemFromBuyList(itemId)
			return true
		}
		
		this.buyList[itemId] = count
		
		this.syncWithExstorage()
		
		return true
	}
	
	/****************************************/
	
	
	/*************** Orders. ****************/
	
	/*
		a list of structures:
		{
			id: string
			vendor: string
			** ordered items (ids) and their count. **
			items: {
				<id>: count
				...
			}
			** a string of a format: `<0d>.<0m>.<y>`. **
			when: string
			** whether or not an order is complete. **
			status: boolean
		}
	*/
	orders = []
	
	/*
		first reverse the orders and the sort them
		by `status` field - put uncompleted orders first.
	*/
	get ordersReversedAndSorted() {
		return this.orders.slice().reverse().sort(
			(a,b)=> {
				return a.status - b.status
			}
		)
	}
	
	/*		
		we don't need to take a `status` 'cause it's
		going to be `false` at the begining.
		
		`when` will be set here too,
		
		and `id` we also generate.
	*/
	makeAnOrder({vendor, items}) {
		var when = formatDateShort(new Date())
		
		this.orders.push({
			id: mkId(7),
			vendor: vendor,
			items: items,
			when: when,
			status: false,
		})
		
		/*
			It's important to delete these items
			from buy list.
		*/
		Object.keys(items).forEach(
			(itemId)=> {
				this.removeItemFromBuyList(itemId)
			}
		)
		
		this.syncWithExstorage()
	}
	
	/*
		takes order id.
		actually, it doensn't delete the order as is, but
		move all the items from it back to the buy
		list (adding them to other items are possibly
		in there already).
	*/
	cancelOrder(id) {
		var order = this.getOrderById(id)
		
		/*well, we do delete the order from order list.*/
		this.orders = this.orders.filter(
			(o)=> {
				return o.id !== id
			}
		)
		
		/*and then put it back in buy list (all the items in it).*/
		Object.keys(order.items).forEach(
			(itemId)=> {
				if (this.buyList[itemId] === undefined) {
					this.buyList[itemId] = 0
				}
				this.buyList[itemId] += order.items[itemId]
			}
		)
		
		this.syncWithExstorage()
	}
	
	/*
		we mark the order as completed and move
		all the items (copy actually, they're still
		in the order object) to the temporary storage
		(see `tempStore`).
	*/
	completeOrder(id) {
		var order = this.getOrderById(id)
		
		/* remember, `order` is a struct, so can modify it. */
		order.status = true
		
		/*now put items in the temporary storage.*/
		Object.keys(order.items).forEach(
			(itemId)=> {
				this.addItemToTempStore(
					itemId, order.items[itemId]
				)
			}
		)
		
		this.syncWithExstorage()
	}
	
	editOrderItemRemain(orderId, itemId, count) {
		if (count < 0) {
			this.setError(
				"Кол-во товаров в заказе не может быть"
				+ " меньше нуля."
			)
			return false
		}
		
		const order = this.getOrderById(orderId)
		
		order.items[itemId] = count
		
		this.syncWithExstorage()
		
		return true
	}
	
	getOrderById(id) {
		return this.orders.find(o => o.id === id)
	}
	
	/****************************************/
	
	
	/********* Temporary Store. ***************/
	
	/*
		This is a temporary (virtual) storage, where all the
		items go after the order is complete.
		
		it's a structure like that:
			{
				<item_id>: amount
				...
			}
		
		this storage has a separated page, where
		you can dispose this items across the real stores.
		
		items in it are NOT listed in `items` field,
		so they would not appear in "items" page so to speak.
	*/
	tempStore = {}
	
	get actualTempStoreKeys() {
		return actualKeys(this.tempStore)
	}
	
	/*an amount of all the items in the temp storage.*/
	get tempStoreTotalLength() {
		return this.actualTempStoreKeys.reduce(
			(acc, itemId)=> {
				return acc += this.tempStore[itemId]
			},
			0
		)
	}
	
	addItemToTempStore(itemId, amount) {
		if (amount <= 0) {
			return
		}
		
		if (this.tempStore[itemId] === undefined) {
			this.tempStore[itemId] = 0
		}
		this.tempStore[itemId] += amount
		
		this.syncWithExstorage()
	}
	
	/*
		remove item this amount of item from temp
		store and put it in a particular real storage.
	*/
	disposeTempStoreItem(itemId, amount, store) {
		/*item from the `items`.*/
		var realItem = this.getItemById(itemId)
		if (!realItem) {
			return
		}
		
		/* remove from temp store. */
		this.tempStore[itemId] -= amount
		if (this.tempStore[itemId] === 0) {
			delete this.tempStore[itemId]
		}
		
		/*
			add to real store.
			`realItem` is a struct, so can edit it directly.
		*/
		realItem.remain[store] += amount
		
		this.histCommit({
			when: new Date,
			itemName: realItem.name,
			store: store,
			diff: amount,
		})
		
		this.syncWithExstorage()
	}
	
	getAmountOfItemInTempStore(itemId) {
		var amount = this.tempStore[itemId]
		if (amount === undefined) {
			return 0
		}
		
		return amount
	}
	
	/******************************************/
}

export var state=new State;
export var useState=()=>inject("state")
