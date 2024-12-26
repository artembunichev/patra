<script setup>
	import {useState} from "../state"
	
	var state=useState()
	
	var getItemName = (id)=> {
		return state.getItemById(id).name
	}
</script>

<template>
	<div v-if="state.actualTempStoreKeys.length > 0">
		<div>Транзитный склад</div>
		<div>
			<div v-for="itemId in state.actualTempStoreKeys">
				{{ getItemName(itemId) }}: {{ state.tempStore[itemId] }}
			</div>
		</div>
	</div>
	<div v-else>
		Транзитный склад пуст...
	</div>
	<button @click="state.page = 'main'">На главную</button>
</template>
