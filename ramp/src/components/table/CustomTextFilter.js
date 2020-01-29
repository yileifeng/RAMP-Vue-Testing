import Vue from 'vue';

export default Vue.extend({
    template: `
		<div>
			<input class='rv-input'
				style="width: 90%; line-height: 56px; padding-left: 12px; padding-right: 12px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial"
				type="text"
				placeholder="text"
				v-model="filterValue"/>
		</div>
	`,
    data: function() {
        return {
            filterValue: '',
            colDef: {},
            panelStateManager: null
        };
    },
    beforeMount() {
        // would like better way to access panel state manager, pass it down as a prop? (didn't know how to do this)
        this.panelStateManager = this.$parent.$attrs.panelStateManager;
        this.colDef = this.params.column.colDef;
        // get preloaded value if it exists
        this.filterValue =
            this.panelStateManager.getColumnFilter(this.colDef.field) !== undefined
                ? this.panelStateManager.getColumnFilter(this.colDef.field)
                : this.filterValue;
    },
    watch: {
        filterValue: function(newOption, oldOption) {
            if (newOption !== oldOption) {
                this.valueChanged();
            }
        }
    },
    methods: {
        valueChanged() {
            let that = this;
            this.params.parentFilterInstance(function(instance) {
                instance.setModel({
                    filterType: 'text',
                    type: 'contains',
                    filter: that.filterValue
                });
                instance.onFilterChanged();
                that.panelStateManager.setColumnFilter(that.colDef.field, that.filterValue);
            });
        }
    },
    onParentModelChanged(parentModel) {
        this.filterValue = !parentModel ? '' : parentModel.filter;
    },
    setModel() {
        return {
            filterType: 'text',
            type: 'contains',
            filter: this.filterValue
        };
    }
});
