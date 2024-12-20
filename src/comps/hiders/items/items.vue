<script setup>
	import {useState} from "../../../state"
	import Hider from "../../hider.vue"
	import Item from "./item.vue"
	
	var props=defineProps(["isInitiallyShown", "title"])
	
	var state = useState();
	
</script>

<template>
	<Hider title="Товары" :isInitiallyShown="props.isInitiallyShown">
		<div v-if="state.items.length===0">
			Пока товаров нет...
		</div>
		<div v-else v-for="item in state.items">
			<Item
				:id="item.id"
				:name="item.name"
				:vendor="item.vendor"
				:remain="item.remain"
			/>
		</div>
	</Hider>
</template>
