<script setup>
	import Modal from "./modal.vue"
	import TempStoreDispose from "./temp-store-dispose.vue"
	import {useState} from "../state"
	import {ref} from "vue"
	
	var state=useState()
	
	var getItemName = (id)=> {
		return state.getItemById(id).name
	}
	var getItemRemain = (id)=> {
		return state.getItemById(id).remain
	}
	
	/*********** Dispose Modal. *************/
	
	var isDisposeModalShown = ref(false)
	/*id of an item to be disposed.*/
	var disposeModalId = ref("")
	
	
	var openDisposeModal = (itemId)=> {
		isDisposeModalShown.value = true
		disposeModalId.value = itemId
	}
	
	var closeDisposeModal = ()=> {
		isDisposeModalShown.value = false
		disposeModalId.value = ""
	}
	
	/****************************************/
</script>

<template>
	<div v-if="state.actualTempStoreKeys.length > 0">
		<div>Транзитный склад</div>
		<div>
			<div v-for="itemId in state.actualTempStoreKeys">
				<div>
					{{ getItemName(itemId) }}: {{ state.tempStore[itemId] }}
				</div>
				<button @click="openDisposeModal(itemId)">Распределить</button>
			</div>
		</div>
		<Modal
			v-if="isDisposeModalShown"
		>
			<TempStoreDispose
				:id="disposeModalId"
				:remain="getItemRemain(disposeModalId)"
				@quit="closeDisposeModal"
			/>
		</Modal>
	</div>
	<div v-else>
		Транзитный склад пуст...
	</div>
	<button @click="state.page = 'main'">На главную</button>
</template>
