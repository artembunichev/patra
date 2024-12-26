<script setup>
	import {useState} from "../../../state"
	import {ref,computed} from "vue"
	import Hider from "../../hider.vue"
	import Modal from "../../modal.vue"
	import Confirm from "../../confirm.vue"
	import ItemCounter from "../../item-counter.vue"
	
	var props = defineProps([
		"id",
		"name",
		"vendor",
		"remain"
	])
	var state = useState();
	
	/************* Detele item. ****************/
	
	var isConfirmDeleteModalShown = ref(false)
	
	var checkForAbilityToDelte = ()=> {
		var isSomeRemain = Object.keys(
			props.remain
		).some(
			(store)=> {
				return props.remain[store] > 0
			}
		)
		
		if (isSomeRemain) {
			state.setError(
				"Нельзя удалить товар - есть остатки."
			)
			return
		}
		
		confirmDeleteItem()
	}
	
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
	
	var handleEditedNameKeypress = (e)=> {
		/* Enter key. */
		if (e.keyCode == 13) {
			tryChangeItemName()
		}
	}
	/*****************************************/
	
	
	/************** Edit Remain. ***************/
	
	/*for what store do we edit the remain value.*/
	var editRemainFor = ref("")
	
	var activateEditRemainMode = (id)=> {
		editRemainFor.value = id
	}
	
	var quitEditMode = ()=> {
		editRemainFor.value = ""
	}
	
	var tryToChangeRemain = (storeId, val)=> {		
		return state.editItemRemain(
			props.id,
			storeId,
			val
		)
	}
	
	/*******************************************/
	
	/**************  Explicit Stores. *************/
	
	/*whether or not do we want to show stores with 0 remain.*/
	var isExplicitStores = ref(false)
	
	var toggleExplicitStores = ()=> {
		isExplicitStores.value = !isExplicitStores.value
	}
	
	/***********************************************/
	
	
	/************ Add to Buy List. *****************/
	
	var isAddToBuyListError = ref(false)
	
	var showAddToBuyListError = ()=> {
		isAddToBuyListError.value = true
	}
	var hideAddToBuyListError = ()=> {
		isAddToBuyListError.value = false
	}
	
	var isAddToBuyListModalShown = ref(false)
	var addToBuyListAmount = ref(0)
	
	var showAddToBuyListModal = ()=> {
		isAddToBuyListModalShown.value = true
	}
	var closeAddToBuyListModdal = ()=> {
		isAddToBuyListModalShown.value = false
		addToBuyListAmount.value = 0
	}
	/*when we manually exit it.*/
	var leaveAddToBuyModal = ()=> {
		hideAddToBuyListError()
		closeAddToBuyListModdal()
	}
	
	var addToBuyList = ()=> {
		if (addToBuyListAmount.value < 0) {
			showAddToBuyListError()
			return
		}
		
		hideAddToBuyListError()
		state.addItemToBuyList(
			props.id,
			addToBuyListAmount.value
		)
		
		closeAddToBuyListModdal()
	}
	
	/***********************************************/
	
	/******************* Remains/Amounts. ********/
	
	var amountInOrders = computed(
		()=> state.getItemAmountInTheOrders(props.id)
	)
	
	var amountInTmp = computed(
		()=> state.getAmountOfItemInTempStore(props.id)
	)
	
	/**********************************************/
</script>

<template>
	<div class="block">
		<div v-if="isEditNameMode">
			<input
				v-model="editedName"
				@blur="normalizeEditedName"
				@keypress="handleEditedNameKeypress"
			/>
			<button @click="tryChangeItemName">ОК</button>
			<button @click="deactivateEditNameMode">ОТМ</button>
		</div>
		<div v-else>
			<span>{{ props.name }}</span>
			<div>{{ state.getItemTotalRemain(props.id) }}</div>
			<div
				v-if="amountInOrders > 0"
			>
				В пути: {{ amountInOrders }}
			</div>
			<div
				v-if="amountInTmp > 0"
			>
				Ждут распределения: {{ amountInTmp }}
			</div>
			<button @click="activateEditNameMode">РЕД</button>
			<button @click="checkForAbilityToDelte">УДАЛИТЬ</button>
			<button @click="showAddToBuyListModal">Z</button>
			<Confirm
				v-if="isConfirmDeleteModalShown"
				:prompt="`Ты реально хочешь удалить ${name}?`"
				@yes="doDeleteItem"
				@no="doNotDeleteItem"
			/>
			<Modal
				v-if="isAddToBuyListModalShown"
			>
				<div>
					<div>Добавить {{ name }} в список закупки в кол-ве:</div>
					<input
						type="number"
						v-model="addToBuyListAmount"
					/>
					<div
						v-if="isAddToBuyListError"
					>
						Кол-во не может быть отрицательным
					</div>
					<button @click="addToBuyList">
						Добавить
					</button>
					<button @click="leaveAddToBuyModal">
						Назад
					</button>
				</div>
			</Modal>
		</div>
		<div>Поставщик: {{ vendor }}</div>
		<div>
			<button
				@click="toggleExplicitStores"
			>
				{{ isExplicitStores ? "🟢" : "👁️" }}
			</button>
			<div v-for="(remainCount,store) in remain">
				<ItemCounter
					v-if="isExplicitStores ? true : remainCount > 0"
					:_key="store"
					:id="store"
					:title="store"
					:count="remainCount"
					:tryToApply="tryToChangeRemain"
					:editRemainFor="editRemainFor"
					@activateEditRemainMode="activateEditRemainMode"
					@quitEditMode="quitEditMode"
				/>
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
