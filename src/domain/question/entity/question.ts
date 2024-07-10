export class Question {
  private readonly _id: string
  private readonly _content: string
  private readonly _askerId: string
  private readonly _recipientId: string
  private _createdAt: Date
  private _deletedAt: Date

  get id (): string {
    return this._id
  }

  get content (): string {
    return this._content
  }

  get askerId (): string {
    return this._askerId
  }

  get recipientId (): string {
    return this._recipientId
  }

  get createdAt (): Date {
    return this._createdAt
  }

  setCreatedAt (createdAt: Date): void {
    this._createdAt = createdAt
  }

  get deletedAt (): Date {
    return this._deletedAt
  }

  setDeletedAt (deletedAt: Date): void {
    this._deletedAt = deletedAt
  }

  private validate (): void {
    if (this.id.length === 0) {
      throw new Error('ID is required')
    }

    if (this.content.length === 0) {
      throw new Error('Content is required')
    }

    if (this.askerId.length === 0) {
      throw new Error('Asker ID is required')
    }

    if (this.recipientId.length === 0) {
      throw new Error('Recipient ID is required')
    }

    if (this.askerId === this.recipientId) {
      throw new Error('Question recipient should be different than asker')
    }
  }

  constructor ({ id, content, askerId, recipientId }) {
    this._id = id
    this._content = content
    this._askerId = askerId
    this._recipientId = recipientId
    this._createdAt = new Date()
    this.validate()
  }
}
