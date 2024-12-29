<script setup>
	/*
		This component displays only filtered items.
		by default the `searchPattern` in `state` is "",
		so it'll display all the items.
	*/
	
	import Item from "./item.vue"
	import {useState} from "../../../state"
	
	var state = useState();
</script>

<template>
	<div v-if="state.items.length===0">
		Пока товаров нет...
	</div>
	<div v-else>
		<div
			v-if="state.filteredItems.length > 0"
			v-for="item in state.filteredItems"
		>
			<Item
				:id="item.id"
				:name="item.name"
				:vendor="item.vendor"
				:remain="item.remain"
				:comment="item.comment"
			/>
		</div>
		<div v-else>
			По запросу
			<span class="search-req">{{ state.searchPattern }}</span>
			ничего не найдено
		</div>
	</div>
</template>

<style scoped>
	.search-req {
		font-weight: bold;
	}
</style>
