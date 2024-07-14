import { type FastifyRequest, type FastifyReply } from 'fastify'
import { type Controller } from '../../presentation/protocols/controller'
import { type HttpRequest } from '../../presentation/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const httpRequest: HttpRequest = {
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {},
      headers: req.headers ?? {}
    }

    const httpResponse = await controller.handle(httpRequest)

    return await res
      .header('Content-Type', 'application/json')
      .status(httpResponse.statusCode)
      .send(httpResponse.body)
  }
}
