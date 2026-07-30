"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm({ locale = "es" }: { locale?: "es" | "en" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successParam = locale === "es" ? "enviado" : "sent";
  const hasSuccess = useMemo(() => searchParams.get(successParam) === "1", [searchParams, successParam]);

  const t =
    locale === "es"
      ? {
          success:
            "Gracias por tu mensaje. Hemos recibido correctamente tu consulta y responderemos en los próximos días hábiles.",
          error: "No se ha podido enviar el mensaje. Inténtalo de nuevo.",
          nameLabel: "Nombre",
          namePlaceholder: "Su nombre",
          emailLabel: "Correo electrónico",
          emailPlaceholder: "correo@ejemplo.com",
          subjectLabel: "Asunto",
          subjectPlaceholder: "Motivo de su mensaje",
          messageLabel: "Mensaje",
          messagePlaceholder: "Escriba su mensaje aquí...",
          submitIdle: "Enviar mensaje",
          submitBusy: "Enviando...",
          consent:
            "Al enviar este formulario, aceptas que Derecho Artificial trate tus datos para responder a tu consulta.",
          validation: {
            nameRequired: "El nombre es obligatorio.",
            emailRequired: "El correo electrónico es obligatorio.",
            emailInvalid: "El correo electrónico no es válido.",
            subjectRequired: "El asunto es obligatorio.",
            messageRequired: "El mensaje es obligatorio.",
          },
          successRedirect: "/contacto?enviado=1",
        }
      : {
          success:
            "Thank you for your message. We have received your inquiry and will respond within the next few business days.",
          error: "Message could not be sent. Please try again.",
          nameLabel: "Name",
          namePlaceholder: "Your name",
          emailLabel: "Email",
          emailPlaceholder: "email@example.com",
          subjectLabel: "Subject",
          subjectPlaceholder: "Reason for your message",
          messageLabel: "Message",
          messagePlaceholder: "Write your message here...",
          submitIdle: "Send message",
          submitBusy: "Sending...",
          consent:
            "By sending this form, you agree that Derecho Artificial may process your data to respond to your inquiry.",
          validation: {
            nameRequired: "Name is required.",
            emailRequired: "Email is required.",
            emailInvalid: "Email is not valid.",
            subjectRequired: "Subject is required.",
            messageRequired: "Message is required.",
          },
          successRedirect: "/en/contact?sent=1",
        };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const validate = () => {
    if (!values.name.trim()) return t.validation.nameRequired;
    if (!values.email.trim()) return t.validation.emailRequired;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      return t.validation.emailInvalid;
    }
    if (!values.subject.trim()) return t.validation.subjectRequired;
    if (!values.message.trim()) return t.validation.messageRequired;
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("https://formspree.io/f/mbdoyvje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setSubmitError(t.error);
        return;
      }

      router.replace(t.successRedirect);
    } catch {
      setSubmitError(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {hasSuccess && (
        <div className="mb-8 rounded-md bg-green-50 px-4 py-3 border border-green-200">
          <p className="text-sm text-green-800">{t.success}</p>
        </div>
      )}
      {submitError && (
        <div className="mb-8 rounded-md bg-red-50 px-4 py-3 border border-red-200">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              {t.nameLabel}
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className="bg-background border border-[#e5e7eb] focus:border-[#1a1a1a] focus:ring-0 focus:outline-none"
              placeholder={t.namePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              {t.emailLabel}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className="bg-background border border-[#e5e7eb] focus:border-[#1a1a1a] focus:ring-0 focus:outline-none"
              placeholder={t.emailPlaceholder}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium text-foreground">
            {t.subjectLabel}
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            required
            value={values.subject}
            onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
            className="bg-background border border-[#e5e7eb] focus:border-[#1a1a1a] focus:ring-0 focus:outline-none"
            placeholder={t.subjectPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-foreground">
            {t.messageLabel}
          </Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={8}
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            className="bg-background border border-[#e5e7eb] focus:border-[#1a1a1a] focus:ring-0 focus:outline-none resize-none"
            placeholder={t.messagePlaceholder}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? t.submitBusy : t.submitIdle}
        </Button>
        <p className="text-xs text-caption mt-4">
          {t.consent}
        </p>
      </form>
    </>
  );
}
