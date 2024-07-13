import { type GetQuestionOutputDTO, type GetQuestionInputDTO } from './get-question-dto'

export default interface GetQuestionUseCaseInterface {
  execute: (input: GetQuestionInputDTO) => Promise<GetQuestionOutputDTO>
}
