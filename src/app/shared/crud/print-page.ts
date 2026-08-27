/** Inject landscape @page; caller must drop the style after print. */
export function attachLandscape(): () => void {
  const style = document.createElement('style');
  style.setAttribute('data-print-wide', '');
  style.textContent = '@page { size: landscape; }';
  document.head.appendChild(style);
  return () => style.remove();
}

/** Wide list / report prints use landscape so columns stay on one line. */
export function printWide(): void {
  const drop = attachLandscape();
  const doc = document;
  doc.body.classList.add('is-print-list');
  const done = () => {
    drop();
    doc.body.classList.remove('is-print-list');
    doc.defaultView?.removeEventListener('afterprint', done);
  };
  doc.defaultView?.addEventListener('afterprint', done);
  doc.defaultView?.print();
}
