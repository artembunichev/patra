<script setup>
	import {useState} from "../state"
	import {ref} from "vue"
	
	var props=defineProps([
		/*example: "поставщика".*/
		"target",
		/*example: "поставщик".*/
		"targetDone",
		"doValidate",
		"doCreate",
	])
	var emit=defineEmits(["oncreate"])
	
	var state = useState()
	
	var val=ref("")
	
	var normalizeValue = ()=> {
		val.value = val.value.trim()
	}
	
	var doCreate = ()=> {
		normalizeValue()
		if (!props.doValidate(val.value)) {
			return
		}
		props.doCreate(val.value)
		
		showIsDoneMsg()
		
		val.value = "";
		emit("oncreate", val.value)
	}
	
	var handleKeypress = (e)=> {
		/*Enter key.*/
		if (e.keyCode == 13) {
			doCreate()
		}
	}
	
	var isDoneMsgShown = ref(false)
	var doneMsgTarget = ref("")
	
	var showIsDoneMsg = ()=> {
		isDoneMsgShown.value = true
		doneMsgTarget.value = val.value
	}
</script>

<template>
	<div>Создать {{ props.target  }}</div>
	<input
		v-model="val"
		@blur="normalizeValue"
		@keypress="handleKeypress"
	/>
	<button @click="doCreate">Создать</button>
	<div
		v-if="isDoneMsgShown"
		class="done-msg"
	>
		{{ props.targetDone }} {{ doneMsgTarget }} успешно создан!
	</div>
</template>

<style>
	.done-msg {
		font-weight: bold;
		color: #0db308;
	}
</style>
