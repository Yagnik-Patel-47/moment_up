const showSidebar = (state: boolean = false, action) => {
  switch (action.type) {
    case "SHOW_SIDEBAR":
      return true;
    case "HIDE_SIDEBAR":
      return false;
    default:
      return state;
  }
};

export default showSidebar;
