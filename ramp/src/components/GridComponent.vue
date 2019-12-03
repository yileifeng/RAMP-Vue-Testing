<template>
	<div>
		<ag-grid-vue
			style="width: 500px; height: 300px;"
			class="ag-grid-test ag-theme-material"
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
import '@ag-grid-community/all-modules/dist/styles/ag-theme-material.css';
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
				lockPosition: true,
				width: 500
			},
			{
				headerName: 'NAME',
				field: 'NAME',
				sortable: true,
				filter: 'agTextColumnFilter',
				lockPosition: true,
				width: 500
			},
			{
				headerName: 'DATE',
				field: 'DATE',
				sortable: true,
				filter: 'agDateColumnFilter',
				lockPosition: true,
				width: 300
			}
		];

		this.rowData = [
			{ OBJECTID: 1, COUNTRY: 'Mexico', NAME: 'Cornwall Pipeline', DATE: '01/01/2020' },
			{ OBJECTID: 2, COUNTRY: 'Canada', NAME: 'Mainline', DATE: '12/25/2019' },
			{ OBJECTID: 3, COUNTRY: 'United States', NAME: 'Bluewater Pipeline Co', DATE: '11/29/2019' },
			{ OBJECTID: 4, COUNTRY: 'United States', NAME: 'Bluewater Pipeline Co', DATE: '11/29/2019' },
			{ OBJECTID: 5, COUNTRY: 'Canada', NAME: 'Bluewater Pipeline Co', DATE: '11/29/2019' },
			{ OBJECTID: 6, COUNTRY: 'United States', NAME: 'Bluewater Pipeline Co', DATE: '11/29/2019' }
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
	margin-left: 375px;
	width: calc(100% - 22vw) !important;
	height: 50vh !important;
	bottom: 500px;
	box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
		0px 2px 1px -1px rgba(0, 0, 0, 0.12);
	top: 0px;
}
</style>
