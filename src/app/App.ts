import { Application } from 'pixi.js'
import { AceOfShadows, PhoenixFlame, MagicWords } from '../scenes'
import { Background, ButtonsManager, FpsCounter } from './components'

export class App {
  private app: Application
  private aceOfShadows?: AceOfShadows
  private phoenixFlame?: PhoenixFlame
  private magicWords?: MagicWords
  private buttonsManager: ButtonsManager
  background: Background
  fpsCounter: FpsCounter

  constructor() {
    this.app = new Application({
      resizeTo: window,
      antialias: true,
    })

    this.app.renderer.background.color = 0x222222

    this.setupCanvas()

    this.background = new Background(this.app)
    this.fpsCounter = new FpsCounter()

    this.buttonsManager = new ButtonsManager([
      { label: 'Open AceOfShadows', onClick: () => this.openAceOfShadows() },
      { label: 'Open PhoenixFlame', onClick: () => this.openPhoenixFlame() },
      { label: 'Open MagicWords', onClick: () => this.openMagicWords() },
    ])
  }

  private setupCanvas() {
    const canvas = this.app.view as HTMLCanvasElement
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100vw'
    canvas.style.height = 'auto'
    canvas.style.zIndex = '1'

    document.body.appendChild(canvas)
  }

  private openAceOfShadows() {
    if (!this.aceOfShadows) {
      this.closePhoenixFlame()
      this.closeMagicWords()
      this.aceOfShadows = new AceOfShadows(this.app, () => this.closeAceOfShadows())
      this.buttonsManager.hideButtons()
    }
  }

  private openPhoenixFlame() {
    if (!this.phoenixFlame) {
      this.closeAceOfShadows()
      this.closeMagicWords()
      this.phoenixFlame = new PhoenixFlame(this.app, () => this.closePhoenixFlame())
      this.buttonsManager.hideButtons()
    }
  }

  private openMagicWords() {
    if (!this.magicWords) {
      this.closeAceOfShadows()
      this.closePhoenixFlame()
      this.magicWords = new MagicWords(this.app, () => this.closeMagicWords())
      this.buttonsManager.hideButtons()
    }
  }

  private closeAceOfShadows() {
    if (this.aceOfShadows) {
      this.aceOfShadows.destroy()
      this.aceOfShadows = undefined
    }
    this.buttonsManager.showButtons()
  }

  private closePhoenixFlame() {
    if (this.phoenixFlame) {
      this.phoenixFlame.destroy()
      this.phoenixFlame = undefined
    }
    this.buttonsManager.showButtons()
  }

  private closeMagicWords() {
    if (this.magicWords) {
      this.magicWords.destroy()
      this.magicWords = undefined
    }

    this.buttonsManager.showButtons()
  }
}