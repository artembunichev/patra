<script setup>
	import Create from "./create.vue"
	import {ref, reactive} from "vue"
	import {useState} from "../state"
	
	var state=useState()
	
	var name=ref("")
	var vendor=ref("")
	var remain = reactive({})
	
	function reset() {
		name.value=""
		vendor.value=""
		
		remain = state.stores.reduce(
			(acc, storeName)=> {
				acc[storeName] = 0;
				return acc
			},
			{}
		)
	}
	
	reset()
	
	var create =()=> {
		state.addItem({name: name.value,vendor:vendor.value,remain})
		reset()
	}
	
</script>

<template>
	<h2>
		Создать товар
	</h2>
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
</template>
