<script setup>
	/*
		This component displays only filtered items.
		by default the `searchPattern` in `state` is "",
		so it'll display all the items.
	*/
		
	import {useState} from "../../../state"
	import Hider from "../../hider.vue"
	import Item from "./item.vue"
	import Search from "./search.vue"
	
	var props=defineProps(["isInitiallyShown", "title"])
	
	var state = useState();
	
</script>

<template>
	<Hider title="Товары" :isInitiallyShown="props.isInitiallyShown">
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
	</Hider>
</template>
