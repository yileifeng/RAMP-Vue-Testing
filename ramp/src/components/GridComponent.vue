<template>
	<ag-grid-vue
		style="width: 500px; height: 300px;"
		class="ag-grid-test ag-theme-balham"
		:columnDefs="columnDefs"
		:rowData="rowData"
		:modules="modules"
		:suppressDragLeaveHidesColumns="true"
	>
	</ag-grid-vue>
</template>

<script>
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { AgGridVue } from '@ag-grid-community/vue';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TableBuilder } from '../enhancedTable/index';

export default {
	name: 'GridComponent',
	props: ['element'],
	data() {
		return {
			columnDefs: null,
			rowData: null,
			modules: AllCommunityModules,
		};
	},
	components: {
		AgGridVue,
	},
	beforeMount() {
		this.columnDefs = [
			{ headerName: 'OBJECTID', field: 'OBJECTID', sortable: true, filter: 'agNumberColumnFilter' },
			{ headerName: 'COUNTRY', field: 'COUNTRY', sortable: true, filter: 'agTextColumnFilter' },
			{ headerName: 'NAME', field: 'NAME', sortable: true, filter: 'agTextColumnFilter' },
			{ headerName: 'DATE', field: 'DATE', sortable: true, filter: 'agDateColumnFilter' },
		];

		this.rowData = [
			{ OBJECTID: 1, COUNTRY: 'Mexico', NAME: 'Cornwall Pipeline', DATE: '01/01/2020' },
			{ OBJECTID: 2, COUNTRY: 'Canada', NAME: 'Mainline', DATE: '12/25/2019' },
			{ OBJECTID: 3, COUNTRY: 'United States', NAME: 'Bluewater Pipeline Co', DATE: '11/29/2019' },
		];
	},
};
</script>

<style>
.ag-grid-test {
	position: absolute;
	margin-left: 500px;
	width: 602px !important;
	bottom: 500px;
}
</style>
