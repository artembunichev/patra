<script setup>
	import {useState} from "../state"
	import {ref} from "vue"
	
	var props=defineProps(["target"])
	var emit=defineEmits(["oncreate"])
	
	var state = useState()
	
	var val=ref("")
	
	var doCreate = ()=> {
		emit('oncreate', val.value)
		val.value = "";
	}
	
</script>

<template>
	<div>Создать {{ props.target  }}</div>
	<input v-model="val" />
	<button @click="doCreate">Создать</button>
	<button @click="state.page = 'main'">На главную</button>
</template>
