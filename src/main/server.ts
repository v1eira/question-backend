/* eslint-disable @typescript-eslint/no-unsafe-argument */
import fastify from '../infrastructure/api/fastify'
import cors from '@fastify/cors'
import userRoutes from '../infrastructure/api/routes/user-routes'
import questionRoutes from '../infrastructure/api/routes/question-routes'

const app = fastify

void app.register(cors, { origin: '*' })

void app.register(userRoutes, { prefix: '/users' })
void app.register(questionRoutes, { prefix: '/questions' })

void app.listen({
  host: '0.0.0.0',
  port: (process.env.PORT != null) ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log('Server running')
})

export default app
