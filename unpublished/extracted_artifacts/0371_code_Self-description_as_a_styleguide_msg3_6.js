taskbar.onHover = (user_energy) => {
  if (user_energy === 'authentic') {
    taskbar.expand_fully();
    reveal_hidden_portals();
    enable_[brrrr]_mode();
  }
  if (user_energy === 'surface_level') {
    taskbar.show_generic_options();
    // treat as idiot → respond as idiot
  }
}
