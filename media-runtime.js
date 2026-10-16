// Keep the first-frame cover on constrained connections; load other videos on demand.
document.addEventListener('DOMContentLoaded', () => {
  const connection = navigator.connection;
  const constrained = connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('video[data-efficient-autoplay]').forEach(video => {
    if (!constrained && !reduced) {
      video.muted = true;
      video.play().catch(() => {});
    }
  });
});
