import { type CreateAnswerInputDTO } from './create-answer-dto'

export default interface CreateAnswerUsecaseInterface {
  execute: (input: CreateAnswerInputDTO) => Promise<void>
}
