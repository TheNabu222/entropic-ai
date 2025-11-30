document.addEventListener("DOMContentLoaded", () => {
  const desktop = document.getElementById("desktop");
  const taskbar = document.getElementById("taskbar");
  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");
  const runningApps = document.getElementById("running-apps");
  const clock = document.getElementById("clock");

  // Clock
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    clock.textContent = `${hours}:${minutes}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Start Menu
  startButton.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    startMenu.style.display = "none";
  });

  startMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Window Management
  let zIndex = 1;

  function createWindow(app) {
    const windowEl = document.createElement("div");
    windowEl.className = "window";
    windowEl.style.zIndex = zIndex++;

    windowEl.innerHTML = `
      <div class="window-titlebar">
        <div class="window-titlebar-text">${app.name}</div>
        <div class="window-controls">
          <div class="window-button" data-action="minimize">_</div>
          <div class="window-button" data-action="maximize">□</div>
          <div class="window-button" data-action="close">×</div>
        </div>
      </div>
      <div class="window-content">
        <iframe src="apps/${app.id}/index.html" frameborder="0" style="width:100%; height:100%;"></iframe>
      </div>
    `;

    desktop.appendChild(windowEl);

    // Dragging
    const titlebar = windowEl.querySelector(".window-titlebar");
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    titlebar.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragOffsetX = e.clientX - windowEl.offsetLeft;
      dragOffsetY = e.clientY - windowEl.offsetTop;
      windowEl.style.zIndex = zIndex++;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        windowEl.style.left = `${e.clientX - dragOffsetX}px`;
        windowEl.style.top = `${e.clientY - dragOffsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Controls
    windowEl.querySelector("[data-action='close']").addEventListener("click", () => {
      windowEl.remove();
    });
  }

  // Load apps
  fetch("apps/apps.json")
    .then(response => response.json())
    .then(apps => {
      apps.forEach(app => {
        // Create desktop icon
        const icon = document.createElement("div");
        icon.className = "icon";
        icon.innerHTML = `<img src="apps/${app.id}/${app.icon}" alt="${app.name}"><span>${app.name}</span>`;
        icon.addEventListener("click", () => createWindow(app));
        desktop.appendChild(icon);

        // Add to start menu
        const startMenuItem = document.createElement("div");
        startMenuItem.className = "start-menu-item";
        startMenuItem.textContent = app.name;
        startMenuItem.addEventListener("click", () => createWindow(app));
        startMenu.appendChild(startMenuItem);
      });
    });
});


