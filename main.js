const { app, BrowserWindow } = require("electron");

require("electron-reload")(__dirname);

let win = null;

function createWindow() {
  // Crea la ventana del navegador.
  win = new BrowserWindow({
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });

  win.loadURL("https://www.instagram.com/direct/inbox/");

  win.webContents.on("did-finish-load", function () {
    win.maximize();
    win.show();
    let code = `
      const logo = document.querySelector('a[href="/"]');
      const header = logo.parentElement.parentElement.parentElement;
      const body = header.parentElement;
      const direct = document.querySelector('span[aria-label="Direct"]');
      const button = direct.parentElement.querySelector('button');
      const logoutBtn = button;
      logoutBtn.innerHTML = 'Salir';
      logoutBtn.style.position = 'fixed';
      logoutBtn.style.bottom = '20px';
      logoutBtn.style.right = '20px';
      header.appendChild(logoutBtn);
      body.style.paddingTop = 0;
      header.remove();
    `;
    win.webContents.executeJavaScript(code);
  });

  win.webContents.on("did-start-navigation", function (e, url) {
    const pages = e.sender.history.length;
    const currentPage = e.sender.history[pages - 1];
    const lastPage = e.sender.history[pages - 2];

    console.log(currentPage);
    if (
      !url.includes("https://www.instagram.com/direct/") &&
      !url.includes("https://www.instagram.com/accounts/login")
    ) {
      win.webContents.loadURL(lastPage);
    }
  });
}

// Este método se llamará cuando Electron haya finalizado
// la inicialización y esté preparado para crear la ventana del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.whenReady().then(createWindow);

// Finaliza cuando todas las ventanas estén cerradas.
app.on("window-all-closed", () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// En este archivo puede incluir el resto del código del proceso principal específico
// de su aplicación. También puedes ponerlos en archivos separados y requerirlos aquí.
