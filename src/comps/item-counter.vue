<script setup>
	import {ref,watch} from "vue"
	
	var props = defineProps([
		/*
			a uniq key for a component.
			can't use "key" - it's reserved.
		*/
		"_key",
		/*an id of an item/store.*/
		"id",
		"title",
		"count",
		/*
			takes id and value.
		*/
		"tryToApply",
		"editRemainFor",
	])
	
	var emit = defineEmits([
		"activateEditRemainMode",
		"quitEditMode"
	])
	
	var editRemainValue = ref(0)
	
	var activateEditRemainMode = ()=> {
		emit("activateEditRemainMode", props._key)
		editRemainValue.value = props.count
	}
	
	var remainPlusValue = ref(1)
	var remainMinusValue = ref(1)
	
	var applyRemainPlus = ()=> {
		editRemainValue.value += remainPlusValue.value
	}
	var applyRemainMinus = ()=> {
		editRemainValue.value -= remainMinusValue.value
	}
	
	var quitRemainEditMode = ()=> {
		editRemainValue.value = 0
		remainPlusValue.value = 1
		remainMinusValue.value = 1
		emit("quitEditMode")
	}
	
	var tryToChangeRemain = ()=> {
		var isChangeSuccess = props.tryToApply(
			props.id,
			editRemainValue.value
		)
		
		if (isChangeSuccess) {
			quitRemainEditMode()
		}
	}
	
	watch(
		()=> props.editRemainFor,
		(newEditRemainFor)=> {
			if (newEditRemainFor !== props._key) {
				editRemainValue.value = 0
				remainPlusValue.value = 1
				remainMinusValue.value = 1
			}
		}
	)
</script>

<template>
	<div class="remain-container">
		{{ props.title }}:
		<div v-if="props.editRemainFor !== props._key">
			<div>
				{{ props.count }}
			</div>
			<button @click="activateEditRemainMode">
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
</template>

<style scoped>
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
