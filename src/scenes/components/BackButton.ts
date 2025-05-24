export function createBackButton(onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.textContent = '← Back'

  Object.assign(btn.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    zIndex: '10001',
    userSelect: 'none',
    transition: 'background-color 0.3s ease',
  })

  btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#555')
  btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#333')
  btn.addEventListener('click', onClick)

  document.body.appendChild(btn)
  return btn
}