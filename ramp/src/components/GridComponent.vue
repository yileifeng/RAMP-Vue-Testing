<template>
	<div class="grid-container" :style="{ height: containerHeight }">
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
			<md-button id="lazy-filter" class="md-icon-button md-primary md-flat" v-on:click="toggleLazyFilters">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">weekend</md-icon>
			</md-button>
			<md-icon class="md-icon-small" v-if="lazyFilterEnabled" style="width: 20px; height: 20px; margin-right: 15px;">check_box</md-icon>
			<md-icon class="md-icon-small" style="width: 20px; height: 20px; margin-right: 15px;" v-else>check_box_outline_blank</md-icon>
			<md-button id="icon" class="md-icon-button md-primary md-flat" @click="clearColumnFilters()">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">filter_list</md-icon>
			</md-button>
			<md-button id="icon" class="md-icon-button md-primary md-flat">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">refresh</md-icon>
			</md-button>
			<md-menu
				style="z-index: 9;"
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

			<md-menu
				style="z-index: 10;"
				md-size="huge"
				:md-offset-x="-280"
				:md-offset-y="-30"
				:md-close-on-click="false"
				:md-close-on-select="false"
			>
				<md-button id="icon" class="md-icon-button md-primary md-flat" md-menu-trigger>
					<md-icon class="md-icon-small">more_vert</md-icon>
				</md-button>

				<md-menu-content>
					<md-menu-item v-on:click="fullscreen = false; getGridHeight();">
						Split View
						<md-icon class="md-icon-small" v-if="!fullscreen">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
					<md-menu-item v-on:click="fullscreen = true; getGridHeight();">
						Maximize
						<md-icon class="md-icon-small" v-if="fullscreen">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
					<div class="rv-separator"></div>
					<md-menu-item v-on:click="filterByExtent = !filterByExtent">
						<span>
							<md-icon class="md-icon-small"><svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false"><g id="filter"><path d="M 3,2L 20.9888,2L 21,2L 21,2.01122L 21,3.99999L 20.9207,3.99999L 14,10.9207L 14,22.909L 9.99999,18.909L 10,10.906L 3.09405,3.99999L 3,3.99999L 3,2 Z "></path></g></svg></md-icon>
							Filter by extent
						</span>
						<md-icon class="md-icon-small" v-if="filterByExtent">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
					<md-menu-item v-on:click="showFilters = !showFilters; gridOptions.floatingFilter = !gridOptions.floatingFilter; gridOptions.api.refreshHeader()">
						<span>
							<md-icon class="md-icon-small"><svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false"><g id="filter"><path d="M 3,2L 20.9888,2L 21,2L 21,2.01122L 21,3.99999L 20.9207,3.99999L 14,10.9207L 14,22.909L 9.99999,18.909L 10,10.906L 3.09405,3.99999L 3,3.99999L 3,2 Z "></path></g></svg></md-icon>
							Show filters
						</span>
						<md-icon class="md-icon-small" v-if="showFilters">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
					<div class="rv-separator"></div>
					<md-menu-item>
						<span>
							<md-icon class="md-icon-small">insert_drive_file</md-icon>
							Export
						</span>
					</md-menu-item>
				</md-menu-content>
			</md-menu>

			<md-button id="icon" class="md-icon-button md-primary md-flat" @click="element.tableOpen = false">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">close</md-icon>
			</md-button>
		</div>
		<ag-grid-vue
			class="ag-grid-test ag-theme-material"
			:style="{ height: gridHeight }"
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
import CustomTextFilter from './CustomTextFilter';
import CustomHeader from './CustomHeader';

export default {
	name: 'GridComponent',
	props: ['element'],
	data() {
		return {
			columnDefs: null,
			rowData: null,
			modules: AllCommunityModules,
			quicksearch: null,
			fullscreen: false,
			gridHeight: null,
			containerHeight: null,
			filterByExtent: false,
			showFilters: true,
			lazyFilterEnabled: false
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
				hide: false,
				filter: 'agTextColumnFilter',
				filterParams: {},
				width: 300
			},
			{
				headerName: 'NAME',
				field: 'NAME',
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agTextColumnFilter',
				filterParams: {},
				width: 400
			},
			{
				headerName: 'DATE',
				field: 'DATE',
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agTextColumnFilter',
				filterParams: {}
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
				this.setUpNumberFilter(col);
			} else if (col.filter === 'agTextColumnFilter') {
				// TODO: selector filter
				this.setUpTextFilter(col, false);
			} else if (col.filter === 'agDateColumnFilter') {
				// TODO
			}
		});
		this.rowData = this.createRowData();

		this.frameworkComponents = {
			agColumnHeader: CustomHeader,
			numberFloatingFilter: CustomNumberFilter,
			textFloatingFilter: CustomTextFilter
		};
	},
	methods: {
		onGridReady(params) {
			this.gridApi = params.api;
			this.columnApi = params.columnApi;

			this.getGridHeight();
		},
		updateQuickSearch() {
			this.gridApi.setQuickFilter(this.quicksearch);
		},
		toggleLazyFilters() {
			// problem: after applying filters to column on a lazy filters, toggling filters mode does not change the previously filtered column settings
			// changing search filter mode
			this.lazyFilterEnabled = !this.lazyFilterEnabled;
			this.columnDefs.forEach(col => {
				if (col.filter === 'agTextColumnFilter') {
					this.setUpTextFilter(col, this.lazyFilterEnabled);
				}
			});
			// reset column state
			this.columnApi.resetColumnState();
			// clear all active filters
			this.gridApi.setFilterModel(null);
			this.gridApi.onFilterChanged();
		},
		setUpNumberFilter(colDef) {
			colDef.floatingFilterComponent = 'numberFloatingFilter';
			colDef.filterParams.inRangeInclusive = true;
			colDef.floatingFilterComponentParams = {
				suppressFilterButton: true,
			};
		},
		setUpTextFilter(colDef, lazyFilterEnabled) {
			colDef.floatingFilterComponent = 'textFloatingFilter';
			colDef.floatingFilterComponentParams = {
				suppressFilterButton: true,
			};
			// default to regex filtering for text columns
			if (!lazyFilterEnabled) {
				colDef.filterParams.textCustomComparator = function(filter, gridValue, filterText) {
					console.log("non lazy");
					const re = new RegExp(`^${filterText.replace(/\*/, '.*')}`);
					return re.test(gridValue);
				};
			} else {
				colDef.filterParams.textCustomComparator = function(filter, gridValue, filterText) {
					console.log('lazy');
					// treat * as a regular special char with lazy filter on
					const newFilterText = filterText.replace(/\*/, '\\*');
					// surround filter text with .* to match anything before and after
					const re = new RegExp(`^.*${newFilterText}.*`);
					return re.test(gridValue);
				};
			}

			// modified from: https://www.ag-grid.com/javascript-grid-filter-text/#text-formatter
			let disregardAccents = function (s) {
				if (isNaN(s)) {
					// check if s is a number before trying to convert it to lowercase (otherwise throws error)
					let r = s.toLowerCase();
					r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
					r = r.replace(new RegExp("æ", 'g'), "ae");
					r = r.replace(new RegExp("ç", 'g'), "c");
					r = r.replace(new RegExp("[èéêë]", 'g'), "e");
					r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
					r = r.replace(new RegExp("ñ", 'g'), "n");
					r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
					r = r.replace(new RegExp("œ", 'g'), "oe");
					r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
					r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
					return r;
				}
				return s;
			}

			// for individual columns
			colDef.filterParams.textFormatter = function (s) {
				return disregardAccents(s);
			}
		},
		getGridHeight() {
			if(this.fullscreen) {
				this.gridHeight = 'calc(98vh - 49px)'
				this.containerHeight = '98vh !important'
			} else {
				this.gridHeight = 'calc(50vh - 49px)'
				this.containerHeight = '50vh !important';
			}
		},
		clearColumnFilters() {
			this.gridApi.setQuickFilter(null);
			this.quicksearch = null;

			this.gridOptions.api.setFilterModel({});
			this.gridApi.refreshHeader();
		},
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
		},
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
	bottom: 500px;
	box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
		0px 2px 1px -1px rgba(0, 0, 0, 0.12);
	top: 0px;
}
.ag-grid-test {
	height:
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
	color: rgba(0,0,0,.84);
}
.md-list-item-content > .md-icon {
	font-size: 22px !important;
}
.rv-separator {
	background: #ddd;
	height: 1px;
	width: 100%;
	margin: 5px 0px 5px 0px;
}
</style>
