import { Notebook, MessageCircle, Route } from "lucide-react";
import { SafeImage } from "@/components/shared/safe-image";
import { RevealStagger, RevealItem } from "@/components/shared/section-reveal";
import { cn } from "@/lib/utils";
import type { ServiceCard } from "@/types";

interface AboutServicesGridProps {
  services: ServiceCard[];
}

const iconByVariant: Record<string, React.ReactNode> = {
  accent: <Notebook className="w-5 h-5" strokeWidth={2.5} />,
  dark: <MessageCircle className="w-5 h-5" strokeWidth={2.5} />,
  light: <Route className="w-5 h-5" strokeWidth={2.5} />,
};

function ServiceItem({ service }: { service: ServiceCard }) {
  if (service.variant === "image") {
    return (
      <div className="relative aspect-square rounded-2xl lg:rounded-3xl overflow-hidden bg-stone-200 group">
        <SafeImage
          src={service.image ?? null}
          alt={service.title || "Our work"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    );
  }

  const isAccent = service.variant === "accent";
  const isDark = service.variant === "dark";
  const isLight = service.variant === "light";

  return (
    <div
      className={cn(
        "aspect-square rounded-2xl lg:rounded-3xl p-7 lg:p-8 flex flex-col transition-shadow duration-300 hover:shadow-xl",
        isAccent && "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/15",
        isDark && "bg-[#1f2328] text-white shadow-lg shadow-black/15",
        isLight && "bg-stone-100 text-foreground hover:bg-stone-50"
      )}
    >
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center mb-auto",
          isAccent && "bg-white/15 text-white",
          isDark && "bg-white/10 text-white",
          isLight && "bg-white text-red-500"
        )}
      >
        {iconByVariant[service.variant]}
      </div>

      <div className="mt-auto">
        <h3
          className={cn(
            "font-display text-xl lg:text-2xl font-bold tracking-tight mb-5",
            isLight ? "text-foreground" : "text-white"
          )}
        >
          {service.title}
        </h3>
        {service.items && (
          <ul className="space-y-2.5">
            {service.items.map((item) => (
              <li
                key={item}
                className={cn(
                  "flex items-start gap-2 text-[13px] leading-relaxed",
                  isLight ? "text-foreground/80" : "text-white/85"
                )}
              >
                <span
                  className={cn(
                    "mt-1.5 w-1 h-1 rounded-full flex-shrink-0",
                    isLight ? "bg-red-500" : "bg-white"
                  )}
                />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function AboutServicesGrid({ services }: AboutServicesGridProps) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6" stagger={0.07}>
        {services.map((service) => (
          <RevealItem key={service.id}>
            <ServiceItem service={service} />
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
