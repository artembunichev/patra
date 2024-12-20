<script setup>
	import Create from "./create.vue"
	import {reactive,computed} from "vue"
	import {useState} from "../state"
	
	var state=useState()
	var name=""
	var vendor=""
	
	var remain = state.stores.reduce(
		(acc, storeName)=> {
			acc[storeName] = 0;
			return acc
		},
		{}
	)
	
	var create =()=> {
		state.addItem({name,vendor,remain})
	}
	
</script>

<template>
	<div>------------- CREATE ITEM BEGINING --------------</div>
	<div>
		Создать товар
	</div>
	<div>
		<input v-model="name" />
	</div>
	<div>
		<select v-model="vendor">
		<option v-for="vendor in state.vendors" :value="vendor">
			{{ vendor }}
		</option>
		</select>
	</div>
	<div v-for="store in state.stores">
		<span>{{ store }}:</span>
		<input v-model="remain[store]" />
	</div>
	<button @click="create">СОЗДАТЬ ТОВАР!</button>
	<button @click="state.page = 'main'">На главную</button>
	<div>------------- CREATE ITEM END --------------</div>
</template>
