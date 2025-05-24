export type SceneCallback = () => void;

interface ButtonConfig {
  label: string;
  onClick: SceneCallback;
}

export class ButtonsManager {
  private buttons: HTMLButtonElement[] = [];
  private container: HTMLElement;

  constructor(configs: ButtonConfig[]) {
    this.container = document.createElement('div');
    Object.assign(this.container.style, {
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      zIndex: '10000',
      width: 'auto',
      maxWidth: '90vw',
    });
    document.body.appendChild(this.container);

    configs.forEach(({ label, onClick }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      this.styleButton(btn);
      btn.addEventListener('click', onClick);
      this.container.appendChild(btn);
      this.buttons.push(btn);
    });

    window.addEventListener('resize', this.updateButtonStyles);
    this.updateButtonStyles();
  }

  private styleButton(button: HTMLButtonElement) {
    Object.assign(button.style, {
      padding: '20px 40px',
      fontSize: '28px',
      fontWeight: '700',
      color: '#fff',
      backgroundColor: '#007BFF',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 6px 15px rgba(0, 123, 255, 0.6)',
      userSelect: 'none',
      minWidth: '240px',
      width: '100%',
      maxWidth: '400px',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease',
      boxSizing: 'border-box',
    });

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#0056b3';
      button.style.boxShadow = '0 8px 20px rgba(0, 86, 179, 0.8)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#007BFF';
      button.style.boxShadow = '0 6px 15px rgba(0, 123, 255, 0.6)';
    });
  }

  private updateButtonStyles = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.buttons.forEach(btn => {
        btn.style.width = '90vw';
        btn.style.whiteSpace = 'normal';
        btn.style.minWidth = 'auto';
      });
    } else {
      this.buttons.forEach(btn => {
        btn.style.whiteSpace = 'nowrap';
        btn.style.minWidth = '240px';
        btn.style.width = 'auto';
        btn.style.maxWidth = '400px';
      });

      // Optional: equalize widths by max width of all buttons
      const widths = this.buttons.map(btn => btn.offsetWidth);
      const maxWidth = Math.max(...widths);
      this.buttons.forEach(btn => {
        btn.style.width = `${maxWidth}px`;
      });
    }
  };

  public hideButtons() {
    this.buttons.forEach(btn => {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    });
  }

  public showButtons() {
    this.buttons.forEach(btn => {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    });
    this.updateButtonStyles();
  }
}