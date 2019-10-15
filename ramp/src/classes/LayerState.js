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
  }

  addChild(node) {
    this.children.push(node);
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
}
