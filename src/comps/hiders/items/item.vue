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
	
	/************* Detele item. ****************/
	
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
	
	/******************************************/
	
	
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
	
	var normalizeEditedName = ()=> {
		editedName.value = editedName.value.trim()
	}
	
	var tryChangeItemName = ()=> {
		normalizeEditedName()
		if (state.editItemName(props.id, editedName.value)) {
			deactivateEditNameMode()
		}
	}
	/*****************************************/
	
	
	/************** Edit Remain. ***************/
	
	/*for what store do we edit the remain value.*/
	var editRemainFor = ref("")
	
	var editRemainValue = ref(0)
	
	var remainPlusValue = ref(1)
	var remainMinusValue = ref(1)
	
	var activateEditRemainMode = (store)=> {
		editRemainFor.value = store
		editRemainValue.value = props.remain[store]
	}
	
	var quitRemainEditMode = ()=> {
		editRemainFor.value = ""
		editRemainValue.value = 0
		remainPlusValue.value = 1
		remainMinusValue.value = 1
	}
	
	var applyRemainPlus = ()=> {
		editRemainValue.value += remainPlusValue.value
	}
	var applyRemainMinus = ()=> {
		editRemainValue.value -= remainMinusValue.value
	}
	
	var tryToChangeRemain = ()=> {
		var isChangeSuccess = state.editItemRemain(
			props.id,
			editRemainFor.value,
			editRemainValue.value
		)
		
		if (isChangeSuccess) {
			quitRemainEditMode()
		}
	}
	
	/*******************************************/
	
</script>

<template>
	<div class="block">
		<div v-if="isEditNameMode">
			<input
				v-model="editedName"
				@blur="normalizeEditedName"
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
				<div class="remain-container">
					{{ store }}:
					<div v-if="editRemainFor !== store">
						<div>
							{{ remainCount }}
						</div>
						<button @click="activateEditRemainMode(store)">
							ИЗМ
						</button>
					</div>
					<div v-else>
						<div class="edit-remain-container">
							<div class="edit-remain-control">
								<button
									class="edit-remain-button"
									@click="applyRemainMinus"
								>
									-
								</button>
								<input
									class="diff-input"
									type="number"
									min="0"
									v-model="remainMinusValue"
								/>
							</div>
							
							<div class="edit-remain-value">
								{{ editRemainValue }}
							</div>
							
							<div class="edit-remain-control">
								<button
									class="edit-remain-button"
									@click="applyRemainPlus"
								>
									+
								</button>
								<input
									class="diff-input"
									type="number"
									min="0"
									v-model="remainPlusValue"
								/>
							</div>
							<button @click="tryToChangeRemain">
								ОК
							</button>
						</div>
					</div>
				</div>
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
	
	.remain-container {
		display: flex;
		align-items: center;
	}
	
	.edit-remain-container {
		display: flex;
		padding: 30px;
	}
	
	.edit-remain-value {
		font-size: 28px;
		margin: 0 15px;
	}
	
	.edit-remain-control {
		position: relative;
	}
	
	.edit-remain-button {
		width: 25px;
		height: 25px;
		font-size: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.diff-input {
		width: 19px;
		height: 19px;
		font-size: 12px;
		border: 1px dotted black;
		position: absolute;
		top: -27px;
		left: 0;
		-webkit-appearance: none;
		margin: 0;
	}
	
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
