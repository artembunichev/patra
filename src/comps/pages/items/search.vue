<script setup>
	import {useState} from "../../../state"
	
	var state = useState();
</script>

<template>
	<div class="search-container">
		<input
			class="search-input"
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
	.search-input {
		width: 100%;
	}
</style>
