<template>
	<div>
		<ag-grid-vue
			style="width: 500px; height: 300px;"
			class="ag-grid-test ag-theme-balham"
			:gridOptions="gridOptions"
			:columnDefs="columnDefs"
			:rowData="rowData"
			:modules="modules"
			:frameworkComponents="frameworkComponents"
			@grid-ready="onGridReady"
		>
		</ag-grid-vue>
	</div>
</template>

<script>
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { AgGridVue } from '@ag-grid-community/vue';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { TableBuilder } from '../enhancedTable/index';
import CustomHeader from './CustomHeader';

export default {
	name: 'GridComponent',
	data() {
		return {
			columnDefs: null,
			rowData: null,
			modules: AllCommunityModules
		};
	},
	components: {
		AgGridVue
	},
	beforeMount() {
		this.columnDefs = [
			{
				headerName: 'OBJECTID',
				field: 'OBJECTID',
				sortable: true,
				filter: 'agNumberColumnFilter',
				lockPosition: true
			},
			{
				headerName: 'COUNTRY',
				field: 'COUNTRY',
				sortable: true,
				filter: 'agTextColumnFilter',
				lockPosition: true
			},
			{ headerName: 'NAME', field: 'NAME', sortable: true, filter: 'agTextColumnFilter', lockPosition: true },
			{ headerName: 'DATE', field: 'DATE', sortable: true, filter: 'agDateColumnFilter', lockPosition: true }
		];

		this.rowData = [
			{ OBJECTID: 1, COUNTRY: 'Mexico', NAME: 'Cornwall Pipeline', DATE: '01/01/2020' },
			{ OBJECTID: 2, COUNTRY: 'Canada', NAME: 'Mainline', DATE: '12/25/2019' },
			{ OBJECTID: 3, COUNTRY: 'United States', NAME: 'Bluewater Pipeline Co', DATE: '11/29/2019' }
		];

		this.frameworkComponents = { agColumnHeader: CustomHeader };
	},
	methods: {
		onGridReady(params) {
			this.gridApi = params.api;
			this.columnApi = params.columnApi;
		}
	},
	created() {
		this.gridOptions = {
			enableFilter: true
		};
	}
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
