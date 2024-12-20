<script setup>
	import Create from "./create.vue"
	import {useState} from "../state"
	
	var state=useState()
	
	var sameNameErr = (name)=> {
		return `Склад с названием "${name}" уже существует.`
	}
	
</script>

<template>
	<div>------------- CREATE STORE BEGINING --------------</div>
	<Create
		:checkForSameName="state.validateStoreName"
		:getSameNameErrorText="sameNameErr"
		@oncreate="(name)=>state.addStore(name)"
		target="cклад"
	/>
	<div>------------- CREATE STORE END --------------</div>
</template>
