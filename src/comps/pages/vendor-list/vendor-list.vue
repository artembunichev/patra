<script setup>
	import Confirm from "../../confirm.vue"
	import {useState} from "../../../state"
	import {plurItem} from "../../../lib/plur"
	import {ref} from "vue"
	
	var state=useState()
	
	var editModeForVendor = ref("")
	var editedVendorValue = ref ("")
	
	var normalizeEditedVendorValue = ()=> {
		editedVendorValue.value = editedVendorValue.value.trim()
	}
	
	var activateEditMode = (vendor)=> {
		editModeForVendor.value = vendor
		editedVendorValue.value = vendor
	}
	var quitEditMode = ()=> {
		editModeForVendor.value = ""
		editedVendorValue.value = ""
	}
	
	var tryToRenameVendor = ()=> {
		normalizeEditedVendorValue()
		
		var isRenameSuccess = state.renameVendor(
			editModeForVendor.value,
			editedVendorValue.value
		)
		
		if (isRenameSuccess) {
			quitEditMode()
		}
	}
	
	var isDeleteConfirmShown = ref(false)
	var vendorToDelete = ref("")
	
	var showDeleteConfirm = (vendor)=> {
		isDeleteConfirmShown.value = true
		vendorToDelete.value = vendor
	}
	var closeDeleteConfirm = ()=> {
		isDeleteConfirmShown.value = false
		vendorToDelete.value = ""
	}
	
	var confirmDelete = (vendor)=> {
		var isUsedInItems = state.items.some(
			(item)=> {
				return (
					state.getItemTotalRemain(item.id) > 0
					&&
					item.vendor === vendor
				)
			}
		)
		
		if (isUsedInItems) {
			state.setError(
				`Нельзя удалить поставщика ${vendor}`
				+ " - остались товары от него"
			)
			return
		}
		
		var isUsedInBuyList = state.actualBuyListKeys.some(
			(itemId)=> {
				var item = state.getItemById(itemId)
				return item.vendor === vendor
			}
		)
		
		if(isUsedInBuyList) {
			state.setError(
				`Нельзя удалить поставщика ${vendor}`
				+ " - товары от него есть в закупке"
			)
			return
		}
		
		showDeleteConfirm(vendor)
	}
	
	var doDelete = ()=> {
		state.deleteVendor(vendorToDelete.value)
		closeDeleteConfirm()
	}
</script>

<template>
	<div class="title">Список поставщиков</div>
	<button @click="state.page = 'createVendor'">
		Новый поставщик
	</button>
	<ul v-if="state.vendors.length > 0">
		<li v-for="(itemsNumber, vendor) in state.vendorItemStats">
			<span v-if="editModeForVendor === vendor">
				<input
					v-model="editedVendorValue"
					@blur="normalizeEditedVendorValue"
				/>
				: {{ itemsNumber }} {{ plurItem(itemsNumber) }}
				<button @click="tryToRenameVendor">
					ОК
				</button>
				<button @click="quitEditMode">
					Отменить
				</button>
			</span>
			<span v-else>
				{{ vendor }}: {{ itemsNumber }} {{ plurItem(itemsNumber) }}.
				<button @click="activateEditMode(vendor)">ИЗМ</button>
				<button @click="confirmDelete(vendor)">Удалить</button>
			</span>
		</li>
	</ul>
	<Confirm
		v-if="isDeleteConfirmShown"
		:prompt="`Точно хотим удалить поставщика ${vendorToDelete}?`"
		@yes="doDelete"
		@no="closeDeleteConfirm"
	/>
	<div v-else>
		Поставщиков пока нет...
	</div>
</template>
