import Vue from 'vue';

export default Vue.extend({
    template: `
		<div>
			<input class="rv-min"
				style="width: 45%; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; line-height: 28px; padding-left: 12px; padding-right: 12px;"
				type="text"
				v-model="minVal"
				placeholder="min"/>
			<input class="rv-max"
				style="width: 45%; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; line-height: 28px; padding-left: 12px; padding-right: 12px;"
				type="text"
				v-model="maxVal"
				placeholder="max"/>
		</div>
	`,
    data: function() {
        return {
            minVal: 0,
            maxVal: 0,
            colDef: {},
            panelStateManager: null
        };
    },
    beforeMount() {
        // would like better way to access panel state manager, pass it down as a prop? (didn't know how to do this)
        this.panelStateManager = this.$parent.$attrs.panelStateManager;
        this.colDef = this.params.column.colDef;
        // get preloaded values if they exist
        this.minVal =
            this.panelStateManager.getColumnFilter(this.colDef.field + ' min') !== undefined
                ? this.panelStateManager.getColumnFilter(this.colDef.field + ' min')
                : '';
        this.maxVal =
            this.panelStateManager.getColumnFilter(this.colDef.field + ' max') !== undefined
                ? this.panelStateManager.getColumnFilter(this.colDef.field + ' max')
                : '';
    },
    watch: {
        minVal: function(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.minValChanged();
            }
        },
        maxVal: function(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.maxValChanged();
            }
        }
    },
    methods: {
        minValChanged() {
            this.minVal = this.minVal !== '' && !isNaN(this.minVal) ? this.minVal : '';
            let that = this;
            this.params.parentFilterInstance(function(instance) {
                that.setFilterModel(instance);
                const minKey = that.colDef.field + ' min';
                that.panelStateManager.setColumnFilter(minKey, that.minVal);
            });
        },
        maxValChanged() {
            this.maxVal = this.maxVal !== '' && !isNaN(this.maxVal) ? this.maxVal : '';
            let that = this;
            this.params.parentFilterInstance(function(instance) {
                that.setFilterModel(instance);
                const maxKey = that.colDef.field + ' max';
                that.panelStateManager.setColumnFilter(maxKey, that.maxVal);
            });
        },
        setFilterModel(instance) {
            let that = this;
            if (that.maxVal !== '' && that.minVal !== '') {
                instance.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: that.minVal,
                    filterTo: that.maxVal
                });
            } else if (that.minVal === '') {
                instance.setModel({
                    filterType: 'number',
                    type: 'lessThanOrEqual',
                    filter: that.maxVal,
                    filterTo: null
                });
            } else if (that.maxVal === '') {
                instance.setModel({
                    filterType: 'number',
                    type: 'greaterThanOrEqual',
                    filter: that.minVal,
                    filterTo: null
                });
                // otherwise clear filters
            } else {
                instance.setModel(null);
            }
            instance.onFilterChanged();
        }
    },
    onParentModelChanged(parentModel) {
        this.minVal = !parentModel ? -Infinity : parentModel.filter;
        this.maxVal = !parentModel ? Infinity : parentModel.filterTo;
    },
    setModel() {
        return {
            filterType: 'number',
            type: 'inRange',
            filter: this.minVal,
            filterTo: this.maxVal
        };
    }
});
