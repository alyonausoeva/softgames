import { Application, Container, Graphics } from 'pixi.js'
import { createBackButton } from './components'

type Particle = {
  graphic: Graphics
  velocityY: number
  life: number
  maxLife: number
  baseX: number
  phase: number
  scale: number
}

export class PhoenixFlame {
  private app: Application
  private container: Container
  private particles: Particle[] = []
  private maxParticles = 15
  private emitterPos = { x: 0, y: 0 }

  private backButton: HTMLButtonElement | null = null
  private onBack: () => void

  constructor(app: Application, onBack: () => void) {
    this.app = app
    this.onBack = onBack

    this.container = new Container()
    this.app.stage.addChild(this.container)

    this.updateEmitterPos()
    window.addEventListener('resize', this.updateEmitterPos)

    this.app.ticker.add(this.update, this)

    this.backButton = createBackButton(() => {
      this.destroy()
      this.onBack()
    })
  }

  private updateEmitterPos = () => {
    this.emitterPos = {
      x: this.app.renderer.width / 2,
      y: this.app.renderer.height / 2,
    }
  }

  private spawnParticle() {
    if (this.particles.length >= this.maxParticles) return

    const g = new Graphics()
    g.beginFill(0xff6600)
    g.drawCircle(0, 0, 20)
    g.endFill()
    g.x = this.emitterPos.x + (Math.random() - 0.5) * 80
    g.y = this.emitterPos.y
    const scale = 0.8 + Math.random() * 1.2
    g.scale.set(scale)

    this.container.addChild(g)

    this.particles.push({
      graphic: g,
      velocityY: -(1 + Math.random() * 2),
      life: 0,
      maxLife: 60 + Math.random() * 40,
      baseX: g.x,
      phase: Math.random() * Math.PI * 2,
      scale,
    })
  }

  private update(delta: number) {
    if (Math.random() < 0.3) this.spawnParticle()

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life += delta

      p.graphic.y += p.velocityY * delta
      p.graphic.x = p.baseX + Math.sin(p.life * 0.2 + p.phase) * 10

      const lifeRatio = p.life / p.maxLife
      const pulse = 0.8 + 0.4 * Math.sin(p.life * 0.3 + p.phase)
      p.graphic.scale.set(p.scale * pulse * (1 - lifeRatio))

      p.graphic.alpha = 1 - lifeRatio

      if (p.life >= p.maxLife) {
        this.container.removeChild(p.graphic)
        this.particles.splice(i, 1)
      }
    }
  }

  destroy() {
    this.app.ticker.remove(this.update, this)
    this.container.destroy({ children: true })
    window.removeEventListener('resize', this.updateEmitterPos)

    if (this.backButton) {
      this.backButton.remove()
      this.backButton = null
    }
  }
}