import Vue from 'vue';

export default Vue.extend({
	template: `
		<div>
			<input class='rv-input'
				style="width: 90%; line-height: 56px; padding-left: 12px; padding-right: 12px; background-color: #fafafa; border: 1px solid #607d8b; outline: initial"
				@change="valueChanged()"
				type="text"
				placeholder="text"
				v-model="filterValue"/>
		</div>
	`,
	data: function() {
		return {
			filterValue: ''
		};
	},
	beforeMount() {
		this.filterValue = '';
	},
	methods: {
		valueChanged(event) {
			let that = this;
			this.params.parentFilterInstance(function(instance) {
				instance.setModel({
					filterType: 'text',
					type: 'contains',
					filter: that.filterValue
				});
				instance.onFilterChanged();
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
	},
});
