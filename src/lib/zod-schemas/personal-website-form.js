import { z } from 'zod'

export const pwFormSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }).trim(),
	slug: z.string().min(1, { message: 'Website slug is required' }).trim(),
	nationality: z.string().min(1, { message: 'Nationality is required' }).trim(),
	city: z.string().min(1, { message: 'City is required' }).trim()
})
