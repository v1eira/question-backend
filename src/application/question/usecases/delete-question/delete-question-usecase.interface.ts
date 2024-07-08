import { type DeleteQuestionInputDTO } from './delete-question-dto'

export default interface DeleteQuestionUseCaseInterface {
  execute: (input: DeleteQuestionInputDTO) => Promise<void>
}
