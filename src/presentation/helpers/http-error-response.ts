import { type HttpResponse } from '../protocols/http'

export default function makeHttpErrorResponse (error: Error): HttpResponse {
  const errorResponse: Record<string, HttpResponse> = {
    InvalidRequestError: { statusCode: 400, body: { error: error.message } },
    NotFoundError: { statusCode: 404, body: { error: error.message } },
    ConflictError: { statusCode: 409, body: { error: error.message } },
    ServerError: { statusCode: 500, body: { error: 'Internal Server Error' } }
  }

  return errorResponse[error.name] ?? errorResponse.ServerError
}
