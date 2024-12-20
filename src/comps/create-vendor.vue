<script setup>
	import Create from "./create.vue"
	import {useState} from "../state"
	
	var state=useState()
	
	var sameNameErr = (name)=> {
		return `Поставщик под названием "${name}" уже существует.`
	}
	
</script>

<template>
	<div>------------- CREATE VENDOR BEGINING --------------</div>
	<Create
		:checkForSameName="state.validateVendorName"
		:getSameNameErrorText="sameNameErr"
		@oncreate="(name)=>state.addVendor(name)"
		target="поставщика"
	/>
	<div>------------- CREATE VENDOR END --------------</div>
</template>
