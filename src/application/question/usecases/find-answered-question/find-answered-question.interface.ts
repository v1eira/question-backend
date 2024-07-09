import { type FindAnsweredQuestionOutputDTO, type FindAnsweredQuestionInputDTO } from './find-answered-question-dto'

export default interface FindAnsweredQuestionUseCaseInterface {
  execute: (input: FindAnsweredQuestionInputDTO) => Promise<FindAnsweredQuestionOutputDTO>
}
