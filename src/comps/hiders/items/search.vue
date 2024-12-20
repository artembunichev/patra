<script setup>
	import {useState} from "../../../state"
	
	var state = useState();
</script>

<template>
	<div>
		<input v-model="state.searchPattern"/>
	</div>
</template>
