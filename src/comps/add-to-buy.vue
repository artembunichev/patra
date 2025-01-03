<script setup>
	import Modal from "./modal.vue"
	import {useState} from "../state"
	import {ref,computed} from "vue"
	
	var props = defineProps([
		/* id of an item. */
		"id"
	])
	
	var emit=defineEmits([
		/*when item is successfully added to buy list.*/
		"success",
		"cancel"
	])
	
	var state=useState()
	
		
	var name = computed(()=> {
		return state.getItemById(props.id).name
	})
	
	var amount = ref(0)
	
	var addToBuyList = ()=> {
		state.addItemToBuyList(
			props.id,
			amount.value
		)
		
		emit("success")
	}
	
	var onCancel = ()=> {
		emit("cancel")
	}
</script>

<template>
	<Modal>
		<div>Добавить товар "{{ name }}" в список закупки в кол-ве:</div>
		<input
			type="number"
			min="0"
			v-model="amount"
		/>
		<button
			:disabled="amount <= 0"
			@click="addToBuyList"
		>
			Добавить
		</button>
		<button @click="onCancel">
			Назад
		</button>
	</Modal>
</template>
