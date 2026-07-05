const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const postSchema = z.object({
  description: z.string().max(2000).optional().default(''),
  occasion: z.enum(['birthday', 'wedding', 'anniversary', 'graduation', 'christmas', 'mothers_day', 'valentines', 'other']).optional().default('other'),
  giftProduct: z.string().max(200).optional().default('')
});

module.exports = { registerSchema, loginSchema, postSchema };
