import { GridOptions, GridApi } from 'ag-grid-community';
import { setUpDateFilter, setUpNumberFilter, setUpTextFilter, setUpSelectorFilter } from './custom-floating-filters';
import { CustomHeader } from './custom-header';

const NUMBER_TYPE = 'agNumberColumnFilter';
const DATE_TYPE = 'esriFieldTypeDate';
const TEXT_TYPE = 'agTextColumnFilter';

// ignoring API + config stuff for now

export default class TableBuilder {
	feature = 'table';
	attributeHeaders: any;

	init(baseLayer) {
		this.baseLayer = baseLayer;
	}

	openTable(baseLayer) {
		const attrs = baseLayer.getAttributes();
		this.attributeHeaders = attrs.map(attr => attr.headerName);
		if (attrs.length > 0) {
			this.createTable(attrs, baseLayer);
		}
	}

	createTable(attributes, baseLayer) {
		const columns: Array<any> = [];
		// first set up column header names
		attributes.forEach(attr =>
			columns.push({
				columnInfo: attr,
				columnName: attr.field,
				rowData: [],
			})
        );
        const rowData = baseLayer.getRowData();
		// populate columns with row data
		rowData.forEach(row => {
			for (const attr in row) {
				const matchingCol = columns.find(col => col.columnName === attr);
				matchingCol.rowData.push(row[attr]);
			}
		});
		columns.forEach(column => {
			let colDef: ColumnDefinition = {
				width: 100,
				minWidth: 100,
				maxWidth: 100,
				headerName: column.columnInfo.headerName,
				headerTooltip: column.columnInfo.headerName,
				field: column.columnName,
				filterParams: <FilterParameters>{},
				filter: 'agTextColumnFilter',
				floatingFilterComponentParams: { suppressFilterButton: true },
				floatingFilterComponent: undefined,
				cellRenderer: cell => cell.value,
				suppressSorting: !column.columnInfo.sortable,
				suppressFilter: false,
				sort: '', // TODO
				// hide: column.column !== undefined && column.column.visible !== undefined ? !column.column.visible : false, TODO
			};

			// set up floating filters and column header
			const fieldInfo = column.columnInfo;
			if (fieldInfo) {
                // testing text filters first
				setUpTextFilter(
					colDef,
					false, // lazy filters
					true, // strict match enabled
					column.value
				);
				// floating filters can be of type number, date, text (text can be of type text or selector)
				// if (fieldInfo.filter === NUMBER_TYPE) {
				// 	setUpNumberFilter(colDef, column.value);
				// } else if (fieldInfo.filter === DATE_TYPE) {
				// 	setUpDateFilter(
				// 		colDef,
				// 		column.value, // idk what this is yet
				// 	);
				// } else if (fieldInfo.filter === TEXT_TYPE) {
				// 	if (fieldInfo.isSelector) {
				// 		setUpSelectorFilter(colDef, column.value);
				// 	} else {
				// 		setUpTextFilter(
				// 			colDef,
				// 			false, // lazy filters
				// 			false, // strict match enabled
				// 			column.value
				// 		);
				// 	}
				// }
			}

			setUpHeaderComponent(colDef, this.tableOptions);
		});
		this.tableOptions.floatingFilter = true;
	}

	reloadTable(baseLayer) {
		this.openTable(baseLayer);
	}
}

/*Helper function to set up column headers*/
function setUpHeaderComponent(colDef, tableOptions) {
	colDef.headerComponent = CustomHeader;
	colDef.headerComponentParams = {
		tableOptions,
	};
}

export default interface TableBuilder {
	feature: string;
	id: string;
	_name: string;
	baseLayer: any;
	tableOptions: GridOptions;
	tableApi: GridApi;
	translations: any;
	legendBlock: any;
	loadingTimeout: any;
	layerAdded: any;
}

interface ColumnDefinition {
	headerName: string;
	headerTooltip: string;
	minWidth?: number;
	maxWidth?: number;
	width?: number;
	field: string;
	headerComponent?: { new (): CustomHeader };
	headerComponentParams?: HeaderComponentParams;
	filter: string;
	filterParams?: any;
	floatingFilterComponent?: undefined;
	floatingFilterComponentParams: FloatingFilterComponentParams;
	cellRenderer?: (cellParams: any) => string | Element;
	suppressSorting: boolean;
	suppressFilter: boolean;
	lockPosition?: boolean;
	getQuickFilterText?: (cellParams: any) => string;
	sort?: string;
	// hide?: boolean;
	cellStyle?: any;
}

interface HeaderComponentParams {
	mapApi: any;
	tableOptions: GridOptions;
}

interface FloatingFilterComponentParams {
	suppressFilterButton: boolean;
}

interface FilterParameters {
	inRangeInclusive?: boolean;
	comparator?: Function;
	textCustomComparator?: Function;
	textFormatter?: Function;
}

TableBuilder.prototype.tableOptions = {
	enableSorting: true,
	floatingFilter: true,
	autoSizePadding: 75,
	suppressColumnVirtualisation: true,
	suppressDragLeaveHidesColumns: true,
	ensureDomOrder: true,
	defaultColDef: {
		width: 100,
	},
};

TableBuilder.prototype.id = 'fancyTable';
TableBuilder.prototype._name = 'enhancedTable';

(<any>window).enhancedTable = TableBuilder;
