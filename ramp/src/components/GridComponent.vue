<template>
	<div class="grid-container">
		<div class="rv-header">
			<div class="rv-header-content">
				<h3 class="rv-title">{{ element.name }}</h3>

				<!-- this is a hardcoded value temporarily for testing purposes -->
				<span class="rv-record-count">1 - 6 of 6 entries shown</span>
			</div>
			<span class="flex"></span>

			<!-- table controls -->
			<div class="rv-table-search">
				<input
					@keyup="updateQuickSearch"
					v-model="quicksearch"
					placeholder="Search table"
					class="ng-pristine ng-valid rv-input ng-empty ng-touched"
					id="input_687"
					aria-invalid="false"
					style=""
				/>
				<md-icon v-if="!quicksearch">search</md-icon>
				<span v-if="quicksearch" v-on:click="quicksearch = null;updateQuickSearch();"><md-icon>close</md-icon></span>
			</div>
			<span class="rv-button-divider"></span>
			<md-button id="icon" class="md-icon-button md-primary md-flat md-button-disabled" :disabled="true">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">filter_list</md-icon>
			</md-button>
			<md-button id="icon" class="md-icon-button md-primary md-flat">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">refresh</md-icon>
			</md-button>
			<md-menu
				style="z-index: 10;"
				md-size="huge"
				:md-offset-x="-280"
				:md-offset-y="-30"
				:md-close-on-click="false"
				:md-close-on-select="false"
			>
				<md-button id="icon" class="md-icon-button md-primary md-flat" md-menu-trigger>
					<md-icon class="md-icon-small"><svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false"><g id="format-list-checks"><path d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z"></path></g></svg></md-icon>
				</md-button>

				<md-menu-content>
					<md-menu-item v-for="item in columnDefs" :key="item.name" v-on:click="columnApi.setColumnVisible(item.field, item.hide); item.hide = !item.hide">
						{{ item.headerName }}
						<md-icon class="md-icon-small" v-if="!item.hide">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
				</md-menu-content>
			</md-menu>
			<md-button id="icon" class="md-icon-button md-primary md-flat">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">more_vert</md-icon>
			</md-button>
			<md-button id="icon" class="md-icon-button md-primary md-flat" @click="element.tableOpen = false">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">close</md-icon>
			</md-button>
		</div>
		<ag-grid-vue
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
import CustomNumberFilter from './CustomNumberFilter';
import CustomHeader from './CustomHeader';

export default {
	name: 'GridComponent',
	props: ['element'],
	data() {
		return {
			columnDefs: null,
			rowData: null,
			modules: AllCommunityModules,
			quicksearch: null
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
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false
			},
			{
				headerName: 'COUNTRY',
				field: 'COUNTRY',
				sortable: true,
				lockPosition: true,
				hide: false
			},
			{
				headerName: 'NAME',
				field: 'NAME',
				sortable: true,
				lockPosition: true,
				hide: false
			},
			{
				headerName: 'DATE',
				field: 'DATE',
				sortable: true,
				lockPosition: true,
				hide: false
			},
			{
				headerName: 'LATITUDE',
				field: 'LATITUDE',
				sortable: true,
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false
			},
			{
				headerName: 'LONGITUDE',
				field: 'LONGITUDE',
				sortable: true,
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false
			}
		];
		this.columnDefs.forEach(col => {
			if (col.filter === 'agNumberColumnFilter') {
				this.setUpNumberFilter(col, true);
			}
		});
		this.rowData = this.createRowData();

		this.frameworkComponents = {
			agColumnHeader: CustomHeader,
			numberFloatingFilter: CustomNumberFilter
		};
	},
	methods: {
		onGridReady(params) {
			this.gridApi = params.api;
			this.columnApi = params.columnApi;
		},
		updateQuickSearch() {
			this.gridApi.setQuickFilter(this.quicksearch);
		},
		/** Sets up number floating filter accounting for static types and default values */
		setUpNumberFilter(colDef, lazyFilterEnabled) {
			colDef.floatingFilterComponent = 'numberFloatingFilter';
			colDef.filterParams.inRangeInclusive = true;
			colDef.floatingFilterComponentParams = {
				suppressFilterButton: true
			};
		},
		/** Sets up text floating filter accounting for static types, default values and selector types */
		// setUpTextFilter(colDef, lazyFilterEnabled) {
		// default to regex filtering for text columns
		// if (!lazyFilterEnabled) {
		// colDef.filterParams.textCustomComparator = function (value, filterText) {
		//     const re = new RegExp(`^${filterText.replace(/\*/, '.*')}`);
		//     return re.test(value);
		// }
		// } else {
		// colDef.filterParams.textCustomComparator = function (value, filterText) {
		//     // treat * as a regular special char with lazy filter on
		//     const newFilterText = filterText.replace(/\*/, '\\*');
		//     // surround filter text with .* to match anything before and after
		// 	const re = new RegExp(`^.*${newFilterText}.*`);
		//     return re.test(value);
		// }
		// }
		// },
		createRowData() {
			return [
				{
					OBJECTID: 1,
					COUNTRY: 'Mexico',
					NAME: 'Cornwall Pipeline',
					DATE: '01/01/2020',
					LATITUDE: 129.17,
					LONGITUDE: -115.25
				},
				{
					OBJECTID: 2,
					COUNTRY: 'Canada',
					NAME: 'Mainline',
					DATE: '12/25/2019',
					LATITUDE: 132.38,
					LONGITUDE: -118.72
				},
				{
					OBJECTID: 3,
					COUNTRY: 'United States',
					NAME: 'Bluewater Pipeline Co',
					DATE: '11/29/2019',
					LATITUDE: 0,
					LONGITUDE: 0
				}
			];
		}
	},
	created() {
		this.gridOptions = {
			enableFilter: true,
			floatingFilter: true
		};
	}
};
</script>

<style>
.grid-container {
	position: absolute;
	margin-left: 375px;
	width: calc(100% - 22vw) !important;
	height: 50vh !important;
	bottom: 500px;
	box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
		0px 2px 1px -1px rgba(0, 0, 0, 0.12);
	top: 0px;
}
.ag-grid-test {
	height: calc(50vh - 49px);
}
.rv-header {
	display: flex;
	white-space: nowrap;
	border-bottom: 1px solid #e0e0e0;
	height: auto;
	min-height: 49px;
	align-items: center;
	padding: 0 0 0 16px;
}
.rv-header-content {
	overflow: hidden;
}
.rv-record-count {
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 100%;
	overflow: hidden;
	margin-top: 5px;
	margin-bottom: 0;
	line-height: 11px;
	font-size: 13px;
}
.rv-title {
	margin: 0px;
	font-size: 20px;
	font-weight: bold;
	line-height: 24px;
	letter-spacing: 0.005em;
}
.rv-button-divider {
	border-right: #b6b6b6 1px solid;
	margin-right: 10px;
	margin-left: 10px;
	height: 26px;
}
.rv-input {
	order: 2;
	display: inline-block;
	margin-top: 0;
	background: none;
	padding-top: 2px;
	padding-bottom: 1px;
	padding-left: 2px;
	padding-right: 2px;
	border-width: 0 0 1px 0;
	border-bottom: 1px solid #ddd;
	line-height: 26px;
	height: 30px;
	-ms-flex-preferred-size: 26px;
	border-radius: 0;
	border-style: solid;
	width: 90%;
	box-sizing: border-box;
	outline: 0;
}
.flex {
	flex: 1;
}
.md-button-disabled {
	color: rgba(0, 0, 0, 0.38);
}
.md-menu-content {
	background: #fff;
}
.md-list-item-content {
	font-size: 14px;
}
.md-list-item-content > .md-icon {
	font-size: 22px !important;
}
</style>
