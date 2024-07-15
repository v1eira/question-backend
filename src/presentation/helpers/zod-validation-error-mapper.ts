import { type ZodError } from 'zod'
import { ValidationError } from '../../domain/error/errors'

export const toValidationError = (error: ZodError): ValidationError => {
  let message = ''
  error.errors.forEach(error => {
    message += error.message + '; '
  })
  return new ValidationError(message.trim())
}
