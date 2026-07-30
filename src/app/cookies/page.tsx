import type { Metadata } from "next";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = SEOHead({
  title: "Cookies",
  description: "Política de cookies de Derecho Artificial. Uso exclusivo de cookies técnicas y de seguridad necesarias para el funcionamiento. Sin cookies de seguimiento ni publicidad.",
  canonical: "/cookies",
  ogType: "website"
});

export default function CookiesPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { label: "Inicio", href: "/" },
          { label: "Cookies", href: "/cookies" }
        ]}
      />
      <main>
      <article>
        <header className="py-16 md:py-24">
          <div className="container-narrow">
            <p className="text-xs uppercase tracking-[0.2em] text-caption mb-6">Información técnica</p>
            <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl font-medium text-foreground mb-8 leading-tight">
              Política de Cookies
            </h1>
            <p className="text-body-large text-muted-foreground">Última actualización: enero de 2025</p>
          </div>
        </header>

        <section className="py-12 border-t border-divider">
          <div className="container-narrow">
            <div className="prose-editorial space-y-12">
              <div>
                <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">1. Qué son las cookies</h2>
                <p>
                  Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario
                  (ordenador, teléfono móvil, tableta) cuando este accede a ellos.
                </p>
                <p>
                  Estos archivos permiten que el sitio web recuerde información sobre la visita del usuario, como sus
                  preferencias de idioma, configuración de visualización u otros datos técnicos, facilitando así la
                  navegación y mejorando la experiencia de uso.
                </p>
                <p>
                  Las cookies pueden ser instaladas por el propio sitio web visitado (cookies propias) o por terceros
                  que prestan servicios al sitio (cookies de terceros).
                </p>
              </div>

              <div>
                <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">2. Cookies utilizadas en este sitio web</h2>
                <p>
                  El sitio web Derecho Artificial utiliza exclusivamente cookies técnicas estrictamente necesarias para
                  su correcto funcionamiento. En particular:
                </p>
                <ul className="list-disc list-inside space-y-3 mt-4">
                  <li>
                    <strong>Cookies de sesión:</strong> permiten mantener la navegación del usuario durante su visita al
                    sitio. Se eliminan automáticamente al cerrar el navegador.
                  </li>
                  <li>
                    <strong>Cookies técnicas de seguridad:</strong> contribuyen a la protección del sitio web frente a
                    accesos no autorizados o usos indebidos.
                  </li>
                  <li>
                    <strong>Cookies de preferencias técnicas:</strong> almacenan configuraciones básicas del usuario, como
                    el idioma seleccionado o el modo de visualización.
                  </li>
                </ul>
                <p className="mt-4">
                  Estas cookies son imprescindibles para el funcionamiento del sitio y no requieren el consentimiento
                  previo del usuario conforme al artículo 22.2 de la Ley 34/2002 (LSSI-CE).
                </p>
              </div>

              <div>
                <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">3. Cookies que no se utilizan</h2>
                <p>
                  El sitio web Derecho Artificial <strong>no utiliza</strong> los siguientes tipos de cookies:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>
                    <strong>Cookies publicitarias:</strong> no se muestran anuncios ni se utilizan cookies para fines de
                    publicidad.
                  </li>
                  <li>
                    <strong>Cookies de seguimiento comercial:</strong> no se realiza seguimiento del comportamiento del
                    usuario con fines de marketing.
                  </li>
                  <li>
                    <strong>Cookies de perfilado:</strong> no se elaboran perfiles de usuario basados en su navegación.
                  </li>
                  <li>
                    <strong>Cookies de redes sociales:</strong> no se integran botones de redes sociales que instalen
                    cookies de seguimiento.
                  </li>
                  <li>
                    <strong>Cookies analíticas de terceros con fines comerciales:</strong> no se utilizan herramientas de
                    análisis que compartan datos con terceros para fines publicitarios.
                  </li>
                </ul>
                <p className="mt-4">
                  El compromiso del proyecto es mantener un uso mínimo y proporcional de las cookies, limitado a lo
                  estrictamente necesario para el funcionamiento técnico del sitio.
                </p>
              </div>

              <div>
                <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">4. Gestión de cookies por el usuario</h2>
                <p>
                  El usuario puede configurar su navegador para aceptar, rechazar o eliminar las cookies. A continuación
                  se proporcionan enlaces a las instrucciones de los navegadores más utilizados:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>
                    <strong>Google Chrome:</strong>{" "}
                    <a
                      href="https://support.google.com/chrome/answer/95647?hl=es&co=GENIE.Platform%3DDesktop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Configuración de cookies en Chrome
                    </a>
                  </li>
                  <li>
                    <strong>Mozilla Firefox:</strong>{" "}
                    <a
                      href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Configuración de cookies en Firefox
                    </a>
                  </li>
                  <li>
                    <strong>Safari:</strong>{" "}
                    <a
                      href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Configuración de cookies en Safari
                    </a>
                  </li>
                  <li>
                    <strong>Microsoft Edge:</strong>{" "}
                    <a
                      href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Configuración de cookies en Edge
                    </a>
                  </li>
                </ul>
                <p className="mt-4">
                  Si el usuario desactiva las cookies técnicas, es posible que algunas funcionalidades del sitio web no
                  funcionen correctamente o que la experiencia de navegación se vea afectada.
                </p>
              </div>

              <div>
                <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">5. Actualización de esta política</h2>
                <p>
                  Esta Política de Cookies podrá ser modificada para adaptarla a cambios normativos, técnicos o
                  funcionales del sitio web.
                </p>
                <p>
                  Cualquier modificación será publicada en esta página con indicación de la fecha de última
                  actualización. Se recomienda a los usuarios revisar periódicamente esta política.
                </p>
              </div>

              <div>
                <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">6. Más información</h2>
                <p>
                  Para cualquier consulta relacionada con el uso de cookies en este sitio web, el usuario puede ponerse
                  en contacto a través del formulario disponible en la sección de contacto.
                </p>
                <p>
                  Para obtener más información sobre cookies y sus derechos como usuario, puede consultar la página web
                  de la{" "}
                  <a
                    href="https://www.aepd.es/es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Agencia Española de Protección de Datos (AEPD)
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
    </>
  );
}
