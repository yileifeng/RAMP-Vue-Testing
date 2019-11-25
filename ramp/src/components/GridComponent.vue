<template>
    <ag-grid-vue style="width: 500px; height: 300px;"
        class="ag-grid-test ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :modules="modules"
        :suppressDragLeaveHidesColumns="true">
    </ag-grid-vue>
</template>

<script>
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";
import { AgGridVue } from '@ag-grid-community/vue';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { bus } from '../main.js'

export default {
  name: "GridComponent",
  data() {
    return {
      columnDefs: null,
      rowData: null,
      modules: AllCommunityModules
    }
  },
  components: {
    AgGridVue
  },
  beforeMount() {
        this.columnDefs = [
            {headerName: 'OBJECTID', field: 'OBJECTID'},
            {headerName: 'COUNTRY', field: 'COUNTRY'},
            {headerName: 'NAME', field: 'NAME'}
        ];

        this.rowData = [
            {OBJECTID: 1, COUNTRY: 'Mexico', NAME: 'Cornwall Pipeline'},
            {OBJECTID: 2, COUNTRY: 'Canada', NAME: 'Mainline'},
            {OBJECTID: 3, COUNTRY: 'United States', NAME: 'Bluewater Pipeline Co'}
        ];
    }
};
</script>

<style>
.ag-grid-test {
    position: absolute;
    margin-left: 500px;
    width: 602px !important;
    bottom: 500px
}
</style>
