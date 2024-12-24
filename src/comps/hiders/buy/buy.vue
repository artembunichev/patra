<script setup>
	import AppHider from "../../app-hider.vue"
	import Hider from "../../hider.vue"
	import {useState} from "../../../state"
	import {reactive} from "vue"
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
					<div v-for="(itemId) in Object.keys(state.buyListByVendors[vendor])">
						<div>{{ state.getItemById(itemId).name }}</div>
						<div>{{ state.buyListByVendors[vendor][itemId] }}</div>
					</div>
				</Hider>
			</div>
		</div>
		<div v-else>
			Список закупки пока пустует...
		</div>
	</AppHider>
</template>
