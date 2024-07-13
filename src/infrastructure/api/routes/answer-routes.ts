import { type FastifyPluginAsync } from 'fastify'
import { adaptRoute } from '../../../main/adapters/fastify-route-adapter'
import { makeCreateAnswerController } from '../../../main/factories/answer/create-answer-factory'
import { makeDeleteAnswerController } from '../../../main/factories/answer/delete-answer-factory'

const answerRoutes: FastifyPluginAsync = async (f) => {
  f.post('/', adaptRoute(makeCreateAnswerController()))
  f.delete('/:id', adaptRoute(makeDeleteAnswerController()))
}

export default answerRoutes
