import type { Metadata } from "next";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = SEOHead({
  title: "Aviso Legal",
  description: "Aviso legal del proyecto editorial independiente Derecho Artificial. Titularidad, condiciones de uso, propiedad intelectual y exención de responsabilidad.",
  canonical: "/aviso-legal",
  ogType: "website"
});

export default function AvisoLegalPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { label: "Inicio", href: "/" },
          { label: "Aviso Legal", href: "/aviso-legal" }
        ]}
      />
      <main>
      <section className="py-16 md:py-24">
        <div className="container-narrow">
          <p className="text-xs uppercase tracking-[0.2em] text-caption mb-6">Información legal</p>
          <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl font-medium text-foreground mb-8 leading-tight">
            Aviso Legal
          </h1>
          <p className="text-body-large text-muted-foreground">Última actualización: enero de 2025</p>
        </div>
      </section>

      <section className="py-12 border-t border-divider">
        <div className="container-narrow">
          <div className="prose-editorial space-y-12">
            <div>
              <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">1. Identificación del responsable</h2>
              <p>
                En cumplimiento de lo establecido en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
                Información y de Comercio Electrónico (LSSI-CE), y del Reglamento (UE) 2016/679, General de Protección
                de Datos (RGPD), se facilita la siguiente información:
              </p>
              <ul className="list-none space-y-3 mt-4 pl-0">
                <li>
                  <strong>Denominación del proyecto:</strong> Derecho Artificial
                </li>
                <li>
                  <strong>Naturaleza:</strong> Proyecto editorial independiente, sin personalidad jurídica propia ni
                  finalidad comercial
                </li>
                <li>
                  <strong>Objeto:</strong> Divulgación y análisis jurídico, ético y regulatorio de la inteligencia
                  artificial desde una perspectiva europea
                </li>
                <li>
                  <strong>Finalidad:</strong> Editorial, no comercial. El proyecto no realiza actividades comerciales,
                  no vende productos o servicios, ni genera ingresos publicitarios
                </li>
                <li>
                  <strong>Ámbito territorial:</strong> España y Unión Europea
                </li>
                <li>
                  <strong>Contacto:</strong> A través del formulario disponible en la sección de contacto del sitio web
                  o mediante correo electrónico
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">2. Condiciones de uso</h2>
              <p>
                El acceso al sitio web Derecho Artificial es libre y gratuito. Su uso atribuye la condición de usuario,
                quien acepta las siguientes condiciones:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Utilizar los contenidos con fines exclusivamente informativos, educativos o de investigación.</li>
                <li>No emplear los contenidos con fines ilícitos o contrarios al ordenamiento jurídico vigente.</li>
                <li>No reproducir, distribuir o modificar los contenidos sin autorización expresa del titular.</li>
                <li>
                  No realizar acciones que puedan dañar, inutilizar o sobrecargar el funcionamiento del sitio web.
                </li>
              </ul>
              <p className="mt-4">
                El titular se reserva el derecho de modificar estas condiciones en cualquier momento, siendo efectivas
                desde su publicación en el sitio web.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">3. Propiedad intelectual</h2>
              <p>
                Todos los contenidos del sitio web, incluyendo textos, análisis, estructura, diseño gráfico y código
                fuente, están protegidos por las normas de propiedad intelectual e industrial aplicables.
              </p>
              <p>
                La titularidad de los derechos de explotación corresponde al responsable del proyecto Derecho
                Artificial, salvo indicación expresa en contrario.
              </p>
              <p>
                Queda prohibida la reproducción, distribución, comunicación pública o transformación, total o parcial,
                de los contenidos sin autorización expresa y por escrito del titular.
              </p>
              <p>
                El acceso al sitio web no implica, en ningún caso, cesión, renuncia o transmisión de derechos de
                propiedad intelectual o industrial.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">4. Exclusión de responsabilidad</h2>
              <p>Los contenidos publicados en Derecho Artificial tienen carácter exclusivamente informativo, divulgativo y editorial.</p>
              <p className="font-medium text-foreground mt-4">
                En ningún caso constituyen asesoramiento jurídico profesional, consultoría legal ni recomendación de
                productos o servicios.
              </p>
              <p className="mt-4">El responsable del proyecto no se responsabiliza de:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Las decisiones adoptadas por los usuarios a partir de la información contenida en el sitio web.</li>
                <li>
                  El uso que terceros puedan hacer de los contenidos publicados, incluyendo su reproducción,
                  modificación o interpretación.
                </li>
                <li>
                  La exactitud, actualidad o integridad de la información en todo momento, dado el carácter dinámico
                  del marco normativo analizado y la evolución constante de la regulación europea.
                </li>
                <li>
                  Los contenidos, políticas de privacidad o prácticas de los sitios web de terceros enlazados, cuya
                  inclusión tiene finalidad exclusivamente informativa y no implica respaldo ni relación alguna con
                  dichos sitios.
                </li>
                <li>
                  Los daños o perjuicios derivados del uso o imposibilidad de uso del sitio web, incluyendo
                  interrupciones técnicas o errores en el acceso.
                </li>
              </ul>
              <p className="mt-4">
                Para cuestiones jurídicas concretas, se recomienda consultar con profesionales cualificados. El
                contenido de este sitio web no sustituye el asesoramiento jurídico personalizado.
              </p>
            </div>

            <div>
              <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">5. Legislación aplicable y jurisdicción</h2>
              <p>Las presentes condiciones se rigen por la legislación española y la normativa de la Unión Europea que resulte de aplicación.</p>
              <p>
                Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las
                partes se someten a la jurisdicción de los juzgados y tribunales españoles competentes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

