import Vue from 'vue';

export default Vue.extend({
	template: `
		<div>
			<div style="float: left; display: inline; width: 49%; z-index: 10;">
				<input
					class="rv-date-input"
					style="width: 50%; float: left; line-height: 28px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; margin-top: 22px"
					type="text"
					placeholder="date min"
					v-model="minDateVal"
					disabled/>
				<md-datepicker
					style="width: 35%; float: left; margin-left: 12px; white-space: nowrap; overflow: hidden; vertical-align: middle;"
					type="date"
					v-model="minDate">
				</md-datepicker>
			</div>
			<div style="float: left; display: inline; width: 49%;">
				<input
					class="rv-date-input"
					style="width: 50%; float: left; line-height: 28px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; margin-top: 22px"
					type="text"
					placeholder="date max"
					v-model="maxDateVal"
					disabled/>
				<md-datepicker
					style="width: 35%; float: left; margin-left: 12px; margin-right: 12px; white-space: nowrap; overflow: hidden; vertical-align: middle;"
					type="date"
					v-model="maxDate">
				</md-datepicker>
			</div>
		</div>
	`,
	data: function() {
		return {
			minDate: null,
			maxDate: null,
			minDateVal: '',
			maxDateVal: '',
		};
	},
	beforeMount() {
		this.minDate = null;
		this.maxDate = null;
		this.minDateVal = '';
		this.maxDateVal = '';
	},
	watch: {
		minDate: function (newDate, oldDate) {
			if (newDate !== oldDate) {
				this.minDateChanged(newDate);
			}
		},
		maxDate: function (newDate, oldDate) {
			if (newDate !== oldDate) {
				this.maxDateChanged(newDate);
			}
		},
	},
	methods: {
		minDateChanged(newDate) {
			const newMinDate = newDate !== null ? newDate : null;
			this.minDate = newMinDate ? newMinDate : null;
			this.minDateVal = this.minDate ? new Date(this.minDate) : '';
			this.minDateVal = this.minDateVal !== '' ? `${this.minDateVal.getFullYear()}-${this.minDateVal.getMonth() + 1}-${this.minDateVal.getDate()}` : '';
			let that = this;
			this.params.parentFilterInstance(function(instance) {
				that.setFilterModel(instance);
			});
		},
		maxDateChanged(newDate) {
			const newMaxDate = newDate !== null ? newDate : null;
			this.maxDate = newMaxDate ? newMaxDate : null;
			this.maxDateVal = this.maxDate ? new Date(this.maxDate) : '';
			this.maxDateVal = this.maxDateVal !== '' ? `${this.maxDateVal.getFullYear()}-${this.maxDateVal.getMonth() + 1}-${this.maxDateVal.getDate()}` : '';
			let that = this;
			this.params.parentFilterInstance(function(instance) {
				that.setFilterModel(instance);
			});
		},
		setFilterModel(instance) {
			let that = this;
			// this is a temp patch solution to get date filters working, ideally like to use 'lessThanEqualsTo', 'greaterThanEqualsTo' as model type (but I ran into filter type errors)
			let maxPossibleDate = new Date(8640000000000000);
			maxPossibleDate = `${maxPossibleDate.getFullYear()}-${maxPossibleDate.getMonth() + 1}-${maxPossibleDate.getDate()}`
			let minPossibleDate = new Date(0);
			minPossibleDate = `${minPossibleDate.getFullYear()}-${minPossibleDate.getMonth() + 1}-${minPossibleDate.getDate()}`
			if (that.maxDateVal !== '' && that.minDateVal !== '') {
				instance.setModel({
					filterType: 'date',
					type: 'inRange',
					dateFrom: that.minDateVal,
					dateTo: that.maxDateVal,
				});
			} else if (that.minDateVal === '') {
				instance.setModel({
					filterType: 'date',
					type: 'inRange',
					dateFrom: minPossibleDate,
					dateTo: that.maxDateVal,
				});
			} else if (that.maxDateVal === '') {
				instance.setModel({
					filterType: 'date',
					type: 'inRange',
					dateFrom: that.minDateVal,
					dateTo: maxPossibleDate,
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
			dateTo: this.maxDate,
		};
	},
});
