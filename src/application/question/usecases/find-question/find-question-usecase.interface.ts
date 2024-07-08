import { type FindQuestionOutputDTO, type FindQuestionInputDTO } from './find-question-dto'

export default interface FindQuestionUseCaseInterface {
  execute: (input: FindQuestionInputDTO) => Promise<FindQuestionOutputDTO>
}
