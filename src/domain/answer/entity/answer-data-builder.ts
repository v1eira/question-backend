import { Answer } from './answer'

export default class AnswerBuilder {
  private id: string = '1'
  private content: string = 'I am so happy!'
  private responderId: string = 'responderId'
  private questionId: string = 'questionId'
  private likes: number = 0

  public withId (id: string): this {
    this.id = id
    return this
  }

  public withContent (content: string): this {
    this.content = content
    return this
  }

  public withResponderId (responderId: string): this {
    this.responderId = responderId
    return this
  }

  public withQuestionId (questionId: string): this {
    this.questionId = questionId
    return this
  }

  public withLikes (likes: number): this {
    this.likes = likes
    return this
  }

  public build (): Answer {
    const a = new Answer({
      id: this.id,
      content: this.content,
      responderId: this.responderId,
      questionId: this.questionId
    })
    this.likes !== 0 && a.setLikes(this.likes)
    return a
  }
}
