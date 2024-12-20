<script setup>
	import Create from "./create.vue"
	import {useState} from "../state"
	
	var state=useState()
</script>

<template>
	<div>------------- CREATE VENDOR BEGINING --------------</div>
	<Create
		@oncreate="(name)=>state.addVendor(name)"
		target="поставщика"
	/>
	<div>------------- CREATE VENDOR END --------------</div>
</template>
