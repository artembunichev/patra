<script setup>
	import {useState} from "../../../state"
	import {ref,computed} from "vue"
	import Hider from "../../hider.vue"
	import AddToBuyModal from "../../add-to-buy.vue"
	import Confirm from "../../confirm.vue"
	import ItemCounter from "../../item-counter.vue"
	import ItemMove from "./item-move.vue"
	import Modal from "../../modal.vue"
	
	var props = defineProps([
		"id",
		"idx",
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
	var deactivateEditNameMode = (reset)=> {
		isEditNameMode.value = false
		
		if (reset !== false) {
			editedName.value = props.name;
		}
	}
	var editedName = ref(props.name);
	
	var normalizeEditedName = ()=> {
		editedName.value = editedName.value.trim()
	}
	
	var tryChangeItemName = ()=> {
		normalizeEditedName()
		if (state.editItemName(props.id, editedName.value)) {
			deactivateEditNameMode(false)
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
	var isAddToBuyListModalShown = ref(false)
	
	var openAddToBuyListModal = ()=> {
		isAddToBuyListModalShown.value = true
	}
	
	var closeAddToBuyListModal = ()=> {
		isAddToBuyListModalShown.value = false
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
	
	/********************* Edit vendor. ************/
	
	var isVendorEditMode = ref(false)
	
	var vendorEditedValue = ref("")
	
	var activateVendorEditMode = ()=> {
		isVendorEditMode.value = true
		vendorEditedValue.value = props.vendor
	}
	var quitVendorEditMode = ()=> {
		isVendorEditMode.value = false
		vendorEditedValue.value = props.vendor
	}
	
	var editVendorName = ()=> {
		state.editItemVendor(props.id, vendorEditedValue.value)
		quitVendorEditMode()
	}
	
	/***********************************************/
	
	/************ Move from store. *****************/
	
	var moveFromStore = ref("")
	
	var startMoveFromStore = (store)=> {
		moveFromStore.value = store
	}
	var quitMoveFromStore = ()=> {
		moveFromStore.value = ""
	}
	
	var moveFromTo = (from, to, amount)=> {
		state.moveItem(props.id, from, to, amount)
	}
	
	/***********************************************/
	
	
	var isVerboseMode = ref(false)
	
	var activateVerboseMode = ()=> {
		isVerboseMode.value = true
	}
	var quitVerboseMode = ()=> {
		isVerboseMode.value = false
	}
	var toggleVerboseMode = ()=> {
		if (isVerboseMode.value) {
			quitVerboseMode()
		}
		else {
			activateVerboseMode()
		}
	}
</script>

<template>
	<tr>
		<td>{{ props.idx }}</td>
		<td>
			<div class="item-name-cell">
				<template v-if="isEditNameMode">
					<input
						v-model="editedName"
						@blur="normalizeEditedName"
						@keypress="handleEditedNameKeypress"
					/>
					<button
						class="icon-btn"
						@click="tryChangeItemName"
					>
						<img
							src="../../../icons/pencil.svg"
						/>
					</button>
					<button
						class="icon-btn"
						@click="deactivateEditNameMode"
					>
						<img
							src="../../../icons/cancel.svg"
						/>
					</button>
				</template>
				
				<template v-else>
					<span>{{ props.name }}</span>
					<div class="extra-btns-container">
						<template v-if="isVerboseMode">
							<button
								class="icon-btn item-head-btn"
								@click="activateEditNameMode">
									<img
										src="../../../icons/pencil.svg"
									/>
								</button>
							<button
								class="icon-btn item-head-btn"
								@click="checkForAbilityToDelte">
									<img
										src="../../../icons/trash.svg"
									/>
								</button>
							<button
								class="icon-btn item-head-btn"
								@click="openAddToBuyListModal">
									<img
										src="../../../icons/cart.svg"
									/>
								</button>
							<button
								class="icon-btn item-head-btn"
								@click="toggleExplicitStores"
							>
								<img
									v-if="isExplicitStores"
									src="../../../icons/eye-close.svg"
								/>
								<img
									v-else
									src="../../../icons/eye-open.svg"
								/>
							</button>
							<button
								v-if="!props.comment"
								class="icon-btn item-head-btn"
								@click="activateCreateNewCommentMode"
							>
								<img
									src="../../../icons/comment.svg"
								/>
							</button>
						</template>
						<button
							class="icon-btn item-toggle-verbose-btn"
							@click="toggleVerboseMode"
						>
							<img
								src="../../../icons/arrow-down.svg"
								:class="isVerboseMode ? 'uncollapse' : 'collapse'"
							/>
						</button>
					</div>
				</template>
			</div>
		</td>
		<td>
			<template v-if="isVendorEditMode">
				<div>
					<select v-model="vendorEditedValue">
					<option v-for="vendor in state.vendors" :value="vendor">
						{{ vendor }}
					</option>
					</select>
					<button
						class="icon-btn"
						@click="editVendorName"
					>
						<img
							src="../../../icons/tick.svg"
						/>
					</button>
					<button
						class="icon-btn"
						@click="quitVendorEditMode"
					>
						<img
							src="../../../icons/cancel.svg"
						/>
					</button>
				</div>
			</template>
			<template v-else>
				<span>{{ vendor }}</span>
				<button
					v-if="isVerboseMode"
					class="icon-btn"
					@click="activateVendorEditMode"
				>
					<img
						src="../../../icons/pencil.svg"
					/>
				</button>
			</template>
		</td>
		<td>{{ state.getItemTotalRemain(props.id) }}</td>
		<td>{{ amountInOrders }}</td>
		<td class="td-tmp">{{ amountInTmp }}</td>
	</tr>
	<template
		v-for="(remainCount,store) in remain"
		v-if="isVerboseMode"
	>
		<tr
			v-if="remainCount > 0 || isExplicitStores"
			class="tr-verbose"
		>
			<td></td>
			<td>
				<div>
					<span>{{ store }}</span>
					<button
						v-if="remainCount > 0"
						@click="startMoveFromStore(store)"
						class="item-move-btn"
					>
						Переместить
					</button>
				</div>
			</td>
			<td></td>
			<td>
				<ItemCounter
					v-if="isExplicitStores ? true : remainCount > 0"
					:needTitle="false"
					:_key="store"
					:id="store"
					:title="store"
					:count="remainCount"
					:tryToApply="tryToChangeRemain"
					:editRemainFor="editRemainFor"
					@activateEditRemainMode="activateEditRemainMode"
					@quitEditMode="quitEditMode"
				/>
			</td>
			<td></td>
			<td class="td-tmp"></td>
			
			<Modal
				v-if="store == moveFromStore"
			>
				<ItemMove
					:id="id"
					:sourceStore="moveFromStore"
					@move="(to,amount)=>moveFromTo(moveFromStore,to,amount)"
					@quit="quitMoveFromStore"
				/>
			</Modal>
		</tr>
	</template>
	
	<tr
		v-if="isVerboseMode && (props.comment || isCreateNewCommentMode)"
		class="tr-comment"
	>
		<td></td>
		<td
			class="td-comment"
			colspan="5"
		>
			<div v-if="isCommentEditMode">
				<textarea
					placeholder="Комментарий"
					v-model="commentEditValue"
					@blur="normalizeCommentEditValue"
				/>
				<button
					class="icon-btn"
					@click="showCommentConfirm"
				>
					<img
						src="../../../icons/tick.svg"
					/>
				</button>
				<button
					class="icon-btn"
					@click="quitCommentEditMode">
					<img
						src="../../../icons/cancel.svg"
					/>
				</button>
			</div>
			<template v-else>
				<span>{{ props.comment }}</span>
				<button
					class="icon-btn"
					@click="activateCommentEditMode"
				>
					<img
						src="../../../icons/pencil.svg"
					/>
				</button>
			</template>
			
			<Confirm
				v-if="isCommentConfirmShown"
				:prompt="`Ты реально хочешь изменить комментарий?`"
				@yes="changeTheComment"
				@no="quitCommentEditMode"
			/>
		</td>
	</tr>
	
	<AddToBuyModal
		v-if="isAddToBuyListModalShown"
		:id="props.id"
		@success="closeAddToBuyListModal"
		@cancel="closeAddToBuyListModal"
	/>
	
	<Confirm
		v-if="isConfirmDeleteModalShown"
		:prompt="`Ты реально хочешь удалить ${name}?`"
		@yes="doDeleteItem"
		@no="doNotDeleteItem"
	/>
</template>


<style>
	.item-name-cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.extra-btns-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.item-vendor-prop {
		display: flex;
	}
	
	.item-toggle-verbose-btn {
		width: 22px;
		height: 22px;
		margin-left: 15px;
	}
	
	.item-move-btn {
		margin-left: 10px;
	}
	
	.collapse{
		position: relative;
		top: 2.5px;
	}
	
	.item-head-btn {
		margin-left: 5px;
	}
	
	.uncollapse {
		transform: rotate(180deg);
		position: relative;
		top: -2.5px;
	}
	
</style>
