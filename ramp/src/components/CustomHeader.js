import Vue from 'vue';

export default Vue.extend({
	template: `
		<div style="display: flex; flex: 1; align-items: center;">
			<div @click="onSortRequested('asc', $event)" style="display: flex; flex: 1; align-items:center;">
				<span class="customHeaderLabel">{{params.displayName}}</span>
				<span v-if="params.enableSorting && sort === 1"  class="customSortDownLabel"><md-icon class="md-icon-small">arrow_upward</md-icon></span>
				<span v-if="params.enableSorting && sort === 2" class="customSortUpLabel"><md-icon class="md-icon-small">arrow_downward</md-icon></span>
			</div>

			<div>
				<button class="" @click="moveLeft()" :disabled="leftDisabled">&lt;</button>
				<button class="" @click="moveRight()" :disabled="rightDisabled">&gt;</button>
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
	beforeMount() {},
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
