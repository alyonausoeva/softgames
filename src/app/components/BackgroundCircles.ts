import { Graphics, Ticker, Application } from 'pixi.js'

interface Circle {
  graphics: Graphics
  x: number
  y: number
  radius: number
  speed: number
  direction: number
  alphaSpeed: number
}

export class Background extends Graphics {
  private circles: Circle[] = []
  private app: Application

  constructor(app: Application) {
    super()
    this.app = app
    this.createCircles()
    this.app.stage.addChild(this)

    Ticker.shared.add(this.update, this)
  }

  private createCircles() {
    const numCircles = 15
    const colors = [0x007BFF, 0x0056b3, 0x3399FF]
    const maxRadius = 120
    const minRadius = 40

    for (let i = 0; i < numCircles; i++) {
      const graphics = new Graphics()
      const radius = minRadius + Math.random() * (maxRadius - minRadius)
      const x = Math.random() * this.app.renderer.width
      const y = Math.random() * this.app.renderer.height
      const color = colors[i % colors.length]
      const alpha = 0.15 + Math.random() * 0.15
      const speed = 0.1 + Math.random() * 0.3
      const direction = Math.random() < 0.5 ? -1 : 1
      const alphaSpeed = 0.002 + Math.random() * 0.003

      graphics.beginFill(color, alpha)
      graphics.drawCircle(0, 0, radius)
      graphics.endFill()
      graphics.x = x
      graphics.y = y

      this.addChild(graphics)

      this.circles.push({
        graphics,
        x,
        y,
        radius,
        speed,
        direction,
        alphaSpeed,
      })
    }
  }

  private update() {
    for (const circle of this.circles) {
      circle.x += circle.speed * circle.direction
      if (circle.x - circle.radius > this.app.renderer.width) {
        circle.x = -circle.radius
      }
      if (circle.x + circle.radius < 0) {
        circle.x = this.app.renderer.width + circle.radius
      }
      circle.graphics.x = circle.x

      let newAlpha = circle.graphics.alpha + circle.alphaSpeed * circle.direction
      if (newAlpha > 0.3 || newAlpha < 0.1) {
        circle.direction *= -1
        newAlpha = Math.min(Math.max(newAlpha, 0.1), 0.3)
      }
      circle.graphics.alpha = newAlpha
    }
  }
}