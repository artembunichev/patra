<script setup>
	import {useState} from "../state"
	var state=useState()
</script>

<template>
	<div class="title">Список складов</div>
	<button @click="state.page = 'main'">На главную</button>
	<ul v-if="state.stores.length > 0">
		<li v-for="(totalItems, store) in state.storeItemStats">
			{{ store }}: {{ totalItems }} товаров.
		</li>
	</ul>
	<div v-else>
		Складов пока нет...
		<button @click="state.page = 'createStore'">
			Создать склад
		</button>
	</div>
</template>
