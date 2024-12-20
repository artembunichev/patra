<script setup>
	import {useState} from "../../state"
	import Hider from "../hider.vue"
	
	var props=defineProps(["isInitiallyShown"])
	
	var state = useState();
	
</script>

<template>
	<Hider title="История" :isInitiallyShown="props.isInitiallyShown">
		История...
	</Hider>
</template>
