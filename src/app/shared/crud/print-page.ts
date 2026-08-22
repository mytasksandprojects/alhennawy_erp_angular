/** Wide list / report prints use landscape so columns stay on one line. */
export function printWide(): void {
  const doc = document;
  const style = doc.createElement('style');
  style.setAttribute('data-print-wide', '');
  style.textContent = '@page { size: landscape; }';
  doc.head.appendChild(style);
  doc.body.classList.add('is-print-list');
  const done = () => {
    style.remove();
    doc.body.classList.remove('is-print-list');
    doc.defaultView?.removeEventListener('afterprint', done);
  };
  doc.defaultView?.addEventListener('afterprint', done);
  doc.defaultView?.print();
}
