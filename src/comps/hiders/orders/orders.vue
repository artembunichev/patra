<script setup>
	import AppHider from "../../app-hider.vue"
	import Hider from "../../hider.vue"
	import Confirm from "../../confirm.vue"
	import ItemCounter from "../../item-counter.vue"
	import {reactive,ref} from "vue"
	import {useState} from "../../../state"
	
	var state = useState()
	
	var orderHidersState = reactive(
		state.orders.reduce(
			(acc, order)=> {
				acc[order.id] = 0
				return acc
			},
			{}
		)
	)
	
	var onOrderHiderToggle = (order,val)=> {
		orderHidersState[order.id] = val
	}
	
	var getHiderTitle = (order)=> {
		return `${order.vendor} (${order.when})`
	}
	
	/*
		"<order_id>+<item_id>".
	*/
	var getItemCounterKey = (order, itemId)=> {
		return `${order.id}+${itemId}`
	}
	
	/**********  Edit Remain. ************/
	
	/*which orderId + itemId we are editing.*/
	var editRemainFor = ref("")
	
	var activateEditRemainMode = (key)=> {
		editRemainFor.value = key
	}
	
	var quitEditMode = ()=> {
		editRemainFor.value = ""
	}
	
	var tryToTryToChangeRemain = (_, val)=> {
		var {
			0: orderId,
			1: itemId
		} = editRemainFor.value.split("+")
		
		return state.editOrderItemRemain(orderId, itemId, val)
	}
	
	/*************************************/
	
	
	/**************** Cancel the order ************/
	
	var isCancelConfirmShown = ref(false)
	var cancelConfirmText = ref("")
	var cancelConfirmId = ref("")
	
	var showCancelConfirm = (orderId)=> {
		quitEditMode()
		
		isCancelConfirmShown.value = true
		cancelConfirmId.value = orderId
		
		var order = state.getOrderById(orderId)
		
		cancelConfirmText.value = (
			"Точно ОТМЕНЯЕМ заказ у поставщика"
			+` ${order.vendor} (от ${order.when})?`
		)
	}
	
	var closeCancelConfirm = ()=> {
		isCancelConfirmShown.value = false
		cancelConfirmId.value = ""
		cancelConfirmText.value = ""
	}
	
	var doCancelOrder = (orderId)=> {
		state.cancelOrder(orderId)
		closeCancelConfirm()
	}
	
	/**********************************************/
	
	/********** Complete The Order. ***************/
	
	var isCompleteConfirmShown = ref(false)
	var completeConfirmText = ref("")
	var completeConfirmId = ref("")
	
	var showCompleteConfirm = (orderId)=> {
		isCompleteConfirmShown.value = true
		var order = state.getOrderById(orderId)
		completeConfirmText.value = (
			"Принять заказ от поставщика"
			+ ` ${order.vendor} (от ${order.when})?`
		)
		completeConfirmId.value = orderId
	}
	
	var closeCompleteConfirm = ()=> {
		isCompleteConfirmShown.value = false
		completeConfirmText.value = ""
		completeConfirmId.value = ""
	}
	
	var doCompleteOrder = (orderId)=> {
		state.completeOrder(orderId)
		
		closeCompleteConfirm()
	}
	
	var maybeCompleteOrder = (orderId)=> {
		quitEditMode()
		
		var order = state.getOrderById(orderId)
		/*if the order is already completed - we do nothing.*/
		if (order.status) {
			return
		}
		
		showCompleteConfirm(orderId)
	}
	
	/**********************************************/
</script>

<template>
	<AppHider id="orders" title="Заказы">
		<div v-if="state.orders.length > 0">
			<div v-for="order in state.ordersReversedAndSorted">
				<Hider
					:isShown="orderHidersState[order.id]"
					:title="getHiderTitle(order)"
					@toggle="(val)=> onOrderHiderToggle(order,val)"
				>
					<div v-for="itemId in Object.keys(order.items)">
						<ItemCounter
							:readOnly="order.status"
							:_key="getItemCounterKey(order,itemId)"
							:id="itemId"
							:title="state.getItemById(itemId).name"
							:count="order.items[itemId]"
							:tryToApply="tryToTryToChangeRemain"
							:editRemainFor="editRemainFor"
							@activateEditRemainMode="activateEditRemainMode"
							@quitEditMode="quitEditMode"
						/>
					</div>
				</Hider>
				<button
					v-if="!order.status"
					@click="showCancelConfirm(order.id)"
				>
					🛇
				</button>
				<button @click="maybeCompleteOrder(order.id)">
					{{ order.status ? "✔️" : "🚘" }}
				</button>
			</div>
			<Confirm
				v-if="isCancelConfirmShown"
				:prompt="cancelConfirmText"
				@yes="doCancelOrder(cancelConfirmId)"
				@no="closeCancelConfirm"
			/>
			<Confirm
				v-if="isCompleteConfirmShown"
				:prompt="completeConfirmText"
				@yes="doCompleteOrder(completeConfirmId)"
				@no="closeCompleteConfirm"
			/>
		</div>
		<div v-else>
			Заказов пока не было...
		</div>
	</AppHider>
</template>
