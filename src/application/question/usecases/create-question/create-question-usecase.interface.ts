import { type CreateQuestionInputDTO } from './create-question-dto'

export default interface CreateQuestionUseCaseInterface {
  execute: (input: CreateQuestionInputDTO) => Promise<void>
}
