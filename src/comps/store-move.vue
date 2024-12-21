<script setup>
	import {useState} from "../state"
	import {ref} from "vue"
	
	var state=useState()
	
	/*`from` and `to` are store names.*/
	var from = ref("")
	var to = ref("")
	
	var move = ()=> {
		state.moveAllFromStore(from.value, to.value)
	}
	
</script>

<template>
	<div class="title">Перемещение по складам</div>
	<button @click="state.page = 'main'">На главную</button>
	
	<div v-if="state.stores.length > 1">
		<span>Переместить все детали со склада</span>
		<select v-model="from">
			<option v-for="store in state.stores" :value="store">
				{{ store }}
			</option>
		</select>
		<span>на склад</span>
		<select v-model="to">
			<option v-for="store in state.stores" :value="store">
				{{ store }}
			</option>
		</select>
		<button @click="move">Переместить</button>
	</div>
	<div v-else-if="state.stores.length === 1">
		Создан только один склад - перемещать некуда.
	</div>
	<div v-else>
		Не создано ни одного склада - перемещать некуда.
	</div>
</template>
