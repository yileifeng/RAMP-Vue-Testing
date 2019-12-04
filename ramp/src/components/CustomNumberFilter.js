import Vue from 'vue';

export default Vue.extend({
	template: `
		<div>
			<input class="rv-min"
				style="width:45%; opacity: 0.4"
				type="text"
				:value="minVal"
				@change="minValChanged($event)"/>
			<input class="rv-max"
				style="width:45%; opacity: 0.4"
				type="text"
				:value="maxVal"
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
			const newMinValue = event.target.value;
			this.minVal = newMinValue !== '' ? Number(event.target.value) : '';
			let that = this;
			this.params.parentFilterInstance(function(instance) {
				that.setFilterModel(instance);
			});
		},
		maxValChanged(event) {
			const newMaxValue = event.target.value;
			this.maxVal = newMaxValue !== '' ? Number(event.target.value) : '';
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
				instance.setModel({
					filterType: 'number',
					type: 'inRange',
					filter: -Number.MAX_SAFE_INTEGER,
					filterTo: Number.MAX_SAFE_INTEGER,
				});
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
