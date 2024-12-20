<script setup>
	import {useState} from "../../state"
	import Hider from "../hider.vue"
	
	var props=defineProps(["isInitiallyShown", "title"])
	
	var state = useState();
	
</script>

<template>
	<Hider title="Товары" :isInitiallyShown="props.isInitiallyShown">
		<div v-if="state.items.length===0">
			Пока товаров нет...
		</div>
		<div v-else v-for="item in state.items">
			<div>название: {{ item.name }}</div>
			<div>поставщик: {{ item.vendor }}</div>
			<div>
				осталось:
				<div v-for="(remain,store) in item.remain">
					<span>{{ store }}: {{ remain }}шт.</span>
				</div>
			</div>
		</div>
	</Hider>
</template>
