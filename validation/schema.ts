import z from 'zod'

export const LoginValidation = z.object({
  email: z.string().min(1, { message: 'this field is required' }).email(),
  password: z.string().min(1, 'this field is required'),
})
export const RegistrationValidation = z
  .object({
    username: z.string().min(1, { message: 'this field is required' }),
    email: z.string().min(1, { message: 'this field is required' }).email(),
    password: z.string().min(1, 'this field is required'),
    confirmPassword: z.string().min(1, 'this field is required'),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: "password didn't match",
        path: ['confirmPassword'],
      })
    }
  })
export const ResetValidation = z.object({
  email: z.string().min(1, { message: 'this field is required' }).email(),
})

export const NewPasswordValidation = z
  .object({
    password: z.string().min(1, { message: 'this field is required' }),
    confirmPassword: z.string().min(1, 'this field is required'),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: "password didn't match",
        path: ['confirmPassword'],
      })
    }
  })

export type RegistrationType = z.infer<typeof RegistrationValidation>
export type LoginType = z.infer<typeof LoginValidation>
export type ResetType = z.infer<typeof ResetValidation>
export type NewPasswordType = z.infer<typeof NewPasswordValidation>