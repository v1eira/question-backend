import { type GetAnsweredQuestionOutputDTO, type GetAnsweredQuestionInputDTO } from './get-answered-question-dto'

export default interface GetAnsweredQuestionUseCaseInterface {
  execute: (input: GetAnsweredQuestionInputDTO) => Promise<GetAnsweredQuestionOutputDTO>
}
