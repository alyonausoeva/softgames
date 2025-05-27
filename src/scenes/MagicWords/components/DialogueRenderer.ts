import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js'

interface DialogueEntry { name: string; text: string }

export class DialogueRenderer {
  private nameStyle = new TextStyle({ fill: '#ff0', fontSize: 18, fontWeight: 'bold' })
  private textStyle = new TextStyle({ fill: '#fff', fontSize: 18 })
  private avatarSize = 40
  private emojiSize = 24
  private lineHeight = 28
  private padding = 20

  private container: Container
  private emojiMap: Map<string, Texture>
  private avatarMap: Map<string, Texture>

  constructor(
    container: Container,
    emojiMap: Map<string, Texture>,
    avatarMap: Map<string, Texture>,
  ) {
    this.container = container
    this.emojiMap = emojiMap
    this.avatarMap = avatarMap
  }

  public render(dialogue: DialogueEntry[], maxWidth: number, rendererWidth: number): number {
    this.container.removeChildren()
    let y = 0
    const maxTextWidth = maxWidth - this.padding * 2 - this.avatarSize

    dialogue.forEach(({ name, text }) => {
      const lineCont = new Container()
      lineCont.y = y

      const avatar = this.avatarMap.get(name)
      if (avatar) {
        const spr = new Sprite(avatar)
        spr.width = spr.height = this.avatarSize
        lineCont.addChild(spr)
      }

      const nameText = new Text(name + ': ', this.nameStyle)
      nameText.x = this.avatarSize + this.padding
      lineCont.addChild(nameText)

      let cursorX = this.avatarSize + this.padding + nameText.width
      let cursorY = 0
      let currentLine = new Container()
      currentLine.y = cursorY
      lineCont.addChild(currentLine)

      text.split(/(\{.*?\})/g).forEach(part => {
        const emojiName = part.match(/^\{(.*)\}$/)?.[1]
        if (emojiName && this.emojiMap.has(emojiName)) {
          if (cursorX + this.emojiSize > maxTextWidth) {
            cursorX = this.avatarSize + this.padding
            cursorY += this.lineHeight
            currentLine = new Container()
            currentLine.y = cursorY
            lineCont.addChild(currentLine)
          }
          const spr = new Sprite(this.emojiMap.get(emojiName)!)
          spr.width = spr.height = this.emojiSize
          spr.x = cursorX
          spr.y = (this.lineHeight - this.emojiSize) / 2
          currentLine.addChild(spr)
          cursorX += this.emojiSize + 5
        } else {
          part.split(' ').filter(Boolean).forEach(word => {
            const t = new Text(word + ' ', this.textStyle)
            if (cursorX + t.width > maxTextWidth) {
              cursorX = this.avatarSize + this.padding
              cursorY += this.lineHeight
              currentLine = new Container()
              currentLine.y = cursorY
              lineCont.addChild(currentLine)
            }
            t.x = cursorX
            currentLine.addChild(t)
            cursorX += t.width
          })
        }
      })

      lineCont.x = (rendererWidth - maxWidth) / 2
      this.container.addChild(lineCont)
      y += cursorY + this.lineHeight + this.padding / 2
    })

    return y
  }
}
