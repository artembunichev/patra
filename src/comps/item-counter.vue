<script setup>
	import {ref,watch,computed} from "vue"
	
	var props = defineProps({
		/*
			a uniq key for a component.
			can't use "key" - it's reserved.
		*/
		"_key": String,
		/*an id of an item/store.*/
		"id": String,
		"title": String,
		"count": Number,
		/*
			takes id and value.
		*/
		"tryToApply": Function,
		"editRemainFor": String,
		/*
			Optional.
			
			well, sometimes we want to
			disable an opportunity for editing.
		*/
		"readOnly": {
			type: Boolean,
			default: false
		},
		/*
			Optional.
		*/
		"minValue": {
			type: Number,
			default: 0,
		},
		/*Optional.*/
		"maxValue": {
			type: Number,
			/* no limit by default. */
			default: Infinity,
		},
		"needTitle": {
			type: Boolean,
			default: true,
		}
	})
	
	var emit = defineEmits([
		"activateEditRemainMode",
		"quitEditMode",
		"plus",
		"minus",
	])
	
	var editRemainValue = ref(0)
	
	var isMinusDisabled = computed(()=> {
		return (
			remainMinusValue.value < 0
			||
			editRemainValue.value <= props.minValue
			||
			(
				editRemainValue.value - remainMinusValue.value
				< props.minValue
			)
		)
	})
	
	var isPlusDisabled = computed(()=> {
		return (
			remainPlusValue.value < 0
			||
			editRemainValue.value >= props.maxValue
			||
			(
				editRemainValue.value + remainPlusValue.value
				> props.maxValue
			)
		)
	})
	
	var activateEditRemainMode = ()=> {
		emit("activateEditRemainMode", props._key)
		editRemainValue.value = props.count
	}
	
	var remainPlusValue = ref(1)
	var remainMinusValue = ref(1)
	
	var applyRemainPlus = ()=> {
		editRemainValue.value += Number(remainPlusValue.value)
		emit("plus",  Number(remainPlusValue.value))
	}
	var applyRemainMinus = ()=> {
		editRemainValue.value -= remainMinusValue.value
		emit("minus", remainMinusValue.value)
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
			editRemainValue.value,
			
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
		<span
			v-if="props.needTitle"
			class="item-counter-store"
		>
			{{ props.title }}:
		</span>
		<div
			v-if="props.editRemainFor !== props._key"
		>
			<span>
				{{ props.count }}
			</span>
			<button
				v-if="!props.readOnly"
				class="icon-btn"
				@click="activateEditRemainMode"
			>
				<img
					src="../icons/pencil.svg"
				/>
			</button>
		</div>
		<div v-else>
			<div class="edit-remain-container">
				<div class="edit-remain-control">
					<button
						class="edit-remain-button"
						:disabled="isMinusDisabled"
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
						:disabled="isPlusDisabled"
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
				<button
					class="icon-btn"
					@click="tryToChangeRemain"
				>
					<img
						src="../icons/tick.svg"
					/>
				</button>
				<button
					class="icon-btn"
					@click="quitRemainEditMode"
				>
					<img
						src="../icons/cancel.svg"
					/>
				</button>
			</div>
		</div>
		</div>
</template>

<style>
	.remain-container {
		display: flex;
		align-items: center;
	}
	
	.edit-remain-container {
		display: flex;
		padding: 25px 0 0 0;
	}
	
	.item-counter-store {
		margin-right: 4px;
	}
	
	.edit-remain-value {
		margin: 0 10px;
	}
	
	.edit-remain-control {
		position: relative;
	}
	
	.edit-remain-button {
		width: 24px;
		height: 24x;
		font-size: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.diff-input {
		width: 18px;
		height: 18px;
		font-size: 10px;
		border: 1px dotted black;
		position: absolute;
		top: -24px;
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
