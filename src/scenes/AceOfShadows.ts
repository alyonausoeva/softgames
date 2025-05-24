import { Application, Graphics, Sprite, Texture, Container } from 'pixi.js'
import { createBackButton } from './components'

type Stack = { cards: Sprite[], pos: { x: number, y: number } }

export class AceOfShadows {
  private app: Application
  private stacks: Stack[] = []
  private cardTexture!: Texture
  private moveId: number | null = null
  private backButton: HTMLButtonElement | null = null
  private onBack: () => void

  private cardW = 100
  private cardH = 140
  private offsetY = 6
  private stacksCount = 6
  private cardsPerStack = 24

  private bg?: Graphics

  constructor(app: Application, onBack: () => void) {
    this.app = app
    this.onBack = onBack

    this.setup()
    window.addEventListener('resize', () => this.onResize())

    this.backButton = createBackButton(() => {
      this.destroy()
      this.onBack()
    })
  }

  private setup() {
    const w = window.innerWidth
    this.stacksCount = w < 768 ? 4 : 6
    this.cardW = Math.min(Math.max(40, w / (this.stacksCount * 1.5)), 100)
    this.cardH = this.cardW * 1.4
    this.offsetY = this.cardW * 0.06

    this.createBackground()
    this.createStacks()
    this.cardTexture = this.createCardBackTexture()
    this.spawnCards()
    this.startMoving()
  }

  private createBackground() {
    if (this.bg) this.app.stage.removeChild(this.bg)
    this.bg = new Graphics()
    this.bg.beginFill(0xddeeff)
    this.bg.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height)
    this.bg.endFill()
    this.app.stage.addChildAt(this.bg, 0)
  }

  private createStacks() {
    this.stacks = []
    const margin = 20
    const stackWidth = this.cardW + margin
    const totalWidth = this.stacksCount * stackWidth - margin
    const startX = (this.app.renderer.width - totalWidth) / 2
    const centerY = this.app.renderer.height / 2
    for (let i = 0; i < this.stacksCount; i++) {
      this.stacks.push({ cards: [], pos: { x: startX + i * stackWidth + this.cardW / 2, y: centerY } })
    }
  }

  private createCardBackTexture() {
    const g = new Graphics()
    g.beginFill(0x003366)
    g.lineStyle(2, 0x000000)
    g.drawRoundedRect(0, 0, this.cardW, this.cardH, 12)
    g.endFill()

    const stripes = new Graphics()
    stripes.lineStyle(1, 0xffffff, 0.15)
    for (let i = -this.cardH; i < this.cardH; i += 12) {
      stripes.moveTo(i, 0)
      stripes.lineTo(i + this.cardH, this.cardH)
    }

    const mask = new Graphics()
    mask.beginFill(0xffffff)
    mask.drawRoundedRect(0, 0, this.cardW, this.cardH, 12)
    mask.endFill()

    stripes.mask = mask

    const container = new Container()
    container.addChild(g, stripes, mask)

    return this.app.renderer.generateTexture(container)
  }

  private spawnCards() {
    this.app.stage.children
      .filter(c => c !== this.bg)
      .forEach(c => this.app.stage.removeChild(c))

    const totalCards = this.stacksCount * this.cardsPerStack
    for (let i = 0; i < totalCards; i++) {
      const stack = this.stacks[i % this.stacks.length]
      const card = new Sprite(this.cardTexture)
      card.anchor.set(0.5)
      card.x = stack.pos.x
      card.y = stack.pos.y - stack.cards.length * this.offsetY
      this.app.stage.addChild(card)
      stack.cards.push(card)
    }
  }

  private startMoving() {
    if (this.moveId) clearInterval(this.moveId)
    this.moveId = window.setInterval(() => {
      const nonEmpty = this.stacks.filter(s => s.cards.length)
      if (nonEmpty.length === 0) return

      const source = nonEmpty[Math.floor(Math.random() * nonEmpty.length)]
      const card = source.cards.pop()
      if (!card) return

      source.cards.forEach((c, i) => c.y = source.pos.y - i * this.offsetY)

      let target: Stack
      do {
        target = this.stacks[Math.floor(Math.random() * this.stacks.length)]
      } while (target === source)

      const targetX = target.pos.x
      const targetY = target.pos.y - target.cards.length * this.offsetY

      const startTime = performance.now()
      const duration = 2000
      const fromX = card.x
      const fromY = card.y

      const animate = (time: number) => {
        const t = Math.min((time - startTime) / duration, 1)
        card.x = fromX + (targetX - fromX) * t
        card.y = fromY + (targetY - fromY) * t
        if (t < 1) requestAnimationFrame(animate)
        else target.cards.push(card)
      }

      requestAnimationFrame(animate)
    }, 1000)
  }

  private onResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight)
    this.setup()
  }

  public destroy() {
    if (this.moveId) clearInterval(this.moveId)
    this.moveId = null
    this.app.stage.children
      .filter(c => c !== this.bg)
      .forEach(c => this.app.stage.removeChild(c))
    if (this.backButton) {
      this.backButton.remove()
      this.backButton = null
    }
    window.removeEventListener('resize', () => this.onResize())
    if (this.bg) this.bg.clear()
  }
}