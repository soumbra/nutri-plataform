import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  userId: string
  email: string
  role: 'CLIENT' | 'NUTRITIONIST' | 'ADMIN'
  exp: number
}

// Helper para validar token e extrair role
function validateToken(token: string): { isValid: boolean; role?: string } {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    
    // Verificar se token expirou
    if (decoded.exp * 1000 < Date.now()) {
      return { isValid: false }
    }

    return { isValid: true, role: decoded.role }
  } catch {
    return { isValid: false }
  }
}

// Helper para determinar tipo de rota
function getRouteType(pathname: string): 'auth' | 'nutritionist' | 'client' | 'admin' | 'protected' | 'public' {
  if (['/login', '/register'].some(route => pathname.startsWith(route))) {
    return 'auth'
  }
  
  if (pathname.startsWith('/dashboard/nutritionist')) {
    return 'nutritionist'
  }
  
  if (pathname.startsWith('/dashboard/client')) {
    return 'client'
  }
  
  if (pathname.startsWith('/dashboard/admin')) {
    return 'admin'
  }
  
  if (pathname.startsWith('/dashboard')) {
    return 'protected'
  }
  
  return 'public'
}

// Helper para determinar redirecionamento por role
function getRedirectByRole(role: string): string {
  switch (role) {
    case 'NUTRITIONIST':
      return '/dashboard/nutritionist'
    case 'CLIENT':
    case 'ADMIN':
    default:
      return '/dashboard'
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  const routeType = getRouteType(request.nextUrl.pathname)
  
  // Rota pública - permite acesso
  if (routeType === 'public') {
    return NextResponse.next()
  }
  
  // Rota de auth - sempre permite acesso, mas verifica se já está logado
  if (routeType === 'auth') {
    // Se tem token válido, redireciona para dashboard
    if (token) {
      const { isValid, role } = validateToken(token)
      if (isValid) {
        return NextResponse.redirect(new URL(getRedirectByRole(role || 'CLIENT'), request.url))
      }
      // Se token inválido, remove e continua para página de auth
      const response = NextResponse.next()
      response.cookies.delete('token')
      return response
    }
    // Sem token, continua normalmente para página de auth
    return NextResponse.next()
  }
  
  // Rota protegida sem token - redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Validar token e verificar permissões para rotas protegidas
  const { isValid, role } = validateToken(token)
  
  if (!isValid) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }
  
  // Verificar permissões por role
  if (routeType === 'nutritionist' && role !== 'NUTRITIONIST') {
    return NextResponse.redirect(new URL(getRedirectByRole(role || 'CLIENT'), request.url))
  }
  
  if (routeType === 'client' && role !== 'CLIENT') {
    return NextResponse.redirect(new URL(getRedirectByRole(role || 'NUTRITIONIST'), request.url))
  }
  
  if (routeType === 'admin' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}