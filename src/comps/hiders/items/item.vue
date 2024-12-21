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
	
	/************* Edit Name. *****************/
	var isEditNameMode = ref(false)
	var activateEditNameMode = ()=> {
		isEditNameMode.value = true
	}
	var deactivateEditNameMode = ()=> {
		isEditNameMode.value = false
		editedName.value = props.name;
	}
	var editedName = ref(props.name);
	
	var tryChangeItemName = ()=> {
		if (state.editItemName(props.id, editedName.value)) {
			deactivateEditNameMode()
		}
	}
	/*****************************************/
	
</script>

<template>
	<div class="block">
		<div v-if="isEditNameMode">
			<input
				v-model="editedName"
			/>
			<button @click="tryChangeItemName">ОК</button>
			<button @click="deactivateEditNameMode">ОТМ</button>
		</div>
		<div v-else>
			<span>{{ name }}</span>
			<button @click="activateEditNameMode">РЕД</button>
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
	</div>
</template>


<style scoped>
	.block {
		border: 1px solid #000;
		margin-bottom: 10px;
		background-color: #b5b5b54f;
		padding: 5px;
	}
</style>
