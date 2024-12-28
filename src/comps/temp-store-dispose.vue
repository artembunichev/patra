<script setup>
	import Modal from "./modal.vue"
	import ItemCounter from "./item-counter.vue"
	import {useState} from "../state"
	import {ref,computed} from "vue"
	
	var props = defineProps([
		/*id of an disposed item.*/
		"id",
		"remain",
	])
	
	var emit=defineEmits([
		"quit"
	])
	
	var state=useState()

	/********** Item Values. **************/
	
	var item = computed(()=> {
		return state.getItemById(props.id)
	})
	
	var restToDispose = computed(
		()=> state.getAmountOfItemInTempStore(props.id)
	)
	
	/*************************************/
	
	/************** Edit Remain. ***************/
	
	/*for what store do we edit the remain value.*/
	var editRemainFor = ref("")
	
	var activateEditRemainMode = (id)=> {
		editRemainFor.value = id
	}
	
	var quitEditMode = ()=> {
		editRemainFor.value = ""
		localRestToDispose.value = restToDispose.value
	}
	
	var tryToChangeRemain = (store, val)=> {
		/*diff with actual value on real store.*/
		var diff = val - props.remain[store]
		
		state.disposeTempStoreItem(props.id, diff, store)
		
		/*
			there can not be errors during this process,
			so `true`.
		*/
		return true
	}
	
	var localRestToDispose = ref(restToDispose.value)
	
	/*diff is positive here!*/
	var onRemainPlus = (diff)=> {
		localRestToDispose.value -= diff
	}
	/*diff is positive here!*/
	var onRemainMinus = (diff)=> {
		localRestToDispose.value += diff
	}
	
	/*******************************************/
	
	/****** Quit. ********/
	var doQuit = ()=> {
		emit("quit")
	}
	/*********************/
</script>

<template>
	<div>
		<div>Распределение товара {{ item.name }}</div>
		<div
			v-if="!editRemainFor"
		>
			<template v-if="restToDispose > 0">
				Осталось распределить: {{ restToDispose }}
			</template>
			<template v-else>
				<span class="all-disposed">
					Все товары распределены
				</span>
			</template>
		</div>
	</div>
	<div>
		<div v-for="(remainCount,store) in item.remain">
			<div
				v-if="editRemainFor === store"
			>
				<template v-if="localRestToDispose > 0">
					Осталось распределить: {{ localRestToDispose }}
				</template>
				<template v-else>
					<span class="all-disposed">
						Все товары распределены
					</span>
				</template>
			</div>
			<ItemCounter
				:_key="store"
				:id="store"
				:title="store"
				:count="remainCount"
				:minValue="remainCount"
				:maxValue="remainCount + restToDispose"
				:readOnly="restToDispose === 0"
				:tryToApply="tryToChangeRemain"
				:editRemainFor="editRemainFor"
				@activateEditRemainMode="activateEditRemainMode"
				@quitEditMode="quitEditMode"
				@plus="onRemainPlus"
				@minus="onRemainMinus"
			/>
		</div>
	</div>
	<button @click="doQuit">Назад</button>
</template>


<style scoped>
	.all-disposed {
		color: green
	}
</style>
