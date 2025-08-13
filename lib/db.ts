import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Utility function to handle database errors
export function handleDatabaseError(error: any) {
  console.error('Database error:', error)
  
  if (error.code === 'P2002') {
    return { message: 'A record with this information already exists.' }
  }
  
  if (error.code === 'P2025') {
    return { message: 'Record not found.' }
  }
  
  if (error.code === 'P2003') {
    return { message: 'Related record not found.' }
  }
  
  return { message: 'An unexpected database error occurred.' }
}

// Utility function for pagination
export function getPaginationParams(
  page: string | string[] | undefined,
  limit: string | string[] | undefined
) {
  const pageNum = parseInt(Array.isArray(page) ? page[0] : page || '1')
  const limitNum = parseInt(Array.isArray(limit) ? limit[0] : limit || '10')
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum)),
    skip: (Math.max(1, pageNum) - 1) * Math.min(100, Math.max(1, limitNum))
  }
}

// Utility function for search filters
export function buildSearchFilter(search: string | undefined, fields: string[]) {
  if (!search) return {}
  
  return {
    OR: fields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive'
      }
    }))
  }
}

export default prisma
