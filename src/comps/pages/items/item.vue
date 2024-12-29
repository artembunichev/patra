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
		"remain",
		"comment"
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
		
		var isSomeInBuyList = state.actualBuyListKeys
			.some(
				(itemId)=> {
					return itemId === props.id
				}
			)
		
		if (isSomeInBuyList) {
			state.setError(
				"Нельзя удалить товар - он есть в закупке."
			)
			return
		}
		
		var isSomeInOrder = state.orders.some(
			(order)=> {
				return Object.keys(order.items).some(
					(itemId)=> {
						return (
							/*
								search only in
								uncompleted orders.
							*/
							!order.status
							&&
							itemId === props.id
						)
					}
				)
			}
		)
		
		if (isSomeInOrder) {
			state.setError(
				"Нельзя удалить товар - он заказан (едет)."
			)
			return
		}
		
		var isSomeInTempStore = state.actualTempStoreKeys
			.some(
				(itemId)=> {
					return itemId === props.id
				}
			)
		
		if (isSomeInTempStore) {
			state.setError(
				"Нельзя удалить товар -"
				+ " он есть на транзитном складе."
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
	
	/*************** Comment. ********************/
	
	var isCommentEditMode = ref(false)
	var commentEditValue = ref(props.comment)
	
	var isCreateNewCommentMode = ref(false)
	
	var normalizeCommentEditValue = ()=> {
		commentEditValue.value = commentEditValue.value.trim()
	}
	
	var activateCommentEditMode = ()=> {
		isCommentEditMode.value = true
		commentEditValue.value = props.comment
	}
	
	var activateCreateNewCommentMode = ()=> {
		isCreateNewCommentMode.value = true
		activateCommentEditMode()
	}
	
	var quitCommentEditMode = ()=> {
		isCommentEditMode.value = false
		isCreateNewCommentMode.value = false
		commentEditValue.value = props.comment
		isCommentConfirmShown.value = false
	}
	
	var isCommentConfirmShown = ref(false)
	
	var showCommentConfirm = ()=> {
		isCommentConfirmShown.value = true
	}
	
	var changeTheComment = ()=> {
		normalizeCommentEditValue()
		
		state.editItemComment(
			props.id, commentEditValue.value
		)
		quitCommentEditMode()
	}
	
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
		<Confirm
			v-if="isCommentConfirmShown"
			:prompt="`Ты реально хочешь изменить комментарий?`"
			@yes="changeTheComment"
			@no="quitCommentEditMode"
		/>
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
		<div
			v-if="props.comment !== '' || isCreateNewCommentMode"
		>
			<div v-if="isCommentEditMode">
				<textarea
					placeholder="Комментарий"
					v-model="commentEditValue"
					@blur="normalizeCommentEditValue"
				/>
				<button @click="showCommentConfirm">
					ОК
				</button>
				<button @click="quitCommentEditMode">
					Отменить
				</button>
			</div>
			<div v-else>
				<div>
					{{ props.comment }}
				</div>
				<button @click="activateCommentEditMode">
					Изм. комментарий
				</button>
			</div>
		</div>
		<div v-else>
			<button @click="activateCreateNewCommentMode">
				Добавить комментарий
			</button>
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
