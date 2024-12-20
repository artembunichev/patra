<script setup>
	import {useState} from "../../../state"
	import {ref} from "vue"
	import Hider from "../../hider.vue"
	import Confirm from "../../confirm.vue"
	
	var props = defineProps([
		"id",
		"name",
		"vendor",
		"remain"
	])
	var state = useState();
	
	var isConfirmDeleteModalShown = ref(false)
	
	var confirmDeleteItem = ()=> {
		isConfirmDeleteModalShown.value = true
	}
	
	var closeConfirmDeleteItemModal = ()=> {
		isConfirmDeleteModalShown.value = false
	}
	
	var doDeleteItem = ()=> {
		state.deleteItem(props.id)	
		closeConfirmDeleteItemModal()
	}
	
	var doNotDeleteItem = ()=> {
		closeConfirmDeleteItemModal()
	}
	
</script>

<template>
	<div>
		<span>{{ name }}</span>
		<button @click="confirmDeleteItem">УДАЛИТЬ</button>
		<Confirm
			v-if="isConfirmDeleteModalShown"
			:prompt="`Ты реально хочешь удалить ${name}?`"
			@yes="doDeleteItem"
			@no="doNotDeleteItem"
		/>
	</div>
	<div>Поставщик: {{ vendor }}</div>
	<div>
		<div v-for="(remainCount,store) in remain">
			<span>{{ store }}: {{ remainCount }}шт.</span>
		</div>
	</div>
</template>
