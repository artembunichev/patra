<script setup>
	/*
		This component displays only filtered items.
		by default the `searchPattern` in `state` is "",
		so it'll display all the items.
	*/
		
	import {useState} from "../../../state"
	import AppHider from "../../app-hider.vue"
	import Item from "./item.vue"
	import Search from "./search.vue"
	
	var props=defineProps(["isInitiallyShown", "title"])
	
	var state = useState();
	
</script>

<template>
	<AppHider id="items" title="Товары">
		<div v-if="state.items.length===0">
			Пока товаров нет...
		</div>
		<div v-else>
			<Search />
			<div v-for="item in state.filteredItems">
				<Item
					:id="item.id"
					:name="item.name"
					:vendor="item.vendor"
					:remain="item.remain"
				/>
			</div>
		</div>
	</AppHider>
</template>
