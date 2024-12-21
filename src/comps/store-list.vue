<script setup>
	import {useState} from "../state"
	import {plurItem} from "../lib/plur"
	
	var state=useState()
</script>

<template>
	<div class="title">Список складов</div>
	<button @click="state.page = 'main'">На главную</button>
	<div v-if="state.stores.length > 0">
		<ul>
			<li v-for="(totalItems, store) in state.storeItemStats">
				{{ store }}: {{ totalItems }} {{ plurItem(totalItems) }}.
			</li>
		</ul>
		<button
			v-if="state.stores.length > 1"
			@click="state.page = 'storeMove'"
		>
			Перемещение по складам
		</button>
	</div>
	<div v-else>
		Складов пока нет...
		<button @click="state.page = 'createStore'">
			Создать склад
		</button>
	</div>
</template>
