<script setup>
	import {useState} from "../state"
	
	var props=defineProps(["target"])
	
	var state = useState()
	
	var val=""
</script>

<template>
	<div>Создать {{ props.target  }}</div>
	<input v-model="val" />
	<button @click="$emit('oncreate', val)">Создать</button>
	<button @click="state.page = 'main'">На главную</button>
</template>
