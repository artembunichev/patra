<script setup>
	import Confirm from "../../confirm.vue"
	import {useState} from "../../../state"
	import {plurItem} from "../../../lib/plur"
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
	
	
	/*
		this is a name of current store under editing.
		"" if no stores are edited right now.
		
		it's also an original name of a store.
	*/
	var editModeForStore = ref("")
	
	/*
		value in input of edited store.
		
		it's a new name for a store.
	*/
	var editedStoreValue = ref("")
	
	var activateEditMode = (store)=> {
		editModeForStore.value = store
		editedStoreValue.value = store
	}
	var quitEditMode = ()=> {
		editModeForStore.value = ""
		editedStoreValue.value = ""
	}
	
	var normalizeEditedStoreValue = ()=> {
		editedStoreValue.value = editedStoreValue.value.trim()
	}
	
	var isRenameConfirmShown = ref(false)
	var renameConfirmPrompt = ref("")
	var showRenameConfirm = ()=> {
		/*if we didn't actually edit the name.*/
		if (editModeForStore.value === editedStoreValue.value) {
			tryToRenameStore()
			return
		}
		
		isRenameConfirmShown.value = true
		renameConfirmPrompt.value = (
			`Точно переименовать склад "${editModeForStore.value}"`
			+ ` в "${editedStoreValue.value}"?`
		)
	}
	var closeRenameConfirm = ()=> {
		isRenameConfirmShown.value = false
		renameConfirmPrompt.value = ""
		quitEditMode()
	}
	
	var tryToRenameStore = ()=> {
		normalizeEditedStoreValue()
		
		var isRenameSuccess = state.renameStore(
			/*from.*/
			editModeForStore.value,
			/*to.*/
			editedStoreValue.value
		)
		
		if (isRenameSuccess) {
			closeRenameConfirm()
			quitEditMode()
		}
	}
	
</script>

<template>
	<div class="title">Список складов</div>
	<button @click="state.page = 'createStore'">
		Новый склад
	</button>
	<div v-if="state.stores.length > 0">
		<ul>
			<li v-for="(totalItems, store) in state.storeItemStats">
				<div>
					<div>
						<span v-if="editModeForStore !== store">
							{{ store }}
						</span>
						<span v-else>
							<input
								v-model="editedStoreValue"
								@blur="normalizeEditedStoreValue"
							/>
							<button
								class="icon-btn"
								@click="showRenameConfirm"
							>
								<img
									src="../../../icons/tick.svg"
								/>
							</button>
							<button
								class="icon-btn"
								@click="quitEditMode"
							>
								<img
									src="../../../icons/cancel.svg"
								/>
							</button>
						</span>
						: {{ totalItems }} {{ plurItem(totalItems) }}.
						<div v-if="editModeForStore !== store">
							<button
								class="icon-btn"
								@click="confirmDelete(store)"
							>
								<img
									src="../../../icons/trash.svg"
								/>
							</button>
							<button
								class="icon-btn"
								@click="activateEditMode(store)"
							>
								<img
									src="../../../icons/pencil.svg"
								/>
							</button>
						</div>
					</div>
				</div>
			</li>
		</ul>
		<Confirm
			v-if="isDeleteConfirmShown"
			:prompt="deletePrompt"
			@yes="doDelete"
			@no="closeDeleteConfirm"
		/>
		<Confirm
			v-if="isRenameConfirmShown"
			:prompt="renameConfirmPrompt"
			@yes="tryToRenameStore"
			@no="closeRenameConfirm"
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
	</div>
</template>
