<script setup>
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
			</span>
		</li>
	</ul>
	<div v-else>
		Поставщиков пока нет...
	</div>
</template>
