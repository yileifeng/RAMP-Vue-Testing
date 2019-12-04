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
			minVal: '',
			maxVal: '',
		};
	},
	beforeMount() {
		this.minVal = '';
		this.maxVal = '';
	},
	methods: {
		minValChanged(event) {
			this.minVal = Number(event.target.value);
			let that = this;
			if (this.minVal !== '' || this.maxVal !== '') {
				this.params.parentFilterInstance(function(instance) {
					if (that.minVal === '') {
						instance.setModel({
							filterType: 'number',
							type: 'lessThanOrEqual',
							filter: null,
							filterTo: that.maxVal,
						});
					} else if (that.maxVal === '') {
						instance.setModel({
							filterType: 'number',
							type: 'greaterThanOrEqual',
							filter: that.minVal,
							filterTo: null,
						});
					} else {
						instance.setModel({
							filterType: 'number',
							type: 'inRange',
							filter: that.minVal,
							filterTo: that.maxVal,
						});
					}
					instance.onFilterChanged();
				});
			}
			if (this.minVal === '' && this.maxVal === '') {
				this.params.parentFilterInstance(function(instance) {
					instance.setModel(null);
				});
			}
		},
		maxValChanged(event) {
			this.maxVal = Number(event.target.value);
			let that = this;
			if (this.minVal !== '' || this.maxVal !== '') {
				this.params.parentFilterInstance(function(instance) {
					if (that.minVal === '') {
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
					} else {
						instance.setModel({
							filterType: 'number',
							type: 'inRange',
							filter: that.minVal,
							filterTo: that.maxVal,
						});
					}
					instance.onFilterChanged();
				});
			}
			if (this.minVal === '' && this.maxVal === '') {
				this.params.parentFilterInstance(function(instance) {
					instance.setModel(null);
				});
			}
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
			filterTo: this.maxVal,
		};
	},
});
