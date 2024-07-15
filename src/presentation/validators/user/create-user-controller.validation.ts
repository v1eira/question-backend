import { z } from 'zod'
import { toValidationError } from '../../helpers/zod-validation-error-mapper'
import { type Validation } from '../../protocols/validation'

const createUser = z.object({
  fullName: z.string({ message: 'fullName: expect string' }).min(1, 'fullName: required'),
  username: z.string({ message: 'username: expect string' }).min(3, 'username: should have at least 3 characters'),
  email: z.string({ message: 'email: expect string' }).email('email: invalid email format'),
  password: z.string({ message: 'password: expect string' }).min(6, 'password: should have at least 6 characters'),
  summary: z.string({ message: 'summary: expect string' }).optional(),
  location: z.string({ message: 'location: expect string' }).optional()
})

export default class CreateUserControllerValidation implements Validation {
  async validate (input: any): Promise<void> {
    const result = createUser.safeParse(input)
    if (!result.success) {
      throw toValidationError(result.error)
    }
  }
}
