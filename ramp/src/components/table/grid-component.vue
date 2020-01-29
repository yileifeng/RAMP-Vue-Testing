<template>
    <div class="grid-container" :style="{ height: containerHeight }">
        <div class="rv-header">
            <div class="rv-header-content">
                <h3 class="rv-title">[ layer name ] here</h3>
                <span class="rv-record-count">{{ filterStatus }}</span>
            </div>
            <span class="flex"></span>

            <!-- table controls -->
            <div class="rv-table-search">
                <input @keyup="updateQuickSearch" v-model="quicksearch" placeholder="Search table" class="rv-input" aria-invalid="false" />
                <span id="icon" v-if="!quicksearch" style="vertical-align: middle;">
                    <svg height="24" width="24">
                        <g id="search">
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                            />
                        </g>
                    </svg>
                </span>
                <button
                    v-if="quicksearch"
                    v-on:click="
                        quicksearch = null;
                        updateQuickSearch();
                    "
                    style="vertical-align: middle;"
                >
                    <svg height="24" width="24">
                        <g id="close">
                            <path
                                d="M 19,6.41L 17.59,5L 12,10.59L 6.41,5L 5,6.41L 10.59,12L 5,17.59L 6.41,19L 12,13.41L 17.59,19L 19,17.59L 13.41,12L 19,6.41 Z "
                            />
                        </g>
                    </svg>
                </button>
            </div>
            <span class="rv-button-divider"></span>
            <div id="icon" class="md-icon-button" :disabled="true">
                <svg height="24" width="24">
                    <g id="filter_remove">
                        <path
                            d="M 14.7574,20.8284L 17.6036,17.9822L 14.7574,15.1716L 16.1716,13.7574L 19.0178,16.568L 21.8284,13.7574L 23.2426,15.1716L 20.432,17.9822L 23.2426,20.8284L 21.8284,22.2426L 19.0178,19.3964L 16.1716,22.2426L 14.7574,20.8284 Z M 2,2L 19.9888,2.00001L 20,2.00001L 20,2.01122L 20,3.99999L 19.9207,3.99999L 13,10.9207L 13,22.909L 8.99999,18.909L 8.99999,10.906L 2.09405,3.99999L 2,3.99999L 2,2 Z "
                        />
                    </g>
                </svg>
            </div>
            <div id="icon" class="md-icon-button">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fit=""
                    height="24"
                    width="24"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    focusable="false"
                >
                    <g id="map-refresh">
                        <path
                            d="m 15.585999,21.223066 2.414,-2.414 v 1.811 A 3.616,3.616 0 0 0 21.2,15.309066 l 0.881,-0.881 a 4.82,4.82 0 0 1 -4.080001,7.4 v 1.811 z m -13.5859988,-9.224 a 10,10 0 1 1 19.9999998,0 c 0,0.172 0,0.346 -0.013,0.517 a 5.971,5.971 0 0 0 -2.014001,-1.184001 7.935,7.935 0 0 0 -4.973,-6.742999 v 0.41 a 2,2 0 0 1 -2,2 h -2 v 2 A 1,1 0 0 1 10,9.9990662 H 8.0000002 v 1.9999998 h 5.9999988 a 1,1 0 0 1 0.495,0.131 6,6 0 0 0 -0.184,9.6 10.009,10.009 0 0 1 -12.3109988,-9.731 z m 2,0 a 8,8 0 0 0 6.9999988,7.93 v -1.93 a 2,2 0 0 1 -1.9999988,-2 v -1 l -4.79,-4.79 a 8.07,8.07 0 0 0 -0.21,1.79 z m 9.1729988,5 a 4.827,4.827 0 0 1 4.827,-4.828 v -1.81 l 2.414,2.414 -2.414,2.413 v -1.809 a 3.623,3.623 0 0 0 -3.62,3.62 3.537,3.537 0 0 0 0.42,1.69 l -0.881,0.881 a 4.787,4.787 0 0 1 -0.746,-2.571 z"
                        ></path>
                    </g>
                </svg>
            </div>
            <div style="z-index: 9;" class="table-menu-option">
                <div id="icon" class="md-icon-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fit=""
                        height="24"
                        width="24"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                        focusable="false"
                    >
                        <g id="format-list-checks">
                            <path
                                d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z"
                            ></path>
                        </g>
                    </svg>
                </div>
                <menu class="menu-content" v-if="showHideColMenu">
                    <menuitem
                        v-for="item in columnDefs"
                        :key="item.name"
                        v-on:click="
                            columnApi.setColumnVisible(item.field, item.hide);
                            item.hide = !item.hide;
                        "
                    >
                        {{ item.headerName }}
                        <div class="md-icon-small" v-if="!item.hide">
                            <svg height="24" width="24">
                                <g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></g>
                            </svg>
                        </div>
                    </menuitem>
                </menu>
            </div>

            <div style="z-index: 10;" class="table-menu-option">
                <div id="icon" class="md-icon-button">
                    <div class="md-icon-small">
                        <svg height="24" width="24">
                            <g id="more_vert">
                                <path
                                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                                />
                            </g>
                        </svg>
                    </div>
                </div>

                <menu class="menu-content" v-if="showOptionsMenu">
                    <menuitem v-on:click="setSize(false)">
                        Split View
                        <div class="md-icon-small" v-if="!fullscreen">
                            <svg height="24" width="24">
                                <g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></g>
                            </svg>
                        </div>
                    </menuitem>
                    <menuitem v-on:click="setSize(true)">
                        Maximize
                        <div class="md-icon-small" v-if="fullscreen">
                            <svg height="24" width="24">
                                <g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></g>
                            </svg>
                        </div>
                    </menuitem>
                    <div class="rv-separator"></div>
                    <menuitem v-on:click="toggleFilterByExtent">
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fit=""
                                height="24"
                                width="24"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24"
                                focusable="false"
                            >
                                <g id="filter">
                                    <path
                                        d="M 3,2L 20.9888,2L 21,2L 21,2.01122L 21,3.99999L 20.9207,3.99999L 14,10.9207L 14,22.909L 9.99999,18.909L 10,10.906L 3.09405,3.99999L 3,3.99999L 3,2 Z "
                                    ></path>
                                </g>
                            </svg>
                            Filter by extent
                        </span>
                        <div class="md-icon-small" v-if="filterByExtent">
                            <svg height="24" width="24">
                                <g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></g>
                            </svg>
                        </div>
                    </menuitem>
                    <menuitem v-on:click="toggleShowFilters">
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fit=""
                                height="24"
                                width="24"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24"
                                focusable="false"
                            >
                                <g id="filter">
                                    <path
                                        d="M 3,2L 20.9888,2L 21,2L 21,2.01122L 21,3.99999L 20.9207,3.99999L 14,10.9207L 14,22.909L 9.99999,18.909L 10,10.906L 3.09405,3.99999L 3,3.99999L 3,2 Z "
                                    ></path>
                                </g>
                            </svg>
                            Show filters
                        </span>
                        <div class="md-icon-small" v-if="showFilters">
                            <svg height="24" width="24">
                                <g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></g>
                            </svg>
                        </div>
                    </menuitem>
                    <div class="rv-separator"></div>
                    <menuitem>
                        <span>
                            <svg height="24" width="24">
                                <g id="insert_drive_file">
                                    <path
                                        d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"
                                    />
                                </g>
                            </svg>
                            Export
                        </span>
                    </menuitem>
                </menu>
            </div>

            <div id="icon" class="md-icon-button" v-on:click="closeTable">
                <svg height="24" width="24">
                    <g id="close">
                        <path
                            d="M 19,6.41L 17.59,5L 12,10.59L 6.41,5L 5,6.41L 10.59,12L 5,17.59L 6.41,19L 12,13.41L 17.59,19L 19,17.59L 13.41,12L 19,6.41 Z "
                        />
                    </g>
                </svg>
            </div>
        </div>
        <ag-grid-vue
            class="ag-grid-test ag-theme-material"
            :style="{ height: gridHeight }"
            :gridOptions="gridOptions"
            :columnDefs="columnDefs"
            :panelStateManager="panelStateManager"
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
import PanelStateManager from './panel-state-manager';
import CustomNumberFilter from './CustomNumberFilter';
import CustomTextFilter from './CustomTextFilter';
import CustomDateFilter from './CustomDateFilter';
import CustomSelectorFilter from './CustomSelectorFilter';
import CustomHeader from './CustomHeader';

export default {
    name: 'GridComponent',
    props: ['element'],
    created() {
        this.gridOptions = {
            enableFilter: true,
            floatingFilter: true,
            suppressRowTransform: true,
            onFilterChanged: this.updateFilterInfo,
            onBodyScroll: this.updateFilterInfo,
            rowBuffer: 0
        };
    },
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
                visibleRows: 0
            },
            filterStatus: '',
            showHideColMenu: false,
            showOptionsMenu: false,
            containerHeight: null,
            filterByExtent: false,
            showFilters: true,
            lazyFilterEnabled: true, // default mode set lazyFilters to true
            panelStateManager: null
        };
    },
    components: {
        AgGridVue
    },
    beforeMount() {
        // imported separate components
        this.frameworkComponents = {
            agColumnHeader: CustomHeader,
            numberFloatingFilter: CustomNumberFilter,
            textFloatingFilter: CustomTextFilter,
            dateFloatingFilter: CustomDateFilter,
            selectorFloatingFilter: CustomSelectorFilter
        };

        // obtain existing panel state manager if it exists
        // if (this.$store.getters.getPanelStateManager) {
        //     this.panelStateManager = this.$store.getters.getPanelStateManager;
        // } else {
        // initialize panel state manager (placeholder acts as replacement for baseLayer)
        const placeholder = {
            table: {
                maximize: this.fullScreen,
                showFilter: this.showFilters,
                filterByExtent: this.filterByExtent,
                lazyFilter: this.lazyFilterEnabled
            }
        };
        this.panelStateManager = new PanelStateManager(placeholder);
        // this.$store.dispatch('setPanelStateManager', this.panelStateManager);
        // }

        // hardcoded grid data
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
                isSelector: true,
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
                width: 380,
                sortable: true,
                lockPosition: true,
                hide: false,
                filter: 'agDateColumnFilter',
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

        this.rowData = [
            {
                OBJECTID: 1,
                COUNTRY: 'Mexico',
                NAME: 'Cornwall Pipeline',
                DATE: '2020-01-02',
                LATITUDE: 129.17,
                LONGITUDE: -115.25
            },
            {
                OBJECTID: 2,
                COUNTRY: 'Canada',
                NAME: 'Mainline',
                DATE: '2019-12-25',
                LATITUDE: 132.38,
                LONGITUDE: -118.72
            },
            {
                OBJECTID: 3,
                COUNTRY: 'United States',
                NAME: 'Southern California Gas Co',
                DATE: '2005-05-02',
                LATITUDE: 31.34,
                LONGITUDE: -110.97
            },
            {
                OBJECTID: 4,
                COUNTRY: 'Canada',
                NAME: 'Cornwall Pipeline',
                DATE: '2020-01-15',
                LATITUDE: 44.99,
                LONGITUDE: -74.72
            },
            {
                OBJECTID: 5,
                COUNTRY: 'United States',
                NAME: 'Bluewater Pipeline Co',
                DATE: '2019-11-29',
                LATITUDE: 0,
                LONGITUDE: 0
            },
            {
                OBJECTID: 6,
                COUNTRY: 'United States',
                NAME: 'San Diego Gas and Electric',
                DATE: '2010-10-01',
                LATITUDE: 32.55,
                LONGITUDE: -116.9
            },
            {
                OBJECTID: 7,
                COUNTRY: 'United States',
                NAME: 'Maritimes & Northeast Pipeline Co',
                DATE: '2012-12-31',
                LATITUDE: 45.2,
                LONGITUDE: -67.45
            },
            {
                OBJECTID: 8,
                COUNTRY: 'United States',
                NAME: 'Great Lakes Transmission',
                DATE: '2015-07-01',
                LATITUDE: 46.45,
                LONGITUDE: -84.44
            },
            {
                OBJECTID: 9,
                COUNTRY: 'United States',
                NAME: 'Viking Gas Tranmssion',
                DATE: '1998-05-14',
                LATITUDE: 48.99,
                LONGITUDE: -97.05
            },
            {
                OBJECTID: 10,
                COUNTRY: 'Canada',
                NAME: 'Carway Line',
                DATE: '2024-06-06',
                LATITUDE: 48.99,
                LONGITUDE: -113.28
            },
            {
                OBJECTID: 11,
                COUNTRY: 'Canada',
                NAME: 'Mainline',
                DATE: '2019-03-15',
                LATITUDE: 45.22,
                LONGITUDE: -67.43
            },
            {
                OBJECTID: 12,
                COUNTRY: 'Canada',
                NAME: 'Vector',
                DATE: '2019-10-31',
                LATITUDE: 42.79,
                LONGITUDE: -82.47
            }
        ];

        // set up column filters
        this.columnDefs.forEach(col => {
            if (col.filter === 'agNumberColumnFilter') {
                this.setUpNumberFilter(col);
            } else if (col.filter === 'agTextColumnFilter') {
                !col.isSelector ? this.setUpTextFilter(col, this.lazyFilterEnabled) : this.setUpSelectorFilter(col);
            } else if (col.filter === 'agDateColumnFilter') {
                this.setUpDateFilter(col);
            }
        });
    },
    methods: {
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
            // should load row data here
            this.getGridHeight();
            // initialize filter info + status
            this.updateFilterInfo();
            this.updateGridProperties();
        },
        openTable() {
            // TODO (maybe in Vuex Table Module)
        },
        closeTable() {
            // TODO (maybe in Vuex Table Module)
        },
        refreshGrid() {
            // TODO
        },
        updateQuickSearch() {
            this.gridApi.setQuickFilter(this.quicksearch);
        },
        setSize(value) {
            this.fullscreen = value;
            this.panelStateManager.maximized = this.fullscreen;
            this.getGridHeight();
        },
        // unused atm since we want to have lazy filters as default filter mode
        toggleLazyFilters() {
            // problem: after applying filters to column on a lazy filters, toggling filters mode does not change the previously filtered column settings
            // changing search filter mode (WILL WORK WITH TABLE REFRESH)
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
        toggleFilterByExtent() {
            this.filterByExtent = !this.filterByExtent;
            this.panelStateManager.filterByExtent = this.filterByExtent;
        },
        toggleShowFilters() {
            this.showFilters = !this.showFilters;
            this.gridOptions.floatingFilter = this.showFilters;
            this.panelStateManager.colFilter = this.showFilters;
            this.gridOptions.api.refreshHeader();
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
            this.filterStatus =
                this.filterInfo.visibleRows !== this.rowData.length
                    ? `${this.filterInfo.firstRow} - ${this.filterInfo.lastRow} of ${this.filterInfo.visibleRows} entries shown (filtered from ${this.rowData.length} records)`
                    : `${this.filterInfo.firstRow} - ${this.filterInfo.lastRow} of ${this.filterInfo.visibleRows} entries shown`;
        },
        updateGridProperties() {
            // update table values with saved values
            if (this.panelStateManager) {
                this.fullscreen !== this.panelStateManager.maximized ? this.setSize(this.panelStateManager.maximized) : 0;
                this.filterByExtent !== this.panelStateManager.filterByExtent ? this.toggleFilterByExtent() : 0;
                this.showFilters !== this.panelStateManager.colFilter ? this.toggleShowFilters() : 0;
                this.lazyFilterEnabled !== this.panelStateManager.lazyFilter ? this.toggleLazyFilters() : 0;
            }
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
        setUpNumberFilter(colDef) {
            colDef.floatingFilterComponent = 'numberFloatingFilter';
            colDef.filterParams.inRangeInclusive = true;
            colDef.floatingFilterComponentParams = {
                suppressFilterButton: true
            };
        },

        setUpTextFilter(colDef, lazyFilterEnabled) {
            colDef.floatingFilterComponent = 'textFloatingFilter';
            colDef.floatingFilterComponentParams = {
                suppressFilterButton: true
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
                suppressFilterButton: true
            };
        },

        setUpSelectorFilter(colDef) {
            colDef.floatingFilterComponent = 'selectorFloatingFilter';
            colDef.floatingFilterComponentParams = {
                suppressFilterButton: true
            };
            colDef.filterParams.textCustomComparator = function(filter, gridValue, filterText) {
                return filterText.includes(gridValue);
            };
        },
        clearColumnFilters() {
            this.gridApi.setQuickFilter(null);
            this.quicksearch = null;

            this.gridOptions.api.setFilterModel({});
            this.gridApi.refreshHeader();
        }
    }
};
</script>

<style>
.grid-container {
    position: absolute;
    margin-left: 375px;
    width: calc(100% - 22vw) !important;
    bottom: 500px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
    top: 0px;
    background: #fff;
}
.rv-header {
    display: flex;
    white-space: nowrap;
    border-bottom: 1px solid #e0e0e0;
    height: auto;
    min-height: 49px;
    align-items: center;
    text-align: left;
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
    margin-right: 20px;
    margin-left: 20px;
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
.ag-cell {
    text-align: left;
}
.flex {
    flex: 1;
}
.md-icon-button {
    margin-left: 10px;
    margin-right: 10px;
}
.md-icon-button:hover {
    background: #eee;
}
/* .md-datepicker-dialog {
    position: relative;
    z-index: 9999 !important;
    background: #fff;
} */
.menu-content {
    background: #fff;
}
.rv-separator {
    background: #ddd;
    height: 1px;
    width: 100%;
    margin: 5px 0px 5px 0px;
}
</style>
