import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type Request, type Response } from 'express'

export function createServerSupabaseClient(req: Request, res: Response) {
  return createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name]
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookie(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          res.cookie(name, '', options)
        },
      },
    }
  )
}
