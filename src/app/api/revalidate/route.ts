import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Validar el token secreto
    const secret = request.headers.get('x-revalidate-secret');
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error('❌ REVALIDATE_SECRET no configurado');
      return NextResponse.json(
        { error: 'Secret not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.error('❌ Token de revalidación inválido');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Obtener las rutas a revalidar del body (opcional)
    const body = await request.json().catch(() => ({}));
    const { paths = [], tags = [] } = body;

    // Rutas por defecto a revalidar
    const defaultPaths = [
      '/',
      '/firma-scarpa',
      '/guias-ia',
      '/jurisprudencia',
      '/normativa',
      '/recursos',
      '/etica-ia',
      '/propiedad-intelectual-ia',
      '/guia',
      '/global-ia'
    ];

    // Tags por defecto a revalidar
    const defaultTags = [
      'firma-scarpa-posts',
      'actualidad-posts',
      'jurisprudencia-posts',
      'normativa-posts',
      'recursos-posts',
      'etica-ia-posts',
      'propiedad-intelectual-ia-posts',
      'guia-posts',
      'global-ia-posts'
    ];

    // Combinar rutas y tags
    const pathsToRevalidate = [...new Set([...defaultPaths, ...paths])];
    const tagsToRevalidate = [...new Set([...defaultTags, ...tags])];

    console.log('🔄 Iniciando revalidación...');
    console.log('📂 Paths:', pathsToRevalidate);
    console.log('🏷️ Tags:', tagsToRevalidate);

    // Revalidar rutas
    pathsToRevalidate.forEach(path => {
      try {
        revalidatePath(path, 'page');
        console.log(`✅ Path revalidado: ${path}`);
      } catch (error) {
        console.error(`❌ Error revalidando path ${path}:`, error);
      }
    });

    // Revalidar tags
    tagsToRevalidate.forEach(tag => {
      try {
        revalidateTag(tag, '');
        console.log(`✅ Tag revalidado: ${tag}`);
      } catch (error) {
        console.error(`❌ Error revalidando tag ${tag}:`, error);
      }
    });

    const response = {
      success: true,
      message: 'Revalidación completada',
      timestamp: new Date().toISOString(),
      pathsRevalidated: pathsToRevalidate,
      tagsRevalidated: tagsToRevalidate
    };

    console.log('✅ Revalidación completada:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error en revalidación:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Solo permitir POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
