import { Container, Renderer } from 'pixi.js'

export class TouchScroller {
  private isTouching = false
  private touchStartY = 0
  private containerStartY = 0
  private minY = 0
  private maxY = 0

  constructor(
    private container: Container,
    private renderer: Renderer,
    private padding: number,
    private contentHeight: number,
  ) {
    this.maxY = padding
    this.minY = padding + renderer.height - contentHeight
    this.setupListeners()
  }

  private touchStartHandler = (e: TouchEvent) => {
    if (e.touches.length !== 1) return
    this.isTouching = true
    this.touchStartY = e.touches[0].clientY
    this.containerStartY = this.container.y
    e.preventDefault()
  }

  private touchMoveHandler = (e: TouchEvent) => {
    if (!this.isTouching || e.touches.length !== 1) return
    const deltaY = e.touches[0].clientY - this.touchStartY
    let newY = this.containerStartY + deltaY

    if (newY > this.maxY) newY = this.maxY
    if (newY < this.minY) newY = this.minY

    this.container.y = newY
    e.preventDefault()
  }

  private touchEndHandler = () => {
    this.isTouching = false
  }

  private setupListeners() {
    const view = this.renderer.view
    if (!(view instanceof HTMLCanvasElement)) return

    view.style.touchAction = 'none'
    view.addEventListener('touchstart', this.touchStartHandler, { passive: false })
    view.addEventListener('touchmove', this.touchMoveHandler, { passive: false })
    view.addEventListener('touchend', this.touchEndHandler)
    view.addEventListener('touchcancel', this.touchEndHandler)
  }

  public destroy() {
    const view = this.renderer.view
    if (!(view instanceof HTMLCanvasElement)) return

    view.style.touchAction = ''
    view.removeEventListener('touchstart', this.touchStartHandler)
    view.removeEventListener('touchmove', this.touchMoveHandler)
    view.removeEventListener('touchend', this.touchEndHandler)
    view.removeEventListener('touchcancel', this.touchEndHandler)
  }
}