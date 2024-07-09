import { type ListUnansweredQuestionsInputDto, type ListUnansweredQuestionsOutputDto } from './list-unanswered-questions-dto'

export default interface ListUnansweredQuestionsQueryHandlerInterface {
  execute: (input: ListUnansweredQuestionsInputDto) => Promise<ListUnansweredQuestionsOutputDto>
}
