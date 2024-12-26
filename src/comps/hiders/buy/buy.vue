<script setup>
	import AppHider from "../../app-hider.vue"
	import Hider from "../../hider.vue"
	import ItemCounter from "../../item-counter.vue"
	import Confirm from "../../confirm.vue"
	import {useState} from "../../../state"
	import {ref, reactive} from "vue"
	
	var state = useState()
	
	var vendorHidersState = reactive(
		Object.keys(state.buyListByVendors)
			.reduce(
				(acc, vendor)=> {
					acc[vendor] = false
					return acc
				},
				{}
			)
	)
	
	var onVendorHiderToggle = (vendor, value)=> {
		vendorHidersState[vendor] = value
	}
	
	
	/********* Item-counter. ***********/
	
	/*which item do we edit amount of.*/
	var editRemainFor = ref("")
	
	var activateEditRemainMode = (id)=> {
		editRemainFor.value = id
	}
	
	var quitEditMode = ()=> {
		editRemainFor.value = ""
	}
	
	var tryToChangeRemain = (itemId, val)=> {
		var isChangeSuccess = state.editBuyListItemCount(
			itemId,
			val
		)
		
		closeDeletionConfirm()
		
		return isChangeSuccess
	}
	
	var tryToTryToChangeRemain = (itemId, val)=> {
		if (val === 0) {
			showDeletionConfirm(itemId)
			return false
		}
		
		return tryToChangeRemain(itemId, val)
	}
	
	/***********************************/
	
	/****** Deletion Confirm. **********/
	
	var isDeletionConfirmShown = ref(false)
	var deletionConfirmText = ref("")
	var deletionConfirmId = ref("")
	
	var showDeletionConfirm = (itemId)=> {
		isDeletionConfirmShown.value = true
		deletionConfirmId.value = itemId
		var itemName= state.getItemById(deletionConfirmId.value).name
		deletionConfirmText.value = (
			`Это приведёт к удалению товара ${itemName}`
			+" из закупки. Продолжить?"
		)
	}
	
	var closeDeletionConfirm = ()=> {
		isDeletionConfirmShown.value = false
		deletionConfirmText.value = ""
	}
	
	/***********************************/
	
	
	/********* Make an order. **********/
	
	var isOrderConfirmShown = ref(false)
	var orderConfirmText = ref("")
	var orderConfirmVendor = ref("")
	
	var showOrderConfirm = (vendor)=> {
		isOrderConfirmShown.value = true
		orderConfirmVendor.value = vendor
		orderConfirmText.value = (
			`Точно делаем заказ у поставщика ${vendor}?`
		)
	}
	
	var closeOrderConfirm = ()=> {
		isOrderConfirmShown.value = false
		orderConfirmVendor.value = ""
		orderConfirmText.value = ""
	}
	
	var makeAnOrder = (vendor)=> {
		var items = state.actualBuyListKeys.reduce(
			(acc, itemId)=> {
				var item = state.getItemById(itemId)
				if (item.vendor === vendor) {
					acc[itemId] = state.buyList[itemId]
				}
				return acc
			},
			{}
		)
		
		state.makeAnOrder({
			vendor: vendor,
			items: items,
		})
		
		closeOrderConfirm()
	}
	
	/***********************************/
	
	var getItemCounterKey = (vendor, itemId)=> {
		return `${vendor}+${itemId}`
	}
	
</script>

<template>
	<AppHider id="buy" title="Закупка">
		<div v-if="state.actualBuyListKeys.length > 0">
			<div v-for="vendor in Object.keys(state.buyListByVendors)">
				<Hider
					:isShown="vendorHidersState[vendor]"
					:title="vendor"
					@toggle="(val)=> onVendorHiderToggle(vendor,val)"
				>
					<div v-for="itemId in Object.keys(state.buyListByVendors[vendor])">
						<ItemCounter
							:_key="getItemCounterKey(vendor,itemId)"
							:id="itemId"
							:title="state.getItemById(itemId).name"
							:count="state.buyListByVendors[vendor][itemId]"
							:tryToApply="tryToTryToChangeRemain"
							:editRemainFor="editRemainFor"
							@activateEditRemainMode="activateEditRemainMode"
							@quitEditMode="quitEditMode"
						/>
					</div>
				</Hider>
				<button @click="showOrderConfirm(vendor)">
					Заказать
				</button>
			</div>
		</div>
		<div v-else>
			Список закупки пока пустует...
		</div>
		<Confirm
			v-if="isDeletionConfirmShown"
			:prompt="deletionConfirmText"
			@yes="tryToChangeRemain(deletionConfirmId, 0)"
			@no="closeDeletionConfirm"
		/>
		<Confirm
			v-if="isOrderConfirmShown"
			:prompt="orderConfirmText"
			@yes="makeAnOrder(orderConfirmVendor)"
			@no="closeOrderConfirm"
		/>
	</AppHider>
</template>
