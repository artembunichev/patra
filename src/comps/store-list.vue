<script setup>
	import Confirm from "./confirm.vue"
	import {useState} from "../state"
	import {plurItem} from "../lib/plur"
	import {ref} from "vue"
	
	var state=useState()
	
	var isDeleteConfirmShown = ref(false)
	var storeToDelete = ""
	var deletePrompt = ref("")
	
	var showDeleteConfirm = (store)=> {
		isDeleteConfirmShown.value = true
		storeToDelete = store
		deletePrompt.value = `Реально хотим удалить склад "${store}"?`
	}
	
	var closeDeleteConfirm = ()=> {
		isDeleteConfirmShown.value = false
		storeToDelete = ""
		deletePrompt.value = ""
	}
	
	var confirmDelete = (store)=> {
		if (state.storeItemStats[store] > 0) {
			state.setError(
				`Нельзя удалить склад "${store}", т.к. на нём числятся товары.`
				+ " Сначала перенеси эти товары на другой склад."
			)
			return
		}
		
		showDeleteConfirm(store)
	}
	
	var doDelete = ()=> {
		state.deleteStore(storeToDelete)
		closeDeleteConfirm()
	}
	
</script>

<template>
	<div class="title">Список складов</div>
	<button @click="state.page = 'main'">На главную</button>
	<div v-if="state.stores.length > 0">
		<ul>
			<li v-for="(totalItems, store) in state.storeItemStats">
				<div>
					{{ store }}: {{ totalItems }} {{ plurItem(totalItems) }}.
				</div>
				<button @click="confirmDelete(store)">УДАЛИТЬ</button>
			</li>
		</ul>
		<Confirm
			v-if="isDeleteConfirmShown"
			:prompt="deletePrompt"
			@yes="doDelete"
			@no="closeDeleteConfirm"
		/>
		<button
			v-if="state.stores.length > 1"
			@click="state.page = 'storeMove'"
		>
			Перемещение по складам
		</button>
	</div>
	<div v-else>
		Складов пока нет...
		<button @click="state.page = 'createStore'">
			Создать склад
		</button>
	</div>
</template>
