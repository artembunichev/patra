<script setup>
	import CreateStore from "./comps/create-store.vue"
	import CreateVendor from "./comps/create-vendor.vue"
	import CreateItem from "./comps/create-item.vue"
	import VendorList from "./comps/vendor-list.vue"
	import StoreList from "./comps/store-list.vue"
	import StoreMove from "./comps/store-move.vue"
	import TempStore from "./comps/temp-store.vue"
	import HiderItems from "./comps/hiders/items/items.vue"
	import HiderHist from "./comps/hiders/hist/hist.vue"
	import HiderBuy from "./comps/hiders/buy/buy.vue"
	import HiderOrders from "./comps/hiders/orders/orders.vue"
	import Err from "./comps/err.vue"
	import {computed} from "vue"
	import {plurItem} from "./lib/plur"
	import {useState} from "./state"
	
	var state=useState()
	
	var tempStoreLength = computed(
		()=> state.tempStoreTotalLength
	)
</script>

<template>
	<h1>Patra</h1>
	<div class="nav">
		<button
			v-if="state.page === 'main'"
			@click="state.page = 'createItem'"
		>
			Новый товар
		</button>
		<button
			v-else
			@click="state.page = 'main'"
		>
			На главную
		</button>
		<button @click="state.page = 'vendorList'">
			Список поставщиков
		</button>
		<button @click="state.page = 'storeList'">
			Список складов
		</button>
		<button @click="state.page = 'tempStore'">
			{{ tempStoreLength > 0
				? `Транизитный склад (${tempStoreLength} ${plurItem(tempStoreLength)})`
				: "Транзитный склад"
			}}
		</button>
	</div>
	<CreateStore v-if="state.page === 'createStore'" />
	<CreateVendor v-if="state.page === 'createVendor'" />
	<CreateItem v-if="state.page === 'createItem'" />
	<VendorList v-if="state.page === 'vendorList'" />
	<StoreList v-if="state.page === 'storeList'"/>
	<StoreMove v-if="state.page === 'storeMove'"/>
	<TempStore v-if="state.page === 'tempStore'"/>
	<div v-if="state.page === 'main'">
		<HiderItems />
		<HiderHist />
		<HiderBuy />
		<HiderOrders />
	</div>
	<Err
		v-if="state.isError"
		:text="state.errorText"
		@close="state.clearError"
	/>
</template>

<style scoped>
	.nav {
		position: sticky;
		top: 0;
	}
</style>
