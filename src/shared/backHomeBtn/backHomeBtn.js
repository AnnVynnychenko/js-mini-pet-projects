export function initBackButton(homeUrl = import.meta.env.BASE_URL) {
  const currentPath = window.location.pathname;
  const basePath = import.meta.env.BASE_URL;

  if (
    currentPath === basePath ||
    currentPath === `${basePath}.index.html` ||
    currentPath === '/' ||
    currentPath === '/index.html'
  )
    return;

  const backBtn = document.createElement('a');
  backBtn.href = homeUrl;
  backBtn.className = 'back-at-home-btn';
  backBtn.innerHTML = `
    <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  `;
  backBtn.title = 'Back to the main menu';
  document.body.appendChild(backBtn);
}
