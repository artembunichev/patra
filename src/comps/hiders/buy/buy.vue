<script setup>
	import {useState} from "../../../state"
	import Hider from "../../hider.vue"
	
	var props=defineProps(["isInitiallyShown"])
	
	var state = useState();
	
</script>

<template>
	<Hider title="Закупка" :isInitiallyShown="props.isInitiallyShown">
		Список закупки...
	</Hider>
</template>
