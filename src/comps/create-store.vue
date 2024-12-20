<script setup>
	import Create from "./create.vue"
	import {useState} from "../state"
	
	var state=useState()
</script>

<template>
	<div>------------- CREATE STORE BEGINING --------------</div>
	<Create
		@oncreate="(name)=>state.addStore(name)"
		target="cклад"
	/>
	<div>------------- CREATE STORE END --------------</div>
</template>
