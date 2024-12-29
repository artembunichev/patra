<script setup>
	import {useState} from "../../../state"
	
	var state = useState();
</script>

<template>
	<div>
		<input
			placeholder="Поиск"
			v-model="state.searchPattern"
		/>
	</div>
</template>
