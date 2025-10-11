import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import InquiryModal from "@/components/InquiryModal";
import { ToastProvider } from "@/components/ui/toast";

const defaultSiteUrl = "https://xn--b1abde2bts0e.xn--p1ai";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Гундырев — партнер Dr.Web",
  title: {
    default: "Dr.Web Антивирус — Гундырев.рф | Надежная защита",
    template: "%s | Dr.Web — Гундырев.рф",
  },
  description:
    "Dr.Web — российский антивирус с 30-летним стажем. Централизованная защита сетей, серверов и рабочих станций. Быстрая реакция на угрозы. Купить лицензию с доставкой.",
  keywords:
    [
      "Dr.Web",
      "антивирус",
      "защита от вирусов",
      "корпоративная безопасность",
      "лицензия антивируса",
      "российский антивирус",
      "ФСТЭК",
      "ФСБ",
      "импортозамещение",
      "доктор веб для госучреждений",
      "доктор веб для школы",
      "антивирус для школы",
      "антивирус для предприятий",
      "антивирус для малого бизнеса",
      "Dr.Web для образовательных учреждений",
      "Dr.Web для государственных учреждений",
      "антивирус для госорганов",
    ],
  authors: [{ name: "Гундырев Максим Алексеевич", url: siteUrl }],
  creator: "Гундырев Максим Алексеевич",
  publisher: "Гундырев.рф",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxVideoPreview: -1,
      maxImagePreview: "large",
      maxSnippet: -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/",
      "x-default": "/",
    },
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Dr.Web Антивирус — Гундырев.рф",
    description:
      "Надежная защита от вирусов и киберугроз. Dr.Web — российский антивирус с 30-летним стажем.",
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Гундырев — партнер Dr.Web",
    localeAlternate: ["ru_RU"],
    images: [
      {
        url: `${siteUrl}/opengraph-image.png`,
        secureUrl: `${siteUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Dr.Web — партнер Гундырев",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr.Web Антивирус — Гундырев.рф",
    description:
      "Российский антивирус с 30-летним опытом. Централизованная защита и быстрая реакция на угрозы.",
    images: [`${siteUrl}/opengraph-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`antialiased`}>
        {/* Jivo Chat */}
        <Script src="//code.jivo.ru/widget/N3LCdNFl5u" strategy="beforeInteractive" />
        {/* Organization + WebSite JSON-LD */}
        <Script id="ld-json-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${siteUrl}#organization`,
                name: "Гундырев — партнер Dr.Web",
                url: siteUrl,
                logo: `${siteUrl}/logo-drweb.svg`,
                sameAs: [
                  "https://www.drweb.ru/",
                  "https://www.drweb.ru/business/",
                  "https://t.me/drweb",
                ],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+7-993-077-0168",
                    contactType: "sales",
                    areaServed: "RU",
                    availableLanguage: ["Russian"],
                  },
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${siteUrl}#website`,
                url: siteUrl,
                name: "Гундырев — партнер Dr.Web",
                description:
                  "Официальный партнер Dr.Web по продаже и внедрению корпоративных антивирусных решений в России.",
                inLanguage: "ru-RU",
                publisher: {
                  "@id": `${siteUrl}#organization`,
                },
              },
              {
                "@type": "Service",
                "@id": `${siteUrl}#service`,
                name: "Внедрение и сопровождение антивирусных решений Dr.Web",
                serviceType: "Корпоративная кибербезопасность",
                provider: {
                  "@id": `${siteUrl}#organization`,
                },
                areaServed: {
                  "@type": "Country",
                  name: "Россия",
                },
                audience: {
                  "@type": "Organization",
                  name: "Госучреждения и бизнес",
                },
                availableChannel: {
                  "@type": "ServiceChannel",
                  serviceUrl: `${siteUrl}#contacts`,
                  servicePhone: "+7-993-077-0168",
                },
              },
            ],
          })}
        </Script>
        {/* Yandex.Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103917430', 'ym');

          ym(103917430, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: 'dataLayer', accurateTrackBounce: true, trackLinks: true });
          `}
        </Script>
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/103917430" style={{ position: "absolute", left: -9999 }} alt="" />
          </div>
        </noscript>
        <ToastProvider>
          {children}
          {/* Delayed inquiry modal */}
          <InquiryModal />
        </ToastProvider>
      </body>
    </html>
  );
}
