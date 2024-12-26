<script setup>
	import {useState} from "../state"
	
	var state=useState()
	
	var getItemName = (id)=> {
		return state.getItemById(id).name
	}
</script>

<template>
	<div v-if="Object.keys(state.tempStore) > 0">
		<div>Транзитный склад</div>
		<div>
			<div v-for="itemId in Object.keys(state.tempStore)">
				{{ getItemName(itemId) }}: {{ state.tempStore[itemId] }}
			</div>
		</div>
	</div>
	<div v-else>
		Транзитный склад пуст...
	</div>
	<button @click="state.page = 'main'">На главную</button>
</template>
