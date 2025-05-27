import { Application, Container, Graphics, Texture, Renderer } from 'pixi.js'
import { TouchScroller } from './components/TouchScroller'
import { DialogueRenderer } from './components/DialogueRenderer'
import { createBackButton } from '../components/BackButton'

interface EmojiEntry { name: string; url: string }
interface AvatarEntry { name: string; url: string }
interface DialogueEntry { name: string; text: string }

export class MagicWords {
  private container = new Container()
  private mask = new Graphics()
  private emojiMap = new Map<string, Texture>()
  private avatarMap = new Map<string, Texture>()
  private dialogue: DialogueEntry[] = []
  private contentHeight = 0
  private maxWidth = 600
  private padding = 20
  private touchScroller: TouchScroller | null = null
  private dialogueRenderer: DialogueRenderer
  private backButton: HTMLButtonElement | null = null

  private app: Application
  private onClose: () => void

  constructor(app: Application, onClose: () => void) {
    this.app = app
    this.onClose = onClose

    this.app.stage.addChild(this.container)
    this.dialogueRenderer = new DialogueRenderer(this.container, this.emojiMap, this.avatarMap)
    this.resize()
    window.addEventListener('resize', this.resize)
    this.load()

    this.backButton = createBackButton(() => {
      this.onClose()
      this.destroy()
    })

    if (window.innerWidth <= 480) this.setupTouchScroll()
  }

  private resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.maxWidth = w <= 480 ? 320 : 600
    this.app.renderer.resize(w, h)

    this.mask.clear()
      .beginFill(0xffffff)
      .drawRect((w - this.maxWidth) / 2, this.padding, this.maxWidth, h - this.padding * 2)
      .endFill()
    if (!this.mask.parent) this.app.stage.addChild(this.mask)
    this.container.mask = this.mask

    if (this.dialogue.length) this.render(this.dialogue)
  }

  private async load() {
    try {
      const res = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords')
      const data: { emojies: EmojiEntry[]; dialogue: DialogueEntry[]; avatars: AvatarEntry[] } = await res.json()
      data.emojies.forEach(e => this.emojiMap.set(e.name, Texture.from(e.url)))
      data.avatars.forEach(a => this.avatarMap.set(a.name, Texture.from(a.url)))
      this.dialogue = data.dialogue
      this.render(this.dialogue)
    } catch (e) {
      console.error(e)
    }
  }

  private render(dialogue: DialogueEntry[]) {
    this.contentHeight = this.dialogueRenderer.render(dialogue, this.maxWidth, this.app.renderer.width)
    this.container.y = this.padding
    if (this.touchScroller) {
      this.touchScroller.destroy()
      this.touchScroller = null
    }
    if (window.innerWidth <= 480) this.setupTouchScroll()
  }

  private setupTouchScroll() {
    this.touchScroller = new TouchScroller(
      this.container,
      this.app.renderer as unknown as Renderer, 
      this.padding,
      this.contentHeight
    )
  }

  public destroy() {
    window.removeEventListener('resize', this.resize)
    if (this.touchScroller) {
      this.touchScroller.destroy()
      this.touchScroller = null
    }
    this.container.destroy({ children: true })
    this.mask.destroy()
    if (this.backButton) {
      this.backButton.remove()
      this.backButton = null
    }
  }
}
