<script setup>
	import {useState} from "../../../state"
	import Hider from "../../hider.vue"
	
	var props = defineProps([
		"id",
		"name",
		"vendor",
		"remain"
	])
	var state = useState();
	
</script>

<template>
	<div>{{ name }}</div>
	<div>Поставщик: {{ vendor }}</div>
	<div>
		<div v-for="(remainCount,store) in remain">
			<span>{{ store }}: {{ remainCount }}шт.</span>
		</div>
	</div>
</template>
