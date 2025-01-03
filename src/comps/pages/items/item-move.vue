<script setup>
	import Confirm from "../../confirm.vue"
	import {useState} from "../../../state"
	import {ref,computed} from "vue"
	import {plurItem, plurRemain,plurRemainPieces} from "../../../lib/plur"
	
	var props = defineProps([
		/*id of an item.*/
		"id",
		/*the store *from where* we're gonna to move item.*/
		"sourceStore",
	])
	
	var emit = defineEmits([
		"move",
		"quit",
	])
		
	var state=useState()
	
	var item = computed(()=> {
		return state.getItemById(props.id)
	})
	
	var destStores = computed(()=> {
		return state.stores.filter(
			(store)=> {
				return store !== props.sourceStore
			}
		)
	})
	
	var remainInDest = computed(()=> {
		return item.value.remain[props.sourceStore]
	})
	
	var doQuit = ()=> {
		emit("quit")
		amount.value = 0
		to.value = ""
	}
	
	var doMove = ()=> {
		emit("move", to.value, amount.value)
		amount.value = 0
		to.value = ""
		closeMoveConfirm()
	}
	
	var amount = ref(0)
	
	var to = ref("")
	
	var isMoveConfirmShown = ref(false)
	var moveConfirmPrompt = ref("")
	
	var showMoveConfirm = ()=> {
		/*if no actual move.*/
		if (props.sourceStore === to.value) {
			return
		}
		
		isMoveConfirmShown.value = true
		moveConfirmPrompt.value = (
			`Точно перенести товар "${item.value.name}"`
			+ ` (${amount.value}) со склада "${props.sourceStore}"`
			+ ` на склад "${to.value}"?`
		)
	}
	var closeMoveConfirm = ()=> {
		isMoveConfirmShown.value = false
		moveConfirmPrompt.value = ""
		doQuit()
	}
</script>

<template>
	<div>
		<div>
			Перемещение товара
		</div>
		<div>
			<span>
				Переместить товар "{{item.name}}" со склада
				"{{sourceStore}}" на склад
			</span>
			<select v-model="to">
				<option v-for="destStore in destStores" :value="destStore">
					{{destStore}}
				</option>
			</select>
			<span>
				в количестве
			</span>
			<input
				v-model="amount"
				type="number"
				min="0"
				:max="remainInDest"
			/>
			<span>{{plurRemainPieces(amount)}}</span>
		</div>
		<div class="dim">
			На складе "{{props.sourceStore}}"
			{{plurRemain(remainInDest)}} {{remainInDest}}
			{{plurItem(remainInDest)}}
		</div>
		<button
			:disabled="amount > remainInDest || amount <= 0 || !to"
			@click="showMoveConfirm"
		>
			Переместить
		</button>
		<button @click="doQuit">Назад</button>
	</div>
	<Confirm
		v-if="isMoveConfirmShown"
		:prompt="moveConfirmPrompt"
		@yes="doMove"
		@no="closeMoveConfirm"
	/>
</template>

<style>
	.dim {
		color:#000000d9;
		font-weight:bold
	}
</style>
