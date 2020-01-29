import Vue from 'vue';

export default Vue.extend({
    template: `
		<div class="ag-custom-header" style="display: flex; flex: 1; align-items: center;">
			<div style="display: flex; flex: 1; align-items:center;">
				<span @click="onSortRequested('asc', $event)" class="customHeaderLabel">{{params.displayName}}</span>
                <span v-if="params.enableSorting && sort === 1" class="customSortDownLabel">
                    <div class="md-icon-small">
                        <svg height="24" width="24">
                            <g id="arrow_upward"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></g>
                        </svg>
                    </div>
                </span>
                <span v-if="params.enableSorting && sort === 2" class="customSortUpLabel">
                    <div class="md-icon-small">
                        <svg height="24" width="24">
                            <g id="arrow_downward"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></g>
                        </svg>
                    </div>
                </span>
			</div>

			<div>
                <span class="" @click="moveLeft()" :disabled="leftDisabled">
                    <div style="font-size: 14px !important; display: inline-block;">
                        <svg height="24" width="24">
                            <g id="keyboard_arrow_left"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/></g>
                        </svg>
                    </div>
                </span>
                <span class="" @click="moveRight()" :disabled="rightDisabled">
                    <div style="font-size: 14px !important; display: inline-block;">
                        <svg height="24" width="24">
                            <g id="keyboard_arrow_right"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></g>
                        </svg>
                    </div>
                </span>
			</div>
    </div>
  `,
    data: function() {
        return {
            leftDisabled: false,
            rightDisabled: false,
            sort: 0
        };
    },
    mounted() {
        this.gridApi = this.params.api;
        this.columnApi = this.params.columnApi;
    },
    methods: {
        moveLeft() {
            const columns = this.columnApi.getAllDisplayedColumns();
            const allColumns = this.columnApi.getAllGridColumns();

            let columnIdx = columns.findIndex(col => col.colId === this.params.displayName);
            if (columnIdx === 0) return;

            const index = allColumns.indexOf(columns[columnIdx - 1]);
            this.columnApi.moveColumnByIndex(columnIdx, index);
        },
        moveRight() {
            const columns = this.columnApi.getAllDisplayedColumns();
            const allColumns = this.columnApi.getAllGridColumns();

            let columnIdx = columns.findIndex(col => col.colId === this.params.displayName);
            if (columnIdx === columns.length - 1) return;

            const index = allColumns.indexOf(columns[columnIdx + 1]);
            this.columnApi.moveColumnByIndex(columnIdx, index);
        },
        onSortRequested(order, event) {
            this.sort = (this.sort + 1) % 3;
            if (this.sort == 1) {
                this.params.setSort('asc', event.shiftKey);
            } else if (this.sort == 2) {
                this.params.setSort('desc', event.shiftKey);
            } else {
                this.params.setSort('', event.shiftKey);
            }
        }
    }
});
