<script setup>
	import {useState} from "../../../state"
	
	var state = useState();
</script>

<template>
	<div class="search-container">
		<input
			placeholder="Поиск"
			v-model="state.searchPattern"
		/>
	</div>
</template>

<style>
	.search-container {
		width: 100%;
		background: #fff;
	}
</style>
