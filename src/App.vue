<script setup>
	import CreateStore from "./comps/pages/create-store/create-store.vue"
	import CreateVendor from "./comps/pages/create-vendor/create-vendor.vue"
	import CreateItem from "./comps/pages/create-item/create-item.vue"
	import VendorList from "./comps/pages/vendor-list/vendor-list.vue"
	import StoreList from "./comps/pages/store-list/store-list.vue"
	import StoreMove from "./comps/pages/store-move/store-move.vue"
	import TempStore from "./comps/pages/temp-store/temp-store.vue"
	import Items from "./comps/pages/items/items.vue"
	import Hist from "./comps/pages/hist/hist.vue"
	import Buy from "./comps/pages/buy/buy.vue"
	import Orders from "./comps/pages/orders/orders.vue"
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
			v-if="state.page === 'items'"
			@click="state.page = 'createItem'"
		>
			Новый товар
		</button>
		<button
			v-else
			@click="state.page = 'items'"
		>
			Список товаров
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
		<button @click="state.page = 'hist'">История</button>
		<button @click="state.page = 'buy'">Закупка</button>
		<button @click="state.page = 'orders'">Заказы</button>
	</div>
	<CreateStore v-if="state.page === 'createStore'" />
	<CreateVendor v-if="state.page === 'createVendor'" />
	<CreateItem v-if="state.page === 'createItem'" />
	<VendorList v-if="state.page === 'vendorList'" />
	<StoreList v-if="state.page === 'storeList'"/>
	<StoreMove v-if="state.page === 'storeMove'"/>
	<TempStore v-if="state.page === 'tempStore'"/>
	<Items v-if="state.page === 'items'" />
	<Hist v-if="state.page === 'hist'" />
	<Buy v-if="state.page === 'buy'" />
	<Orders v-if="state.page === 'orders'" />
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
