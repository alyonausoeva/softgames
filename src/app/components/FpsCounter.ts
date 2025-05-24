import { Ticker } from 'pixi.js'

export class FpsCounter {
  private container: HTMLDivElement
  private tickerCallback?: () => void

  constructor() {
    this.container = document.createElement('div')
    Object.assign(this.container.style, {
      position: 'absolute',
      top: '10px',
      left: '10px',
      color: '#ffffff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontWeight: '700',
      fontSize: '20px',
      padding: '6px 12px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '8px',
      boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
      textShadow: '0 0 4px rgba(0, 0, 0, 0.8)',
      userSelect: 'none',
      zIndex: '10000',
    })
    document.body.appendChild(this.container)
    this.start()
  }

  start() {
    if (this.tickerCallback) {
      Ticker.shared.remove(this.tickerCallback)
    }

    this.tickerCallback = () => {
      this.container.textContent = `FPS: ${Math.round(Ticker.shared.FPS)}`
    }

    Ticker.shared.add(this.tickerCallback)
  }

  stop() {
    if (this.tickerCallback) {
      Ticker.shared.remove(this.tickerCallback)
      this.tickerCallback = undefined
    }
  }

  destroy() {
    this.stop()
    this.container.remove()
  }
}