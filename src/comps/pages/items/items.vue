<script setup>
	/*
		Items table.
		This component displays only filtered items.
		by default the `searchPattern` in `state` is "",
		so it'll display all the items.
	*/
	
	import Item from "./item.vue"
	import {useState} from "../../../state"
	
	var state = useState();
</script>

<template>
	<div v-if="state.items.length===0">
		Пока товаров нет...
	</div>
	<div v-else>
		<table class="items-table">
			<thead>
				<tr class="items-row">
					<th>№</th>
					<th>Наименование</th>
					<th>Поставщик</th>
					<th class="th-remain">Остаток</th>
					<th>В пути</th>
					<th>Транзитный склад</th>
				</tr>
			</thead>
			<tbody>
				<Item
					v-if="state.filteredItems.length > 0"
					v-for="(item,idx) in state.filteredItems"
					:id="item.id"
					:idx="idx+1"
					:name="item.name"
					:vendor="item.vendor"
					:remain="item.remain"
					:comment="item.comment"
				/>
		</tbody>
		</table>
	</div>
</template>

<style>
	.search-req {
		font-weight: bold;
	}
	
	table {
		width: 100%;
		font-size: 16px;
	}
	
	.items-table td, th {
    	border: 1px solid black;
	}
	
	td {
		text-align: center; 
		vertical-align: middle;
	}
	
	th {
		background: #0000002e;
	}
	
	.th-remain {
		color: red;
	}
	
	.td-tmp {
		color: red;
	}
	
	.tr-verbose {
		background: #1ab3487d!important;
	}
	
	.tr-verbose:nth-child(even) {
		background: #16943c47!important;
	}
	
	tr {
		background: #fff;
	}
	
	tr:nth-child(even) {
		background-color: #c7c7c75d;
	}
	
	.tr-comment {
		background: #fffc5b66!important;
	}
	
	.td-comment {
		text-align: left;
	}
</style>
