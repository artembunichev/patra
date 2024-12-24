<script setup>
	import {useState} from "../state"
	import {ref} from "vue"
	
	var props=defineProps([
		"target",
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
		val.value = "";
		emit("oncreate", val.value)
	}
	
	var handleKeypress = (e)=> {
		/*Enter key.*/
		if (e.keyCode == 13) {
			doCreate()
		}
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
	<button @click="state.page = 'main'">На главную</button>
</template>
