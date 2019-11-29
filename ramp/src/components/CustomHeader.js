import Vue from 'vue';

export default Vue.extend({
	template: `
    <div>
      <span class="customHeaderLabel">{{params.displayName}}</span>

      <button class="" @click="moveLeft()" :disabled="leftDisabled">&lt;</button>
      <button class="" @click="moveRight()" :disabled="rightDisabled">&gt;</button>
    </div>
  `,
	data: function() {
		return {
			leftDisabled: false,
			rightDisabled: false
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
		}
	}
});
