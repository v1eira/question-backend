import { type FastifyPluginAsync } from 'fastify'
import { adaptRoute } from '../../../main/adapters/fastify-route-adapter'
import { makeCreateUserController } from '../../../main/factories/user/create-user-factory'
import { makeGetUserController } from '../../../main/factories/user/get-user-factory'
import { makeUpdateUserController } from '../../../main/factories/user/update-user-factory'
import { makeDeleteUserController } from '../../../main/factories/user/delete-user-factory'

const userRoutes: FastifyPluginAsync = async (f) => {
  f.post('/', adaptRoute(makeCreateUserController()))
  f.patch('/:id', adaptRoute(makeUpdateUserController()))
  f.delete('/:id', adaptRoute(makeDeleteUserController()))
  f.get('/:id', adaptRoute(makeGetUserController()))
}

export default userRoutes
