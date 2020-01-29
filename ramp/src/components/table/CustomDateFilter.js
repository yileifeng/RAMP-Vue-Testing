import Vue from 'vue';

export default Vue.extend({
    template: `
		<div>
			<div style="float: left; display: inline; width: 49%; z-index: 10;">
				<input
					class="rv-date-input"
					style="width: 50%; line-height: 28px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; vertical-algin: middle;"
					type="text"
					placeholder="date min"
					v-model="minDateVal"
					disabled/>
			</div>
			<div style="float: left; display: inline; width: 49%;">
				<input
					class="rv-date-input"
					style="width: 50%; line-height: 28px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; vertical-align: middle;"
					type="text"
					placeholder="date max"
					v-model="maxDateVal"
					disabled/>
			</div>
		</div>
	`,
    data: function() {
        // <md-datepicker
		// 	style="width: 35%; float: left; margin-left: 12px; white-space: nowrap; overflow: hidden; vertical-align: middle;"
		// 	type="date"
		// 	v-model="minDate">
        // </md-datepicker>
        // <md-datepicker
		// 	style="width: 35%; float: left; margin-left: 12px; margin-right: 12px; white-space: nowrap; overflow: hidden; vertical-align: middle;"
		// 	type="date"
		// 	v-model="maxDate">
		// </md-datepicker>
        return {
            minDate: null,
            maxDate: null,
            minDateVal: '',
            maxDateVal: '',
            colDef: {},
            panelStateManager: null
        };
    },
    beforeMount() {
        // would like better way to access panel state manager, pass it down as a prop? (didn't know how to do this)
        this.panelStateManager = this.$parent.$attrs.panelStateManager;
        this.colDef = this.params.column.colDef;
        this.minDateVal =
            this.panelStateManager.getColumnFilter(this.colDef.field + ' min') !== undefined
                ? this.panelStateManager.getColumnFilter(this.colDef.field + ' min')
                : '';
        this.maxDateVal =
            this.panelStateManager.getColumnFilter(this.colDef.field + ' max') !== undefined
                ? this.panelStateManager.getColumnFilter(this.colDef.field + ' max')
                : '';
        this.minDate = this.minDateVal !== '' ? new Date(this.minDateVal) : null;
        this.maxDate = this.maxDateVal !== '' ? new Date(this.maxDateVal) : null;
    },
    watch: {
        minDate: function(newDate, oldDate) {
            if (newDate !== oldDate) {
                this.minDateVal = this.minDate ? new Date(this.minDate) : '';
                this.minDateVal =
                    this.minDateVal !== ''
                        ? `${this.minDateVal.getFullYear()}-${this.minDateVal.getMonth() + 1}-${this.minDateVal.getDate()}`
                        : '';
            }
        },
        minDateVal: function(newDateVal, oldDateVal) {
            if (newDateVal !== oldDateVal) {
                this.minDateChanged();
            }
        },
        maxDate: function(newDate, oldDate) {
            if (newDate !== oldDate) {
                this.maxDateVal = this.maxDate ? new Date(this.maxDate) : '';
                this.maxDateVal =
                    this.maxDateVal !== ''
                        ? `${this.maxDateVal.getFullYear()}-${this.maxDateVal.getMonth() + 1}-${this.maxDateVal.getDate()}`
                        : '';
            }
        },
        maxDateVal: function(newDateVal, oldDateVal) {
            if (newDateVal !== oldDateVal) {
                this.maxDateChanged();
            }
        }
    },
    methods: {
        minDateChanged() {
            let that = this;
            this.params.parentFilterInstance(function(instance) {
                that.setFilterModel(instance);
                const minKey = that.colDef.field + ' min';
                that.panelStateManager.setColumnFilter(minKey, that.minDateVal);
            });
        },
        maxDateChanged() {
            let that = this;
            this.params.parentFilterInstance(function(instance) {
                that.setFilterModel(instance);
                const maxKey = that.colDef.field + ' max';
                that.panelStateManager.setColumnFilter(maxKey, that.maxDateVal);
            });
        },
        setFilterModel(instance) {
            let that = this;
            // this is a temp patch solution to get date filters working, ideally like to use 'lessThanEqualsTo', 'greaterThanEqualsTo' as model type (but I ran into filter type errors)
            let maxPossibleDate = new Date(8640000000000000);
            maxPossibleDate = `${maxPossibleDate.getFullYear()}-${maxPossibleDate.getMonth() + 1}-${maxPossibleDate.getDate()}`;
            let minPossibleDate = new Date(0);
            minPossibleDate = `${minPossibleDate.getFullYear()}-${minPossibleDate.getMonth() + 1}-${minPossibleDate.getDate()}`;
            if (that.maxDateVal !== '' && that.minDateVal !== '') {
                instance.setModel({
                    filterType: 'date',
                    type: 'inRange',
                    dateFrom: that.minDateVal,
                    dateTo: that.maxDateVal
                });
            } else if (that.minDateVal === '') {
                instance.setModel({
                    filterType: 'date',
                    type: 'inRange',
                    dateFrom: minPossibleDate,
                    dateTo: that.maxDateVal
                });
            } else if (that.maxDateVal === '') {
                instance.setModel({
                    filterType: 'date',
                    type: 'inRange',
                    dateFrom: that.minDateVal,
                    dateTo: maxPossibleDate
                });
            } else {
                instance.setModel(null);
            }
            instance.onFilterChanged();
        }
    },
    onParentModelChanged(parentModel) {
        this.minDate = !parentModel ? null : parentModel.dateFrom;
        this.maxDate = !parentModel ? null : parentModel.dateTo;
    },
    setModel() {
        return {
            filterType: 'date',
            type: 'inRange',
            dateFrom: this.minDate,
            dateTo: this.maxDate
        };
    }
});
