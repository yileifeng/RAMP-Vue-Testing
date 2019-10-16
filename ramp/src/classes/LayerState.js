export class LayerState {
  constructor(name, parent, options) {
    this.name = name;
    this.parent = parent;
    this.children = [];

    // legend state
    this.expandable = options && options.expandable !== undefined ? !!options.expandable : true;
    this.expanded = options && options.expanded !== undefined ? !!options.expanded : true;

    this.toggleable = options && options.toggleable !== undefined ? !!options.toggleable : true;
    this.toggled = true;
    this.wasToggled = false;

    this.allToggled = this.checkAll('toggled');
    this.allExpanded = this.checkAll('expanded');
  }

  addChild(node) {
    this.children.push(node);
  }

  checkAll(option) {
    // TO IMPLEMENT:
    return false;
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
      }

      // handles cases where the parent is toggled ON
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
      // handles cases where the parent is toggled OFF
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

  toggleAllOptions (option) {
    // DFS tree traversal to expand all groups (currently every entry is a group and is expandable)
    let stack = [];
    stack.push(this);
    while (stack.length > 0) {
      let legendEntry = stack.pop();

      // 4 options that can be passed in: "expand", "collapse", "visibilityOn", "visibilityOff" (can probably add more here if needed)
      switch (option) {
        case "expand":
          // expand current legend entry
          legendEntry.expandable ? legendEntry.expanded = true : legendEntry.expanded = false;
          break;
        case "collapse":
          // collapse current legend entry
          legendEntry.expanded = false;
          break;
        case "visibilityOn":
          // turn visibility on for current entry
          legendEntry.toggleable ? legendEntry.toggled = true : legendEntry.toggled = false;
          break;
        case "visibilityOff":
          legendEntry.toggled = false;
          break;
      }

      // add all child components to stack to be traversed next, if they exist
      if (legendEntry.children) {
        if (legendEntry.children.length > 0) {
          // in the future may need to add a set of check conditions here depending on what entries we want to traverse (e.g. is expandable or is toggleable)
          legendEntry.children.forEach(child => {
            stack.push(child);
          });
        }
      }
    }
  }
}
