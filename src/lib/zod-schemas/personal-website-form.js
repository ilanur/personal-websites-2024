import { z } from 'zod'

export const pwFormSchema = z.object({
	slug: z.string().min(1, { message: 'Website slug is required' }).trim(),
	nationality: z.string().min(1, { message: 'Nationality is required' }).trim()
})
