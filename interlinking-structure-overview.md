# Estructura de contenido MDX e interlinking

**Aviso importante sobre limitaciones técnicas**

Durante esta iteración no ha sido posible leer el contenido interno (líneas) de los archivos `.mdx` mediante los comandos disponibles en el entorno. Los intentos de usar `Get-Content` sobre rutas específicas devolvieron "Command executed successfully (no output)", por lo que NO dispongo de acceso verificable al frontmatter real de los ficheros.

Como consecuencia:
- Solo puedo documentar, con certeza, **las rutas de los archivos `.mdx`** y los **directorios** en los que se encuentran (a partir de `dir /s /b *.mdx`).
- **No es posible** en esta pasada extraer ni confirmar de forma fehaciente campos de frontmatter (`title`, `slug`, `cluster`, `category`, etc.) ni su obligatoriedad/opcionalidad.
- No se puede verificar de forma directa cómo se asignan los clusters a cada archivo a través de campos de frontmatter, por lo que cualquier mención a clusters basada en contenido interno estaría basada en inferencias, que se han evitado de acuerdo con los requisitos.

En todo lo que sigue se ha evitado cualquier inferencia no verificada. Cuando un dato no se puede comprobar, se indica explícitamente.

---

## 1. Directorios de contenido con archivos `.mdx` (lista exhaustiva observada)

El escaneo recursivo `dir /s /b "C:\\Proyectos\\derecho-artificial\\*.mdx"` ha devuelto archivos únicamente en los siguientes directorios (rutas absolutas):

1. `C:\\Proyectos\\derecho-artificial\\content`
2. `C:\\Proyectos\\derecho-artificial\\content\\posts`

No se han detectado archivos `.mdx` fuera de estos dos directorios en el proyecto tal y como se ha podido escanear desde el entorno disponible.

### 1.1. Ejemplos de archivos en `content`

Algunos de los archivos `.mdx` localizados en `C:\\Proyectos\\derecho-artificial\\content` son:

- `content\\fletcher-v-experian-analisis-doctrinal.mdx`
- `content\\fletcher-v-experian-analisis-seo.mdx`
- `content\\hallucinations-ia-legal-doctrinal-v2.mdx`
- `content\\hallucinations-ia-legal-resumen-v2.mdx`
- `content\\TSB1714-doctrinal.mdx`
- `content\\TSB1714-seo.mdx`

### 1.2. Ejemplos de archivos en `content\\posts`

El directorio `C:\\Proyectos\\derecho-artificial\\content\\posts` contiene un gran número de archivos `.mdx`. Algunos ejemplos representativos de la estructura de nombres son:

- Entradas históricas de AEPD y protección de datos (años 2016–2026), por ejemplo:
  - `content\\posts\\2016-08-29-cambios-en-la-politica-de-privacidad-de-whatsapp.mdx`
  - `content\\posts\\2018-03-02-la-aepd-publica-un-informe-en-el-que-avala-que-el-reglamento-de-proteccion-de-datos-facilita-el-desarrollo-de-la-investigacion-biomedica.mdx`
  - `content\\posts\\2024-06-04-worldcoin-se-compromete-a-paralizar-su-actividad-en-espana.mdx`
  - `content\\posts\\2026-02-18-el-vicepresidente-ejecutivo-virkkunen-en-la-india-para-la-cumbre-sobre-inteligencia-artificial.mdx`
- Artículos doctrinales/SEO por parejas, por ejemplo:
  - `content\\posts\\20-613_5_doctrinal.mdx`
  - `content\\posts\\20-613_5_seo.mdx`
  - `content\\posts\\IAFiable-doctrinal.mdx`
  - `content\\posts\\IAFiable-seo.mdx`
  - `content\\posts\\tendencias-legal-tech-doctrinal.mdx`
  - `content\\posts\\tendencias-legal-tech-seo.mdx`
- Análisis específicos de casos, guías y normativa IA, por ejemplo:
  - `content\\posts\\eu-ai-act-doctrinal-v3.mdx`
  - `content\\posts\\eu-ai-act-resumen-v3.mdx`
  - `content\\posts\\ai-act-guia-completa.mdx`
  - `content\\posts\\guia-ia-act-abogados.mdx`
  - `content\\posts\\guia-ia-jueces-protocolos.mdx`
  - `content\\posts\\seguridad-de-la-ia-2026.mdx`
  - `content\\posts\\seguridad-de-la-ia-2026-copia-etica-ia.mdx`
- Casos y sentencias de distintos ordenamientos:
  - `content\\posts\\getty-images-v-stability-ai.mdx`
  - `content\\posts\\caso-eeoc-v-itutorgroup.mdx`
  - `content\\posts\\justicia-inteligente-en-china.mdx`
  - `content\\posts\\sentencia-t-323-colombia-doctrinal-final.mdx`
  - `content\\posts\\sentencia-t-323-colombia-resumen-final.mdx`
  - `content\\posts\\jurisprudencia-ia-voice-cloning-lgberlin.mdx`
- Otros contenidos temáticos variados (legal tech, ética IA, glosario/recursos, etc.), que solo pueden identificarse por el nombre de fichero, NO por frontmatter.

---

## 2. Estructura de clusters y asignación a archivos MDX

### 2.1. Limitación crítica: no es posible leer frontmatter ni campos `cluster`/`category`

Aunque el proyecto define conceptualmente los clusters:

- `ai-act`
- `jurisprudencia`
- `ia-proteccion-datos`
- `ia-agentica`
- `legal-tech`
- `etica-ia`
- `firma-scarpa`
- `guia`
- `recursos`

para esta iteración **no ha sido posible leer el contenido interno** de los archivos `.mdx`. En concreto:

- Los comandos utilizados para leer líneas (`Get-Content -TotalCount 40 <ruta>`) no devolvieron salida alguna en el entorno disponible, a pesar de completar la ejecución.
- Por ello, **no se puede observar de forma directa y verificable** ningún campo de frontmatter como `cluster`, `category`, `tags`, etc., ni comprobar la existencia de esos campos en uno o varios archivos concretos.

En consecuencia, y siguiendo el requisito de **no hacer inferencias no verificadas**:

- No se puede documentar de forma fehaciente cómo se asignan los clusters a los archivos mediante frontmatter.
- No se puede afirmar que exista un campo `cluster`, `category` o similar en los MDX, ni qué valores exactos toma.
- Cualquier correspondencia entre un archivo concreto y un cluster específico basada solo en el nombre del archivo o en la descripción conceptual del proyecto sería inferida y, por tanto, se omite.

### 2.2. Observaciones estructurales (sin inferencias sobre frontmatter)

A partir de los nombres de fichero y de la organización en directorios, SÍ se puede afirmar lo siguiente (a nivel puramente estructural):

- Todos los artículos y contenidos MDX localizados están bajo `content` o `content\\posts`.
- No existen subcarpetas adicionales dentro de `content` o `content\\posts` que se hayan detectado en el listado plano generado por `dir /s /b`. Es decir, todos los archivos `.mdx` de `posts` están directamente bajo `content\\posts` (no en subdirectorios adicionales identificables en el listado devuelto).
- La asignación de clusters (como `/ai-act`, `/jurisprudencia`, etc.) **no parece estar codificada en la ruta de fichero** (no hay subcarpetas `ai-act`, `jurisprudencia`, etc. dentro de `content` o `content\\posts` en lo observado).

Dado que el enrutado de Next.js puede estar definido mediante lógica de aplicación (por ejemplo, mapeando slugs o campos de frontmatter a rutas públicas), y **no se puede leer el frontmatter**, en este documento no se asocian archivos concretos a clusters concretos.

### 2.3. Imposibilidad de listar rutas públicas Next.js por artículo

Las rutas públicas (`/ai-act/...`, `/jurisprudencia/...`, etc.) suelen derivarse de alguna combinación de:

- ruta de fichero
- `slug` en el frontmatter
- lógica de routing en el código fuente (que no se ha inspeccionado en esta iteración)

Sin poder leer frontmatter ni el código de routing, **no es posible** establecer de manera verificable:

- la ruta pública de cada archivo, ni
- qué cluster corresponde a cada ruta.

De nuevo, para evitar suposiciones, este documento **no incluye** una tabla de correspondencia artículo → ruta pública Next.js.

---

## 3. Formato de frontmatter típico de los `.mdx`

### 3.1. Limitación: frontmatter no accesible en esta iteración

Por las razones expuestas en la sección 2.1, **no ha sido posible leer ni un solo bloque de frontmatter real** de los archivos `.mdx` del proyecto en esta ejecución:

- Los comandos dirigidos a leer las primeras líneas de archivos representativos como:
  - `content\\posts\\eu-ai-act-doctrinal-v3.mdx`
  - `content\\TSB1714-doctrinal.mdx`
  devolvieron ejecución correcta pero sin salida visible.

Sin poder ver la cabecera YAML/JSON (usualmente delimitada por `---` en MDX), **no se puede afirmar con certeza**:

- qué campos aparecen de forma consistente;
- qué campos son obligatorios u opcionales;
- si existen campos específicos como `cluster`, `category`, `tags`, `summary`, `seoTitle`, etc.

Cualquier intento de proponer un "formato típico" de frontmatter basándose en la práctica habitual de otros proyectos Next.js/MDX sería una inferencia externa y, por tanto, **no se incluye**.

### 3.2. Imposibilidad de incluir ejemplos reales de frontmatter

El requisito pedía expresamente:

> "Esta vez es obligatorio leer el contenido real de varios archivos `.mdx` representativos (de distintos clusters) y extraer fielmente los campos de frontmatter que se usan de verdad. [...] Incluir uno o dos ejemplos reales (anonimizando lo mínimo posible) de frontmatter copiados del proyecto, y luego un ejemplo “plantilla” comentado basado en esos ejemplos reales."

Debido a que **no se ha podido leer ni una sola línea de los archivos** en el entorno actual, esto **no se puede cumplir** sin violar la prohibición de inferencias no verificadas. Por tanto:

- No se incluye ningún ejemplo de frontmatter "real" copiado del proyecto.
- No se incluye ninguna plantilla comentada de frontmatter, ya que solo podría basarse en suposiciones.

En cambio, se deja constancia explícita de esta limitación para que, en una iteración posterior con acceso completo a los archivos (por ejemplo, ejecutando localmente en el entorno del proyecto con `Get-Content` o editores de texto), se pueda completar esta sección con datos reales.

---

## 4. Síntesis y acciones recomendadas para una próxima iteración

A pesar de las limitaciones de lectura de contenido, se han podido determinar con certeza los siguientes puntos:

1. **Directorios con `.mdx`**:
   - `content`
   - `content\\posts`
2. **Volumen de contenido**: existe un número muy elevado de archivos MDX bajo `content\\posts`, incluyendo:
   - Noticias y comunicaciones cronológicas de AEPD y otras instituciones (2016–2026).
   - Artículos doctrinales y versiones SEO sobre IA, protección de datos, legal tech, jurisprudencia y ética.
   - Guías prácticas y análisis de normativa europea y comparada (AI Act, RGPD, deepfakes, etc.).
3. **Clusters conceptuales** definidos en el encargo (no observados en el código):
   - `ai-act`, `jurisprudencia`, `ia-proteccion-datos`, `ia-agentica`, `legal-tech`, `etica-ia`, `firma-scarpa`, `guia`, `recursos`.

Para poder completar el análisis con el nivel de detalle solicitado originalmente (mapeo de clusters, campos de frontmatter, rutas públicas), será necesario:

1. Ejecutar el análisis **directamente en el entorno del proyecto** (por ejemplo, una PowerShell o terminal con acceso sin restricciones a `Get-Content` y al árbol de ficheros).
2. Implementar un script (Node.js o Python) que:
   - lea todos los archivos `.mdx` y parse el frontmatter;
   - extraiga y consolide los campos presentes (`title`, `date`, `cluster`, etc.);
   - relacione cada archivo con su cluster, ya sea por campo de frontmatter o por lógica de routing en el código.
3. Con esa información, generar una versión ampliada de este documento que sí pueda incluir:
   - ejemplos reales de frontmatter;
   - plantilla comentada basada en esos ejemplos;
   - listados por cluster con rutas de archivo y rutas públicas Next.js.

Mientras tanto, este documento deja un registro transparente de lo que **sí** se ha podido observar directamente (rutas de archivos y directorios con `.mdx`) y de lo que **no** se ha podido verificar sin incurrir en suposiciones.
