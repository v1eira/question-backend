import { type FindUnansweredQuestionsInputDto, type FindUnansweredQuestionsOutputDto } from './find-unanswered-questions-dto'

export default interface FindUnansweredQuestionsQueryHandlerInterface {
  execute: (input: FindUnansweredQuestionsInputDto) => Promise<FindUnansweredQuestionsOutputDto>
}
