import { type FastifyPluginAsync } from 'fastify'
import { adaptRoute } from '../../../main/adapters/fastify-route-adapter'
import { makeCreateQuestionController } from '../../../main/factories/question/create-question-factory'
import { makeGetQuestionController } from '../../../main/factories/question/get-question-factory'
import { makeDeleteQuestionController } from '../../../main/factories/question/delete-question-factory'
import { makeFindUnansweredQuestionsController } from '../../../main/factories/question/find-unanswered-factory'

const questionRoutes: FastifyPluginAsync = async (f) => {
  f.post('/', adaptRoute(makeCreateQuestionController()))
  f.get('/:id', adaptRoute(makeGetQuestionController()))
  f.delete('/:id', adaptRoute(makeDeleteQuestionController()))
  f.get('/:recipientId/unanswered', adaptRoute(makeFindUnansweredQuestionsController()))
}

export default questionRoutes
