<script setup>
	import Create from "./create.vue"
	import {ref, reactive} from "vue"
	import {useState} from "../state"
	
	var state=useState()
	
	var name=ref("")
	var vendor=ref("")
	var remain = reactive({})
	
	var comment = ref("")
	var normalizeComment = ()=> {
		comment.value = comment.value.trim()
	}
	
	var doWeHaveStores = state.stores.length > 0
	var doWeHaveVendors = state.vendors.length > 0
	
	/*
		whether or not the "create" button will be disabled.
	*/
	var isCreateAllowed = doWeHaveStores && doWeHaveVendors
	
	function reset() {
		name.value=""
		vendor.value=""
		comment.value = ""
		
		remain = state.stores.reduce(
			(acc, storeName)=> {
				acc[storeName] = 0;
				return acc
			},
			{}
		)
	}
	
	reset()
	
	var normalizeName = ()=> {
		name.value = name.value.trim()
	}
	
	var createItem =()=> {
		normalizeName()
		normalizeComment()
		
		/* Validate the form. */
		if (
			!state.validateItemForm(
				{
					name: name.value,
					vendor: vendor.value,
					remain: remain,
					comment: comment,
				}
			)
		) {
			return
		}
		
		state.addItem({
			name: name.value,
			vendor:vendor.value,
			remain,
			comment,
		})
		reset()
	}
	
	var handleKeypress = (e)=> {
		/*Enter key.*/
		if (e.keyCode == 13) {
			createItem()
		}
	}
	
</script>

<template>
	<h2>
		Создать товар
	</h2>
	
	<div>
		<input
			v-model="name"
			@blur="normalizeName"
			@keypress="handleKeypress"
		/>
	</div>
	
	<div v-if="doWeHaveVendors">
		<select v-model="vendor">
		<option v-for="vendor in state.vendors" :value="vendor">
			{{ vendor }}
		</option>
		</select>
	</div>
	<div v-else>
		Ещё нет созданных поставщиков.
		<button @click="state.page = 'createVendor'">
			Создать поставщика
		</button>
	</div>
	
	<div v-if="doWeHaveStores">
		<div v-for="store in state.stores">
			<span>{{ store }}:</span>
			<input
				type="number"
				v-model="remain[store]"
			/>
		</div>
	</div>
	<div v-else>
		Ещё нет созданных складов.
		<button @click="state.page = 'createStore'">
			Создать склад
		</button>
	</div>
	
	<div>
		<textarea
			placeholder="Комментарий"
			v-model="comment"
			@blur="normalizeComment"
		></textarea>
	</div>
	
	<button
		:disabled="!isCreateAllowed"
		@click="createItem"
	>
		СОЗДАТЬ ТОВАР!
	</button>
	
	<button @click="state.page = 'main'">На главную</button>
</template>
