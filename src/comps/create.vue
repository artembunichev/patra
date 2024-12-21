<script setup>
	import {useState} from "../state"
	import {ref} from "vue"
	
	var props=defineProps([
		"target",
		/*
			function for validating entered value
			for redundancy.
			an entered value is used as function parameter.
		*/
		"checkForSameName",
		/*
			function we will call in order to get
			an error text for such a case.
			it also takes a current value.
		*/
		"getSameNameErrorText"
	])
	var emit=defineEmits(["oncreate"])
	
	var state = useState()
	
	var val=ref("")
	
	var normalizeValue = ()=> {
		val.value = val.value.trim()
	}
	
	var doCreate = ()=> {
		normalizeValue()
		
		if (!props.checkForSameName(val.value)) {
			state.setError(props.getSameNameErrorText(val.value))
			return
		}
		
		emit("oncreate", val.value)
		val.value = "";
	}
	
</script>

<template>
	<div>Создать {{ props.target  }}</div>
	<input
		v-model="val"
		@blur="normalizeValue"
	/>
	<button @click="doCreate">Создать</button>
	<button @click="state.page = 'main'">На главную</button>
</template>
