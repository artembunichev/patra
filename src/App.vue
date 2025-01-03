<script setup>
	import CreateStore from "./comps/pages/create-store/create-store.vue"
	import CreateVendor from "./comps/pages/create-vendor/create-vendor.vue"
	import CreateItem from "./comps/pages/create-item/create-item.vue"
	import VendorList from "./comps/pages/vendor-list/vendor-list.vue"
	import StoreList from "./comps/pages/store-list/store-list.vue"
	import StoreMove from "./comps/pages/store-move/store-move.vue"
	import TempStore from "./comps/pages/temp-store/temp-store.vue"
	import Items from "./comps/pages/items/items.vue"
	import ItemsSearch from "./comps/pages/items/search.vue"
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
	<div class="app">
		<div class="nav">
			<div class="nav-btns">
				<button
					class="nav-btn"
					v-if="state.page === 'items'"
					@click="state.page = 'createItem'"
				>
					Новый товар
				</button>
				<button
					v-else
					class="nav-btn"
					@click="state.page = 'items'"
				>
					Список товаров
				</button>
				<button class="nav-btn" @click="state.page = 'vendorList'">
					Список поставщиков
				</button>
				<button class="nav-btn" @click="state.page = 'storeList'">
					Список складов
				</button>
				<button class="nav-btn" @click="state.page = 'tempStore'">
					{{ tempStoreLength > 0
						? `Транизитный склад (${tempStoreLength} ${plurItem(tempStoreLength)})`
						: "Транзитный склад"
					}}
				</button>
				<button class="nav-btn" @click="state.page = 'hist'">История</button>
				<button class="nav-btn" @click="state.page = 'buy'">Закупка</button>
				<button class="nav-btn" @click="state.page = 'orders'">Заказы</button>
			</div>
			
			<ItemsSearch
				v-if="state.page === 'items'"
			/>
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
	</div>
</template>

<style>
	
	* {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		box-sizing: border-box;
	}
	
	hmtl, body {
		padding: 0;
		margin: 0;
	}
	
	.app {
		padding: 10px;
	}
	
	.nav {
		position: sticky;
		top: 0;
		width: 100%;
		background: #fff;
	}
	
	.nav-btns {
		margin-bottom: 10px;
	}
	
	.nav {
		margin-bottom: 5px;
	}
	
	button {
		outline: none;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
	
	.nav-btn {
		padding: 5px;
		border: 1px solid #ffb446;
		background: #fffebc;
		margin-right: 8px;
	}
	
	.icon-btn {
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		display:flex;
		justify-content: center;
		align-items: center;
		width: 25px;
		height: 25px;
	}
	
	img
	{
		user-drag: none;
		-webkit-user-drag: none;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	
	.icon-btn img {
		width: 18px;
		height: 18px;
	}
</style>
