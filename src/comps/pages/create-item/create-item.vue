<script setup>
	import Create from "../../create.vue"
	import Modal from "../../modal.vue"
	import AddToBuyModal from "../../add-to-buy.vue"
	import {ref, reactive} from "vue"
	import {useState} from "../../../state"
	
	var state=useState()
	
	var name=ref("")
	var vendor=ref("")
	var remain = reactive({})
	/*
		it is generated on item create and used
		for add-to-buy modal.
	*/
	var itemId = ref("")
	
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
	
	var reset = ()=> {
		name.value=""
		vendor.value=""
		comment.value = ""
		itemId.value = ""
		
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
	
	var isDoneModalShown = ref(false)
	
	var openDoneModal = ()=> {
		isDoneModalShown.value = true
	}
	var closeDoneModal = ()=> {
		isDoneModalShown.value = false
		reset()
	}
	
	var isAddToBuyModalShown = ref(false)
	
	var openAddToBuyModal = ()=> {
		isDoneModalShown.value = false
		isAddToBuyModalShown.value = true
	}
	
	var closeAddToBuyModal = ()=> {
		isAddToBuyModalShown.value = false
		reset()
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
					comment: comment.value,
				}
			)
		) {
			return
		}
		
		/*save the generated id for item.*/
		itemId.value = state.addItem({
			name: name.value,
			vendor:vendor.value,
			remain,
			comment: comment.value,
		})
		
		openDoneModal()
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
	
	<Modal
		v-if="isDoneModalShown"
	>
		Товар {{ name }} успешно создан.
		<button
			@click="openAddToBuyModal"
		>
			Добавить в закупку
		</button>
		<button @click="closeDoneModal">ОК</button>
	</Modal>
	
	<AddToBuyModal
		v-if="isAddToBuyModalShown"
		:id="itemId"
		@success="closeAddToBuyModal"
		@cancel="closeAddToBuyModal"
	/>
</template>
