export class LayerState {
  constructor(name, parent, children, options) {
    this.name = name;
    this.parent = parent;
    this.symbologyStack = null;
    this.tableOpen = false;

    // find and store root
    let curEntry = this;
    while (curEntry.parent) {
      curEntry = curEntry.parent;
    }
    this.root = curEntry;
    this.isRoot = this.parent === null;
    this.userAdded = options && options.userAdded !== undefined ? !!options.userAdded : false;

    this.icon = options && options.icon ? options.icon : undefined;

    // legend state
    this.expandable = options && options.expandable !== undefined ? !!options.expandable : true;
    this.expanded = options && options.expanded !== undefined ? !!options.expanded : true;

    this.toggleable = options && options.toggleable !== undefined ? !!options.toggleable : true;
    this.toggled = options && options.toggled !== undefined ? !!options.toggled : true;
    // toggle off if group parent is initially toggled off
    if (this.parent && !this.parent.toggled && !this.parent.isRoot) {
      this.toggled = false;
    }
    this.wasToggled = false;

    children === undefined || children.length === 0 ? this.children = [] : this.children = children.map(child => new LayerState(child.name, this, [], child.options));

    if (this.isRoot) {
      this.allToggled = false;
      this.allUntoggled = false;
      this.allExpanded = false;
      this.allCollapsed = false;
    }

    // hardcoded table attributes to try to get grid working first
    this.columnDefs = [
			{
				headerName: 'OBJECTID',
				field: 'OBJECTID',
				sortable: true,
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false,
			},
			{
				headerName: 'COUNTRY',
				field: 'COUNTRY',
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agTextColumnFilter',
				isSelector: true,
				filterParams: {},
				width: 300,
			},
			{
				headerName: 'NAME',
				field: 'NAME',
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agTextColumnFilter',
				filterParams: {},
				width: 400,
			},
			{
				headerName: 'DATE',
				field: 'DATE',
				width: 380,
				sortable: true,
				lockPosition: true,
				hide: false,
				filter: 'agDateColumnFilter',
				filterParams: {},
			},
			{
				headerName: 'LATITUDE',
				field: 'LATITUDE',
				sortable: true,
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false,
			},
			{
				headerName: 'LONGITUDE',
				field: 'LONGITUDE',
				sortable: true,
				lockPosition: true,
				filter: 'agNumberColumnFilter',
				filterParams: {},
				hide: false,
			},
		];

    this.rowData = [
      {
        OBJECTID: 1,
        COUNTRY: 'Mexico',
        NAME: 'Cornwall Pipeline',
        DATE: '2020-01-02',
        LATITUDE: 129.17,
        LONGITUDE: -115.25,
      },
      {
        OBJECTID: 2,
        COUNTRY: 'Canada',
        NAME: 'Mainline',
        DATE: '2019-12-25',
        LATITUDE: 132.38,
        LONGITUDE: -118.72,
      },
      {
        OBJECTID: 3,
        COUNTRY: 'United States',
        NAME: 'Southern California Gas Co',
        DATE: '2005-05-02',
        LATITUDE: 31.34,
        LONGITUDE: -110.97,
      },
      {
        OBJECTID: 4,
        COUNTRY: 'Canada',
        NAME: 'Cornwall Pipeline',
        DATE: '2020-01-15',
        LATITUDE: 44.99,
        LONGITUDE: -74.72,
      },
      {
        OBJECTID: 5,
        COUNTRY: 'United States',
        NAME: 'Bluewater Pipeline Co',
        DATE: '2019-11-29',
        LATITUDE: 0,
        LONGITUDE: 0,
      },
      {
        OBJECTID: 6,
        COUNTRY: 'United States',
        NAME: 'San Diego Gas and Electric',
        DATE: '2010-10-01',
        LATITUDE: 32.55,
        LONGITUDE: -116.90,
      },
      {
        OBJECTID: 7,
        COUNTRY: 'United States',
        NAME: 'Maritimes & Northeast Pipeline Co',
        DATE: '2012-12-31',
        LATITUDE: 45.20,
        LONGITUDE: -67.45,
      },
      {
        OBJECTID: 8,
        COUNTRY: 'United States',
        NAME: 'Great Lakes Transmission',
        DATE: '2015-07-01',
        LATITUDE: 46.45,
        LONGITUDE: -84.44,
      },
      {
        OBJECTID: 9,
        COUNTRY: 'United States',
        NAME: 'Viking Gas Tranmssion',
        DATE: '1998-05-14',
        LATITUDE: 48.99,
        LONGITUDE: -97.05,
      },
      {
        OBJECTID: 10,
        COUNTRY: 'Canada',
        NAME: 'Carway Line',
        DATE: '2024-06-06',
        LATITUDE: 48.99,
        LONGITUDE: -113.28,
      },
      {
        OBJECTID: 11,
        COUNTRY: 'Canada',
        NAME: 'Mainline',
        DATE: '2019-03-15',
        LATITUDE: 45.22,
        LONGITUDE: -67.43,
      },
      {
        OBJECTID: 12,
        COUNTRY: 'Canada',
        NAME: 'Vector',
        DATE: '2019-10-31',
        LATITUDE: 42.79,
        LONGITUDE: -82.47,
      },
    ];

    this.panelStateManager = null;
  }

  addChild(node) {
    this.children.push(node);
    node.expandable && node.expanded ? this.root.allCollapsed = false : this.root.allExpanded = false;
    node.toggleable && node.toggled ? this.root.allUntoggled = false : this.root.allToggled = false;
  }

  setPanelStateManager(panelStateManager) {
    this.panelStateManager = panelStateManager;
  }

  updateHeaderOption(option) {
    // DFS tree traversal to check all entries
    let stack = [];
    stack.push(this.root);
    while (stack.length > 0) {
      let legendEntry = stack.pop();

      // 4 options that can be passed in: "expanded", "collapsed", "toggled", "untoggled" (add more here if needed)
      switch (option) {
        case "expanded": {
          // check if current legend entry is NOT expanded
          if (!legendEntry.expanded && legendEntry.expandable) {
            this.root.allExpanded = false;
            return false;
          }
          break;
        } case "collapsed": {
          // check if current legend entry is NOT collapsed
          const leafOrRoot = legendEntry.isRoot || legendEntry.children.length === 0;
          if (legendEntry.expanded && legendEntry.expandable && !leafOrRoot) {
            this.root.allCollapsed = false;
            return false;
          }
          break;
        } case "toggled": {
          // check if current legend entry is NOT toggled
          if (!legendEntry.toggled && legendEntry.toggleable && !legendEntry.isSet) {
            this.root.allToggled = false;
            return false;
          }
          break;
        } case "untoggled": {
          // check if current legend entry is NOT untoggled
          if (legendEntry.toggled && legendEntry.toggleable) {
            this.root.allUntoggled = false;
            return false;
          }
          break;
        }
      }

      // add all child components to stack to be traversed next, if they exist
      if (legendEntry.children) {
        if (legendEntry.children.length > 0) {
          legendEntry.children.forEach(child => {
            stack.push(child);
          });
        }
      }
    }

    // if we reach here then all legend entries do share the same property value
    switch (option) {
      case "expanded":
        this.root.allExpanded = true;
        break;
      case "collapsed":
        this.root.allCollapsed = true;
        break;
      case "toggled":
        this.root.allToggled = true;
        break;
      case "untoggled":
        this.root.allUntoggled = true;
        break;
    }
    return true;
  }

  toggle(val, propagate = true) {
    this.toggled = val != undefined ? val : !this.toggled;

    if (val == undefined) {
      this.wasToggled = false;
    }

    // determines whether any children were toggled on prior to this element being toggled off
    const toggledChildren = this.children ? this.children.some(child => child.toggleable && child.wasToggled) : false;
    if (this.toggled) {
      if (this.parent && !this.parent.toggled) {
        this.parent.toggle(true, false);

        this.parent.children.forEach(child => {
          if (this !== child) {
            child.wasToggled = false;
          }
        })
      }

      // toggle applies differently for entries part of visibility set
      if (this.isSet) {
        // toggle off visibility for all siblings in set as only one can be visible at all times
        this.parent.children.forEach(sibling => {
          if (sibling !== this) {
            sibling.toggle(false, false);
            sibling.wasToggled = false;
            sibling.lastToggled = false;
          }
        });
        this.lastToggled = true;
      }

      // handles cases where the layer is toggled ON
      if (!propagate) return;
      this.children.forEach(child => {
        if (!toggledChildren) {
          child.toggle(true);
        } else if (child.wasToggled) {
          child.toggle(this.toggled);
        } else {
          child.wasToggled = false;
        }
      });
    } else {
      // handles cases where the layer is toggled OFF
      // determines whether any siblings are toggled on
      const toggledSiblings = this.parent && this.parent.children.some(child => child.toggleable && child.toggled);

      if (this.parent && !toggledSiblings) {
        this.parent.toggle(false, false);
      }

      if (!propagate) return;
      this.children.forEach(child => {
        if (child.toggled) {
          child.wasToggled = true;
        }
        child.toggle(false);
      });
    }
  }

  toggleOffOption(option) {
    switch (option) {
      case "allExpanded":
        this.root.allExpanded = false;
        break;
      case "allCollapsed":
        this.root.allCollapsed = false;
        break;
      case "allToggled":
        this.root.allToggled = false;
        break;
      case "allUntoggled":
        this.root.allUntoggled = false;
        break;
    }
  }

  toggleAllOptions(option) {
    // DFS tree traversal to expand/toggle all entries
    let stack = [];
    // assuming we are starting from root (calling this method on root, if not we need to find and push root first)
    stack.push(this.root);
    while (stack.length > 0) {
      let legendEntry = stack.pop();

      // 4 options that can be passed in: "expand", "collapse", "visibilityOn", "visibilityOff" (can probably add more here if needed)
      switch (option) {
        case "expand":
          // expand current legend entry
          legendEntry.expanded = legendEntry.expandable;
          break;
        case "collapse":
          // collapse current legend entry
          legendEntry.expanded = false;
          break;
        case "visibilityOn":
          // turn visibility on for current entry
          legendEntry.isSet && legendEntry.lastToggled ? legendEntry.toggled = true : !legendEntry.isSet ? legendEntry.toggled = legendEntry.toggleable : legendEntry.toggled = false;
          break;
        case "visibilityOff":
          legendEntry.toggled = false;
          break;
      }

      // add all child components to stack to be traversed next, if they exist
      if (legendEntry.children) {
        if (legendEntry.children.length > 0) {
          // may need to add a set of check conditions here depending on what entries we want to traverse (e.g. is expandable or is toggleable)
          legendEntry.children.forEach(child => {
            stack.push(child);
          });
        }
      }
    }
    switch (option) {
      case "expand":
        this.root.allCollapsed = false;
        this.root.allExpanded = true;
        break;
      case "collapse":
        this.root.allExpanded = false;
        this.root.allCollapsed = true;
        break;
      case "visibilityOn":
        this.root.allUntoggled = false;
        this.root.allToggled = true;
        break;
      case "visibilityOff":
        this.root.allToggled = false;
        this.root.allUntoggled = true;
        break;
    }
  }
}


export class VisibilitySet extends LayerState {
  constructor(name, parent, children, options) {
    super(name, parent, children, options);
    // for visibility sets ensure only one child can be toggled initially
    if (children && children.length) {
      let childrenToggled = 0;
      this.children.forEach(child => {
        if (child.toggled) childrenToggled++;
        child.isSet = true
      });

      // if rules are broken default to toggling visibility on for first child only
      if (childrenToggled > 1) {
        this.children.forEach(child => child.toggled = false);
        this.children[0].toggled = true;
      }
    }

  }

  addChild(node) {
    // mark children of visibility group set as part of set
    node.isSet = true;
    // choose to turn visibility on for the first possible child initially
    const toggledChild = this.children.some(child => child.toggled);
    if (!node.parent.toggled || toggledChild) {
      node.toggled = false;
      node.lastToggled = false;
      node.wasToggled = false;
    } else {
      node.toggled = true;
      node.lastToggled = true;
      node.wasToggled = true;
    }
    this.children.push(node);
    node.toggled || toggledChild ? this.root.allUntoggled = false : this.root.allToggled = false;
    node.expandable && node.expanded ? this.root.allCollapsed = false : this.root.allExpanded = false;
  }

  toggle(val, propagate = true) {
    // ensure there is only one child element can be toggled on in the set
    this.toggled = val != undefined ? val : !this.toggled;
    if (val === undefined) {
      this.wasToggled = false;
    }
    if (this.toggled) {
      if (this.parent && !this.parent.toggled) {
        this.parent.toggle(true, false);
        this.parent.children.forEach(child => {
          if (this !== child) {
            child.wasToggled = false;
          }
        })
      }
      // handles cases where the layer is toggled ON
      if (!propagate) return;
      if (this.children && this.children.length) {
        const lastVisible = this.children.find(child => child.lastToggled);
        if (lastVisible) lastVisible.toggle(true, false);
      }
    } else {
      // handles cases where the layer is toggled OFF
      // determines whether any siblings are toggled on
      const toggledSiblings = this.parent && this.parent.children.some(child => child.toggleable && child.toggled);
      if (this.parent && !toggledSiblings) {
        this.parent.toggle(false, false);
      }
      if (!propagate) return;
      this.children.forEach(child => {
        if (child.toggled) {
          child.wasToggled = true;
        }
        child.toggle(false);
      });
    }
  }
}