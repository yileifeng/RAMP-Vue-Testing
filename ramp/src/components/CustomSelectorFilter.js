import Vue from 'vue';

export default Vue.extend({
	template: `
		<div>
			<md-field>
				<md-select style="height: 30px; margin-top: 5px; padding-left: 12px; padding-right: 12px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial;"
					v-model="selectedOption">
					<md-option
						v-for="option in options"
						:value="option">
						{{ option }}
					</md-option>
				</md-select>
			</md-field>
		</div>
	`,
	data: function() {
		return {
			selectedOption: '',
		};
	},
	beforeMount() {
		let rowData = this.$parent.rowData;
		const colName = this.params.column.colId;
		// obtain row data and filter out duplicates for selector list
		rowData = rowData.map(row => row[colName]);
		this.options = rowData.filter((item, idx) => rowData.indexOf(item) === idx);
		// add '...' as option to clear selector
		this.options.unshift('...');
		this.selectedOption = '';
	},
	watch: {
		selectedOption: function (newOption, oldOption) {
			if (newOption !== oldOption) {
				this.selectionChanged();
			}
		},
	},
	methods: {
		selectionChanged() {
			let that = this;
			this.params.parentFilterInstance(function(instance) {
				// clear selector filters
				if (that.selectedOption === '...') {
					instance.setModel(null);
					instance.onFilterChanged();
					that.selectedOption = '';
				} else {
					// otherwise filter by the selected option
					instance.setModel({
						filterType: 'text',
						type: 'contains',
						filter: that.selectedOption,
					});
				}
				instance.onFilterChanged();
			});
		},
	},
	onParentModelChanged(parentModel) {
		this.selectedOption = !parentModel ? '' : parentModel.filter;
	},
	setModel() {
		return {
			filterType: 'text',
			type: 'contains',
			filter: this.selectedOption,
		};
	}
});
