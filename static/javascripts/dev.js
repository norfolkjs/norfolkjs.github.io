let lastServerReload = '';

const reloadInterval = setInterval(async () => {
    const { lastReload } = await (await fetch('/dev/reload')).json();
    if (!lastServerReload) lastServerReload = lastReload;

    if (lastReload !== lastServerReload) {
        clearInterval(reloadInterval);
        window.location.reload();
        console.log('reloading...');
    }
}, 2000);
