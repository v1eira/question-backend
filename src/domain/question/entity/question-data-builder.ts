import { Question } from './question'

export default class QuestionBuilder {
  private id: string = 'question-1'
  private content: string = 'How are u?'
  private askerId: string = 'askerId'
  private recipientId: string = 'recipientId'

  public withId (id: string): this {
    this.id = id
    return this
  }

  public withContent (content: string): this {
    this.content = content
    return this
  }

  public withAskerId (askerId: string): this {
    this.askerId = askerId
    return this
  }

  public withRecipientId (recipientId: string): this {
    this.recipientId = recipientId
    return this
  }

  public build (): Question {
    return new Question({
      id: this.id,
      content: this.content,
      askerId: this.askerId,
      recipientId: this.recipientId
    })
  }
}
