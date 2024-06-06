export class Answer {
  private readonly _id: string
  private readonly _content: string
  private readonly _responderId: string
  private readonly _questionId: string
  private _likes: number = 0
  private readonly _createdAt: Date

  get id (): string {
    return this._id
  }

  get content (): string {
    return this._content
  }

  get responderId (): string {
    return this._responderId
  }

  get questionId (): string {
    return this._questionId
  }

  get likes (): number {
    return this._likes
  }

  setLikes (likes: number): void {
    if (likes < 0) {
      throw new Error('Likes must be greater than 0')
    }
    if (!Number.isInteger(likes)) {
      throw new Error('Likes must be an integer')
    }
    this._likes = likes
  }

  get createdAt (): Date {
    return this._createdAt
  }

  private validate (): void {
    if (this.id.length === 0) {
      throw new Error('ID is required')
    }

    if (this.content.length === 0) {
      throw new Error('Content is required')
    }

    if (this.questionId.length === 0) {
      throw new Error('QuestionId is required')
    }

    if (this.responderId.length === 0) {
      throw new Error('ResponderId is required')
    }
  }

  constructor ({ id, content, responderId, questionId }) {
    this._id = id
    this._content = content
    this._responderId = responderId
    this._questionId = questionId
    this._createdAt = new Date()
    this.validate()
  }
}
