import { z } from 'zod'

export const createBlogFormSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }).trim(),
	description: z.string().min(1, { message: 'Description is required' }).trim(),
	content: z.string().min(1, { message: 'Content is required' }).trim(),
	mainImage: z.any().refine((file) => file.size !== 0, 'A blog cover image is required')
})
