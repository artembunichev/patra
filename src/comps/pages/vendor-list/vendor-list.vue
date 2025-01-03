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
			closeRenameConfirm()
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
	
	
	var editedComment = ref("")
	var editCommentFor = ref("")
	var newCommentFor = ref("")
	
	var isCommentConfirmShown = ref(false)
	
	var activateCommentEditMode = (vendor)=> {
		editCommentFor.value = vendor
		editedComment.value = state.vendorComments[vendor]
	}
	var quitCommentEditMode = ()=> {
		editCommentFor.value = ""
		newCommentFor.value = ""
		isCommentConfirmShown.value = false
	}
	
	var activateCreateNewCommentMode = (vendor)=> {
		newCommentFor.value = vendor
		activateCommentEditMode(vendor)
	}
	
	var showCommentConfirm = ()=> {
		isCommentConfirmShown.value = true
	}
	
	var normalizeEditedCommentValue = ()=> {
		editedComment.value = editedComment.value.trim()
	}
	
	var changeTheComment = ()=> {
		normalizeEditedCommentValue()
		state.addVendorComment(editCommentFor.value, editedComment.value)
		quitCommentEditMode()
	}
	
	
	var isRenameConfirmShown = ref(false)
	var renameConfirmPrompt = ref("")
	var showRenameConfirm = ()=> {
		/*if we didn't actually edit the name.*/
		if (editModeForVendor.value === editedVendorValue.value) {
			tryToRenameVendor()
			return
		}
		
		isRenameConfirmShown.value = true
		renameConfirmPrompt.value = (
			`Точно переименовать поставщика "${editModeForVendor.value}"`
			+ ` в "${editedVendorValue.value}"?`
		)
	}
	var closeRenameConfirm = ()=> {
		isRenameConfirmShown.value = false
		renameConfirmPrompt.value = ""
		quitEditMode()
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
				<button
					class="icon-btn"
					@click="showRenameConfirm"
				>
					<img
						src="../../../icons/tick.svg"
					/>
				</button>
				<button class="icon-btn" @click="quitEditMode">
					<img
						src="../../../icons/cancel.svg"
					/>
				</button>
			</span>
			<span v-else>
				{{ vendor }}: {{ itemsNumber }} {{ plurItem(itemsNumber) }}.
				<button
					class="icon-btn"
					@click="activateEditMode(vendor)"
				>
					<img
						src="../../../icons/pencil.svg"
					/>
				</button>
				<button
					class="icon-btn"
					@click="confirmDelete(vendor)"
				>
					<img
						src="../../../icons/trash.svg"
					/>
				</button>
				<template v-if="state.vendorComments[vendor] || newCommentFor===vendor">
					<template v-if="editCommentFor === vendor">
						<textarea
							placeholder="Комментарий"
							@blur="normalizeEditedCommentValue"
							v-model="editedComment"
						/>
						<button
							class="icon-btn"
							@click="showCommentConfirm(vendor)"
						>
							<img
								src="../../../icons/tick.svg"
							/>
						</button>
						<button
							class="icon-btn"
							@click="quitCommentEditMode"
						>
							<img
								src="../../../icons/cancel.svg"
							/>
						</button>
					</template>
					
					<div v-else>
						<span>
						{{state.vendorComments[vendor]}}
						</span>
						<button
							class="icon-btn"
							@click="activateCommentEditMode(vendor)"
						>
							<img
								src="../../../icons/pencil.svg"
							/>
						</button>
					</div>
				</template>
				<button
					v-else
					class="icon-btn"
					@click="activateCreateNewCommentMode(vendor)"
				>
					<img
						src="../../../icons/comment.svg"
					/>
				</button>
				<Confirm
					v-if="isCommentConfirmShown && editCommentFor == vendor"
					:prompt="`Ты реально хочешь изменить комментарий?`"
					@yes="changeTheComment"
					@no="quitCommentEditMode"
				/>
			</span>
		</li>
	</ul>
	<div v-else>
		Поставщиков пока нет...
	</div>
	<Confirm
		v-if="isDeleteConfirmShown"
		:prompt="`Точно хотим удалить поставщика ${vendorToDelete}?`"
		@yes="doDelete"
		@no="closeDeleteConfirm"
	/>
	<Confirm
		v-if="isRenameConfirmShown"
		:prompt="renameConfirmPrompt"
		@yes="tryToRenameVendor"
		@no="closeRenameConfirm"
	/>
</template>
