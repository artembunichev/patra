<script setup>
	import {useState} from "../state"
	var state=useState()
</script>

<template>
	<div class="title">Список поставщиков</div>
	<button @click="state.page = 'main'">На главную</button>
	<ul v-if="state.vendors.length > 0">
		<li v-for="(itemsNumber, vendor) in state.vendorItemStats">
			{{ vendor }}: {{ itemsNumber }} товаров.
		</li>
	</ul>
	<div v-else>
		Поставщиков пока нет...
		<button @click="state.page = 'createVendor'">
			Создать поставщика
		</button>
	</div>
</template>
