import { type DeleteAnswerInputDTO } from './delete-answer-dto'

export default interface DeleteAnswerUseCaseInterface {
  execute: (input: DeleteAnswerInputDTO) => Promise<void>
}
