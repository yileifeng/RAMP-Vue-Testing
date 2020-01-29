import Vue from 'vue';

export default Vue.extend({
    template: `
		<div>
			<select style="height: 30px; width: 90%; margin-top: 5px; padding-left: 12px; padding-right: 12px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial;"
				v-model="selectedOption">
				<option
					v-for="option in options"
					:value="option">
					{{ option }}
				</option>
			</select>
		</div>
	`,
    data: function() {
        return {
            selectedOption: '',
            colDef: {},
            panelStateManager: null
        };
    },
    beforeMount() {
        // would like better way to access panel state manager, pass it down as a prop?
        this.panelStateManager = this.$parent.$attrs.panelStateManager;
        this.colDef = this.params.column.colDef;
        let rowData = this.$parent.rowData;
        const colName = this.params.column.colId;

        // obtain row data and filter out duplicates for selector list
        rowData = rowData.map(row => row[colName]);
        this.options = rowData.filter((item, idx) => rowData.indexOf(item) === idx);
        // add '...' as option to clear selector
        this.options.unshift('...');
        this.selectedOption = this.panelStateManager.getColumnFilter(this.colDef.field);
        this.selectedOption = this.selectedOption !== undefined ? this.selectedOption : '';
    },
    watch: {
        selectedOption: function(newOption, oldOption) {
            if (newOption !== oldOption) {
                this.selectionChanged();
            }
        }
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
                        filter: that.selectedOption
                    });
                }
                instance.onFilterChanged();
                that.panelStateManager.setColumnFilter(that.colDef.field, that.selectedOption);
            });
        }
    },
    onParentModelChanged(parentModel) {
        this.selectedOption = !parentModel ? '' : parentModel.filter;
    },
    setModel() {
        return {
            filterType: 'text',
            type: 'contains',
            filter: this.selectedOption
        };
    }
});
