<template>
	<div class="grid-container" :style="{ height: containerHeight }">
		<div class="rv-header">
			<div class="rv-header-content">
				<h3 class="rv-title">{{ element.name }}</h3>

				<!-- this is a hardcoded value temporarily for testing purposes -->
				<span class="rv-record-count">{{ filterStatus }}</span>
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
				<span
					v-if="quicksearch"
					v-on:click="
						quicksearch = null;
						updateQuickSearch();
					"
					><md-icon>close</md-icon></span
				>
			</div>
			<span class="rv-button-divider"></span>
			<!-- <md-button id="lazy-filter" class="md-icon-button md-primary md-flat" v-on:click="toggleLazyFilters">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">weekend</md-icon>
			</md-button>
			<md-icon
				class="md-icon-small"
				v-if="lazyFilterEnabled"
				style="width: 20px; height: 20px; margin-right: 15px;"
				>check_box</md-icon
			>
			<md-icon class="md-icon-small" style="width: 20px; height: 20px; margin-right: 15px;" v-else
				>check_box_outline_blank</md-icon
			> -->
			<md-button id="icon" class="md-icon-button md-primary md-flat md-button-disabled" :disabled="true">
				<md-icon class="md-icon-small" style="width: 20px; height: 20px;">filter_list</md-icon>
			</md-button>
			<md-button id="icon" class="md-icon-button md-primary md-flat">
				<md-icon class="md-icon-small" style="width: 24px; height: 24px;"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fit=""
						height="100%"
						width="100%"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
						focusable="false"
					>
						<g id="map-refresh">
							<path
								d="m 15.585999,21.223066 2.414,-2.414 v 1.811 A 3.616,3.616 0 0 0 21.2,15.309066 l 0.881,-0.881 a 4.82,4.82 0 0 1 -4.080001,7.4 v 1.811 z m -13.5859988,-9.224 a 10,10 0 1 1 19.9999998,0 c 0,0.172 0,0.346 -0.013,0.517 a 5.971,5.971 0 0 0 -2.014001,-1.184001 7.935,7.935 0 0 0 -4.973,-6.742999 v 0.41 a 2,2 0 0 1 -2,2 h -2 v 2 A 1,1 0 0 1 10,9.9990662 H 8.0000002 v 1.9999998 h 5.9999988 a 1,1 0 0 1 0.495,0.131 6,6 0 0 0 -0.184,9.6 10.009,10.009 0 0 1 -12.3109988,-9.731 z m 2,0 a 8,8 0 0 0 6.9999988,7.93 v -1.93 a 2,2 0 0 1 -1.9999988,-2 v -1 l -4.79,-4.79 a 8.07,8.07 0 0 0 -0.21,1.79 z m 9.1729988,5 a 4.827,4.827 0 0 1 4.827,-4.828 v -1.81 l 2.414,2.414 -2.414,2.413 v -1.809 a 3.623,3.623 0 0 0 -3.62,3.62 3.537,3.537 0 0 0 0.42,1.69 l -0.881,0.881 a 4.787,4.787 0 0 1 -0.746,-2.571 z"
							></path>
						</g></svg
				></md-icon>
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
					<md-icon class="md-icon-small"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fit=""
							height="100%"
							width="100%"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 24 24"
							focusable="false"
						>
							<g id="format-list-checks">
								<path
									d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z"
								></path>
							</g></svg
					></md-icon>
				</md-button>

				<md-menu-content>
					<md-menu-item
						v-for="item in columnDefs"
						:key="item.name"
						v-on:click="
							columnApi.setColumnVisible(item.field, item.hide);
							item.hide = !item.hide;
						"
					>
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
					<md-menu-item
						v-on:click="
							fullscreen = false;
							getGridHeight();
						"
					>
						Split View
						<md-icon class="md-icon-small" v-if="!fullscreen">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
					<md-menu-item
						v-on:click="
							fullscreen = true;
							getGridHeight();
						"
					>
						Maximize
						<md-icon class="md-icon-small" v-if="fullscreen">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
					<div class="rv-separator"></div>
					<md-menu-item v-on:click="filterByExtent = !filterByExtent">
						<span>
							<md-icon class="md-icon-small"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									fit=""
									height="100%"
									width="100%"
									preserveAspectRatio="xMidYMid meet"
									viewBox="0 0 24 24"
									focusable="false"
								>
									<g id="filter">
										<path
											d="M 3,2L 20.9888,2L 21,2L 21,2.01122L 21,3.99999L 20.9207,3.99999L 14,10.9207L 14,22.909L 9.99999,18.909L 10,10.906L 3.09405,3.99999L 3,3.99999L 3,2 Z "
										></path>
									</g></svg
							></md-icon>
							Filter by extent
						</span>
						<md-icon class="md-icon-small" v-if="filterByExtent">check</md-icon>
						<md-icon class="md-icon-small" v-else></md-icon>
					</md-menu-item>
					<md-menu-item
						v-on:click="
							showFilters = !showFilters;
							gridOptions.floatingFilter = !gridOptions.floatingFilter;
							gridOptions.api.refreshHeader();
						"
					>
						<span>
							<md-icon class="md-icon-small"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									fit=""
									height="100%"
									width="100%"
									preserveAspectRatio="xMidYMid meet"
									viewBox="0 0 24 24"
									focusable="false"
								>
									<g id="filter">
										<path
											d="M 3,2L 20.9888,2L 21,2L 21,2.01122L 21,3.99999L 20.9207,3.99999L 14,10.9207L 14,22.909L 9.99999,18.909L 10,10.906L 3.09405,3.99999L 3,3.99999L 3,2 Z "
										></path>
									</g></svg
							></md-icon>
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
import CustomDateFilter from './CustomDateFilter';
import CustomSelectorFilter from './CustomSelectorFilter';
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
			filterInfo: {
				firstRow: 0,
				lastRow: 0,
				visibleRows: 0,
			},
			filterStatus: '',
			containerHeight: null,
			filterByExtent: false,
			showFilters: true,
			lazyFilterEnabled: true, // default mode set lazyFilters to true
		};
	},
	components: {
		AgGridVue,
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
				hide: false,
			},
			{
				headerName: 'COUNTRY',
				field: 'COUNTRY',
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agTextColumnFilter',
				isSelector: true,
				filterParams: {},
				width: 300,
			},
			{
				headerName: 'NAME',
				field: 'NAME',
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agTextColumnFilter',
				filterParams: {},
				width: 400,
			},
			{
				headerName: 'DATE',
				field: 'DATE',
				width: 380,
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agDateColumnFilter',
				filterParams: {},
			},
			{
				headerName: 'LATITUDE',
				field: 'LATITUDE',
				sortable: true,
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false,
			},
			{
				headerName: 'LONGITUDE',
				field: 'LONGITUDE',
				sortable: true,
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false,
			},
		];
		// set up column filterse
		this.columnDefs.forEach(col => {
			if (col.filter === 'agNumberColumnFilter') {
				this.setUpNumberFilter(col);
			} else if (col.filter === 'agTextColumnFilter') {
				!col.isSelector ? this.setUpTextFilter(col, this.lazyFilterEnabled) : this.setUpSelectorFilter(col);
			} else if (col.filter === 'agDateColumnFilter') {
				this.setUpDateFilter(col);
			}
		});
		// initialize row data
		this.rowData = this.createRowData();

		// imported separate components
		this.frameworkComponents = {
			agColumnHeader: CustomHeader,
			numberFloatingFilter: CustomNumberFilter,
			textFloatingFilter: CustomTextFilter,
			dateFloatingFilter: CustomDateFilter,
			selectorFloatingFilter: CustomSelectorFilter,
		};
	},
	methods: {
		onGridReady(params) {
			this.gridApi = params.api;
			this.columnApi = params.columnApi;
			// should load row data here
			this.getGridHeight();
			// initialize filter info + status
			this.updateFilterInfo();
		},
		updateQuickSearch() {
			this.gridApi.setQuickFilter(this.quicksearch);
		},
		// unused atm since we want to have lazy filters as default filter mode
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
					const re = new RegExp(`^${filterText.replace(/\*/, '.*')}`);
					return re.test(gridValue);
				};
			} else {
				colDef.filterParams.textCustomComparator = function(filter, gridValue, filterText) {
					// treat * as a regular special char with lazy filter on
					const newFilterText = filterText.replace(/\*/, '\\*');
					// surround filter text with .* to match anything before and after
					const re = new RegExp(`^.*${newFilterText}.*`);
					return re.test(gridValue);
				};
			}

			// modified from: https://www.ag-grid.com/javascript-grid-filter-text/#text-formatter
			let disregardAccents = function(s) {
				if (isNaN(s)) {
					// check if s is a number before trying to convert it to lowercase (otherwise throws error)
					let r = s.toLowerCase();
					r = r.replace(new RegExp('[àáâãäå]', 'g'), 'a');
					r = r.replace(new RegExp('æ', 'g'), 'ae');
					r = r.replace(new RegExp('ç', 'g'), 'c');
					r = r.replace(new RegExp('[èéêë]', 'g'), 'e');
					r = r.replace(new RegExp('[ìíîï]', 'g'), 'i');
					r = r.replace(new RegExp('ñ', 'g'), 'n');
					r = r.replace(new RegExp('[òóôõö]', 'g'), 'o');
					r = r.replace(new RegExp('œ', 'g'), 'oe');
					r = r.replace(new RegExp('[ùúûü]', 'g'), 'u');
					r = r.replace(new RegExp('[ýÿ]', 'g'), 'y');
					return r;
				}
				return s;
			};

			// for individual columns
			colDef.filterParams.textFormatter = function(s) {
				return disregardAccents(s);
			};
		},
		setUpDateFilter(colDef) {
			colDef.floatingFilterComponent = 'dateFloatingFilter';
			colDef.filterParams.inRangeInclusive = true;
			colDef.filterParams.comparator = function(filterDate, entryDate) {
				let entry = new Date(entryDate);
				if (entry > filterDate) {
					return 1;
				} else if (entry < filterDate) {
					return -1;
				} else {
					return 0;
				}
			};
			colDef.floatingFilterComponentParams = {
				suppressFilterButton: true,
			};
		},
		setUpSelectorFilter(colDef) {
			colDef.floatingFilterComponent = 'selectorFloatingFilter';
			colDef.floatingFilterComponentParams = {
				suppressFilterButton: true,
			};
			colDef.filterParams.textCustomComparator = function(filter, gridValue, filterText) {
				return filterText.includes(gridValue);
			};
		},
		updateFilterInfo() {
			// update filter info
			if (this.gridApi) {
				this.filterInfo.firstRow = this.gridApi.getFirstDisplayedRow() + 1;
				this.filterInfo.lastRow = this.gridApi.getLastDisplayedRow() + 1;
				this.filterInfo.visibleRows = this.gridApi.getDisplayedRowCount();
				this.updateFilterStatus();
			}
		},
		updateFilterStatus() {
			this.filterStatus = this.filterInfo.visibleRows !== this.rowData.length ?
					`${this.filterInfo.firstRow} - ${this.filterInfo.lastRow} of ${this.filterInfo.visibleRows} entries shown (filtered from ${this.rowData.length} records)` :
					`${this.filterInfo.firstRow} - ${this.filterInfo.lastRow} of ${this.filterInfo.visibleRows} entries shown`;
		},
		getGridHeight() {
			if (this.fullscreen) {
				this.gridHeight = 'calc(98vh - 49px)';
				this.containerHeight = '98vh !important';
			} else {
				this.gridHeight = 'calc(50vh - 49px)';
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
					DATE: '2020-01-02',
					LATITUDE: 129.17,
					LONGITUDE: -115.25,
				},
				{
					OBJECTID: 2,
					COUNTRY: 'Canada',
					NAME: 'Mainline',
					DATE: '2019-12-25',
					LATITUDE: 132.38,
					LONGITUDE: -118.72,
				},
				{
					OBJECTID: 3,
					COUNTRY: 'United States',
					NAME: 'Southern California Gas Co',
					DATE: '2005-05-02',
					LATITUDE: 31.34,
					LONGITUDE: -110.97,
				},
				{
					OBJECTID: 4,
					COUNTRY: 'Canada',
					NAME: 'Cornwall Pipeline',
					DATE: '2020-01-15',
					LATITUDE: 44.99,
					LONGITUDE: -74.72,
				},
				{
					OBJECTID: 5,
					COUNTRY: 'United States',
					NAME: 'Bluewater Pipeline Co',
					DATE: '2019-11-29',
					LATITUDE: 0,
					LONGITUDE: 0,
				},
				{
					OBJECTID: 6,
					COUNTRY: 'United States',
					NAME: 'San Diego Gas and Electric',
					DATE: '2010-10-01',
					LATITUDE: 32.55,
					LONGITUDE: -116.90,
				},
				{
					OBJECTID: 7,
					COUNTRY: 'United States',
					NAME: 'Maritimes & Northeast Pipeline Co',
					DATE: '2012-12-31',
					LATITUDE: 45.20,
					LONGITUDE: -67.45,
				},
				{
					OBJECTID: 8,
					COUNTRY: 'United States',
					NAME: 'Great Lakes Transmission',
					DATE: '2015-07-01',
					LATITUDE: 46.45,
					LONGITUDE: -84.44,
				},
				{
					OBJECTID: 9,
					COUNTRY: 'United States',
					NAME: 'Viking Gas Tranmssion',
					DATE: '1998-05-14',
					LATITUDE: 48.99,
					LONGITUDE: -97.05,
				},
				{
					OBJECTID: 10,
					COUNTRY: 'Canada',
					NAME: 'Carway Line',
					DATE: '2024-06-06',
					LATITUDE: 48.99,
					LONGITUDE: -113.28,
				},
				{
					OBJECTID: 11,
					COUNTRY: 'Canada',
					NAME: 'Mainline',
					DATE: '2019-03-15',
					LATITUDE: 45.22,
					LONGITUDE: -67.43,
				},
				{
					OBJECTID: 12,
					COUNTRY: 'Canada',
					NAME: 'Vector',
					DATE: '2019-10-31',
					LATITUDE: 42.79,
					LONGITUDE: -82.47,
				},
			];
		},
	},
	created() {
		this.gridOptions = {
			enableFilter: true,
			floatingFilter: true,
			suppressRowTransform: true,
			onFilterChanged: this.updateFilterInfo,
			onBodyScroll: this.updateFilterInfo,
			rowBuffer: 0,
		};
	},
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
.md-datepicker-dialog {
	position: relative;
	z-index: 9999 !important;
	background: #fff;
}
/* TODO: change md-select font to match other input fields */
.md-select-value {
	font: 400 13.3333px Arial;
}
.md-menu-content {
	background: #fff;
}
.md-menu.md-select {
	overflow: hidden;
}
.md-list-item-content {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.84);
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
