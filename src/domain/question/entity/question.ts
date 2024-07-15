interface QuestionProps {
  id: string
  content: string
  askerId: string
  recipientId: string
  createdAt?: Date
  deletedAt?: Date
}

export class Question {
  private readonly _id: string
  private readonly _content: string
  private readonly _askerId: string
  private readonly _recipientId: string
  private _createdAt: Date
  private _deletedAt: Date | null

  constructor (props: QuestionProps) {
    this._id = props.id
    this._content = props.content
    this._askerId = props.askerId
    this._recipientId = props.recipientId
    this._createdAt = props.createdAt ?? new Date()
    this._deletedAt = props.deletedAt ?? null
    this.validate()
  }

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

  get deletedAt (): Date | null {
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
}
