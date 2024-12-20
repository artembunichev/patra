<script setup>
	import {useState} from "../../state"
	import Hider from "../hider.vue"
	
	var props=defineProps(["isInitiallyShown"])
	
	var state = useState();
	
</script>

<template>
	<Hider title="Заказы" :isInitiallyShown="props.isInitiallyShown">
		Список заказов...
	</Hider>
</template>
