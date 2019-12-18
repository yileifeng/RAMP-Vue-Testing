import Vue from 'vue';

export default Vue.extend({
	template: `
		<div>
			<input class="rv-min"
				style="width: 45%; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; line-height: 28px; padding-left: 12px; padding-right: 12px;"
				type="text"
				v-model="minVal"
				placeholder="min"
				@change="minValChanged($event)"/>
			<input class="rv-max"
				style="width: 45%; background-color: #fafafa; border: 1px solid #607d8b; outline: initial; line-height: 28px; padding-left: 12px; padding-right: 12px;"
				type="text"
				v-model="maxVal"
				placeholder="max"
				@change="maxValChanged($event)"/>
		</div>
	`,
	data: function() {
		return {
			minVal: 0,
			maxVal: 0,
		};
	},
	beforeMount() {
		this.minVal = '';
		this.maxVal = '';
	},
	methods: {
		minValChanged(event) {
			const newMinValue = event.target.value !== '' ? Number(event.target.value) : event.target.value;
			this.minVal = newMinValue !== '' && !isNaN(newMinValue) ? newMinValue : '';
			let that = this;
			this.params.parentFilterInstance(function(instance) {
				that.setFilterModel(instance);
			});
		},
		maxValChanged(event) {
			const newMaxValue = event.target.value !== '' ? Number(event.target.value) : event.target.value;
			this.maxVal = newMaxValue !== '' && !isNaN(newMaxValue) ? newMaxValue : '';
			let that = this;
			this.params.parentFilterInstance(function(instance) {
				that.setFilterModel(instance);
			});
		},
		setFilterModel(instance) {
			let that = this;
			if (that.maxVal !== '' && that.minVal !== '') {
				instance.setModel({
					filterType: 'number',
					type: 'inRange',
					filter: that.minVal,
					filterTo: that.maxVal,
				});
			} else if (that.minVal === '') {
				instance.setModel({
					filterType: 'number',
					type: 'lessThanOrEqual',
					filter: that.maxVal,
					filterTo: null,
				});
			} else if (that.maxVal === '') {
				instance.setModel({
					filterType: 'number',
					type: 'greaterThanOrEqual',
					filter: that.minVal,
					filterTo: null,
				});
			// temp solution to act as clear filters
			} else {
				instance.setModel(null);
			}
			instance.onFilterChanged();
		},
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
			filterTo: this.maxVal,
		};
	},
});
