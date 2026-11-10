export function bootstrapApp() {
  const appRoot = typeof document !== 'undefined' ? document.getElementById('app') : null;

  if (!appRoot) {
    return;
  }

  appRoot.innerHTML = `
    <main class="app-shell">
      <section class="app-shell__content">
        <p class="eyebrow">Student Health Hub</p>
        <h1>Production-ready project structure prepared.</h1>
        <p>Application logic will be introduced in feature modules as implementation begins.</p>
      </section>
    </main>
  `;
}
