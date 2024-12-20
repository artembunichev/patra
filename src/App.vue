<script setup>
	import CreateStore from "./comps/create-store.vue"
	import CreateVendor from "./comps/create-vendor.vue"
	import CreateItem from "./comps/create-item.vue"
	import HiderItems from "./comps/hiders/items.vue"
	import HiderHist from "./comps/hiders/hist.vue"
	import HiderBuy from "./comps/hiders/buy.vue"
	import HiderOrders from "./comps/hiders/orders.vue"
	import {useState} from "./state"
	
	var state=useState()
</script>

<template>
	<h1>Patra</h1>
	<button @click="state.page = 'createItem'">
		Новый товар
	</button>
	<button @click="state.page = 'createStore'">
		Новый склад
	</button>
	<button @click="state.page = 'createVendor'">
		Новый поставщик
	</button>
	<CreateStore v-if="state.page === 'createStore'" />
	<CreateVendor v-if="state.page === 'createVendor'" />
	<CreateItem v-if="state.page === 'createItem'" />
	<div v-if="state.page === 'main'">
		<HiderItems :isInitiallyShown="false" />
		<HiderHist :isInitiallyShown="false"/>
		<HiderBuy :isInitiallyShown="false"/>
		<HiderOrders :isInitiallyShown="false"/>
	</div>
</template>
