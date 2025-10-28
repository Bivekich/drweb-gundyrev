"use client";

import {
  ArrowRight,
  Briefcase,
  Award,
  Building,
  CheckCircle,
  Clock,
  Code,
  Cpu,
  GraduationCap,
  Fingerprint,
  Headphones,
  Lock,
  Mail,
  Menu,
  Monitor,
  Phone,
  Rocket,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
// Swiper (carousel)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from "next/image";
import Script from "next/script";
import { useToast } from "@/components/ui/toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import B2BBanner from "@/components/B2BBanner";

const faqItems = [
  {
    question: "Сколько времени занимает подбор лицензий и подготовка коммерческого предложения?",
    answer:
      "Обычно от 1 до 2 рабочих часов. Мы оперативно уточняем количество защищаемых узлов и готовим предложение, соответствующее требованиям 44-ФЗ и 223-ФЗ.",
  },
  {
    question: "Предоставляете ли вы тестовый период Dr.Web перед покупкой лицензий?",
    answer:
      "Да, по запросу оформляем тестовые ключи на 14 дней. Помогаем настроить пилот, чтобы вы оценили защиту на своей инфраструктуре.",
  },
  {
    question: "Какие форматы сопровождения доступны после внедрения?",
    answer:
      "Доступны удаленное сопровождение, консультации по обновлениям и помощь с интеграцией Dr.Web Security Space, Enterprise Security Suite и других продуктов.",
  },
  {
    question: "Работаете ли вы с государственными и образовательными учреждениями?",
    answer:
      "Да, мы сопровождаем госучреждения, школы и коммерческие организации. Предоставляем закрывающие документы и помогаем пройти проверки по требованиям ФСТЭК и ФСБ.",
  },
] as const;

export default function DrWebLanding() {
  

  type ContactForm = {
    name: string;
    phone: string;
    email: string;
    company: string;
    position: string;
    orgType: "corporate" | "government" | "non-profit";
    desktopDevices: string;
    serverDevices: string;
    mobileDevices: string;
    message: string;
  };

  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    phone: "",
    email: "",
    company: "",
    position: "",
    orgType: "corporate",
    desktopDevices: "",
    serverDevices: "",
    mobileDevices: "",
    message: "",
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const { toast } = useToast();

  // Analytics helpers
  const reachGoal = (name: string, params?: Record<string, unknown>) => {
    try {
      // @ts-expect-error: Yandex.Metrica is injected globally at runtime
      if (typeof window !== "undefined" && window.ym) {
        // @ts-expect-error: Yandex.Metrica is injected globally at runtime
        window.ym(103917430, "reachGoal", name, params);
      }
    } catch {}
  };

  // Phone mask + helpers
  const formatRuPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let d = digits;
    if (d.startsWith("8")) d = "7" + d.slice(1);
    if (!d.startsWith("7")) d = "7" + d;
    d = d.slice(0, 11);
    const parts = [
      "+7",
      d.slice(1, 4),
      d.slice(4, 7),
      d.slice(7, 9),
      d.slice(9, 11),
    ];
    let out = parts[0];
    if (parts[1]) out += ` ${parts[1]}`;
    if (parts[2]) out += ` ${parts[2]}`;
    if (parts[3]) out += `-${parts[3]}`;
    if (parts[4]) out += `-${parts[4]}`;
    return out;
  };

  const sanitizePhone = (value: string) => value.replace(/\D/g, "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  type ValidatorMap = { [K in keyof ContactForm]: (v: ContactForm[K]) => string };

  const validators: ValidatorMap = useMemo(() => ({
    name: (v) => (String(v).trim().length >= 2 ? "" : "Введите имя (мин. 2 символа)"),
    phone: (v) => (sanitizePhone(String(v)).length === 11 ? "" : "Введите телефон в формате +7 XXX XXX-XX-XX"),
    email: (v) =>
      !v
        ? ""
        : /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(String(v))
        ? ""
        : "Некорректный email",
    desktopDevices: (v) => (!v || Number(v) >= 0 ? "" : "Некорректное число"),
    serverDevices: (v) => (!v || Number(v) >= 0 ? "" : "Некорректное число"),
    mobileDevices: (v) => (!v || Number(v) >= 0 ? "" : "Некорректное число"),
    // No-op validators for optional fields
    company: () => "",
    position: () => "",
    orgType: () => "",
    message: () => "",
  }), []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const check = <K extends keyof ContactForm>(k: K) => {
      const v = contactForm[k];
      const fn = validators[k] as ((val: ContactForm[K]) => string) | undefined;
      if (fn) {
        const msg = fn(v);
        if (msg) newErrors[k as string] = msg;
      }
    };
    check("name");
    check("phone");
    check("email");
    check("desktopDevices");
    check("serverDevices");
    check("mobileDevices");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Swiper handles carousel state

  

  const testimonials = [
    {
      name: "Александр Иванов",
      company:
        "МЕЖРЕГИОНАЛЬНОЕ УПРАВЛЕНИЕ РОСПОТРЕБНАДЗОРА ПО РЕСПУБЛИКЕ КРЫМ И ГОРОДУ СЕВАСТОПОЛЮ",
      text: "Dr.Web обеспечивает надежную защиту нашей IT-инфраструктуры. Российская разработка — это гарантия безопасности и независимости.",
      rating: 5,
    },
    {
      name: "Елена Петрова",
      company: 'МКУ "ХОЗУПРАВЛЕНИЕ"',
      text: "Переход на Dr.Web позволил сэкономить 35% бюджета на антивирусную защиту при повышении уровня безопасности.",
      rating: 5,
    },
    {
      name: "Дмитрий Сидоров",
      company: 'СПБ ГБУЗ "ГОРОДСКАЯ ПОЛИКЛИНИКА № 93"',
      text: "Централизованное управление упростило администрирование 15,000 рабочих мест. Отличная техподдержка.",
      rating: 5,
    },
    {
      name: "Михаил Козлов",
      company: 'ООО "ТЕХНОСФЕРА ПЛЮС"',
      text: "Гундырев М.А. - надежный партнер Dr.Web! Профессиональная консультация, быстрое внедрение и отличная поддержка. Рекомендуем как проверенного поставщика.",
      rating: 5,
    },
    {
      name: "Анна Васильева",
      company: 'ЗАО "ИНФОРМ-БЕЗОПАСНОСТЬ"',
      text: "Сотрудничаем с Гундырев.рф уже 2 года. Всегда выгодные цены, быстрая поставка лицензий Dr.Web и профессиональная техническая поддержка. Очень довольны!",
      rating: 5,
    },
    {
      name: "Сергей Николаев", 
      company: 'АО "ЦИФРОВЫЕ РЕШЕНИЯ УРАЛ"',
      text: "Гундырев Максим Алексеевич помог нам перейти на Dr.Web с минимальными затратами времени. Качественное сопровождение проекта и конкурентные цены.",
      rating: 5,
    }
  ];



  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Проверьте форму",
        description: "Заполните обязательные поля корректно",
        variant: "warning",
      });
      return;
    }
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name,
          contact: sanitizePhone(contactForm.phone) || contactForm.phone.trim(),
          message: contactForm.message,
          page: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      if (!res.ok) throw new Error("fail");
      // Analytics: lead success
      reachGoal("lead_success");
      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время",
        variant: "success",
      });
      setContactForm({
        name: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        orgType: "corporate",
        desktopDevices: "",
        serverDevices: "",
        mobileDevices: "",
        message: "",
      });
      setErrors({});
    } catch {
      reachGoal("lead_error");
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте позже или позвоните нам",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Image
                  src="/logo-drweb.svg"
                  alt="Dr.Web Logo"
                  width={187}
                  height={44}
                  className="h-10 w-auto sm:h-12 transition-transform duration-300 hover:scale-105"
                  priority
                />
                <span className="text-xl sm:text-2xl font-light text-black">
                  |
                </span>
                <a
                  href="https://гундырев.рф"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Image
                    src="/logo.svg"
                    alt="Логотип Гундырев"
                    width={180}
                    height={48}
                    className="h-10 w-auto sm:h-12 transition-transform duration-300 hover:scale-105 filter brightness-0"
                    priority
                  />
                </a>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <nav className="flex space-x-4 xl:space-x-6">
                <a
                  href="#solutions"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Решения
                </a>
                <a
                  href="#services-header"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Услуги
                </a>
                <a
                  href="#faq"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  FAQ
                </a>
                <a
                  href="#contacts"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Контакты
                </a>
              </nav>
              <Button
                className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-700 hover:via-green-800 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-smooth transform hover:-translate-y-1 hover:scale-102 text-sm xl:text-base"
                onClick={() => {
                  reachGoal("call_click", { place: "desktop_header" });
                  window.open("tel:+79930770168", "_self");
                }}
              >
                <Phone className="w-3 h-3 xl:w-4 xl:h-4 mr-1 xl:mr-2" />
                <span className="hidden xl:inline">+7 993 077-01-68</span>
                <span className="xl:hidden">Звонок</span>
              </Button>
            </div>

            {/* Tablet navigation */}
            <div className="hidden md:flex lg:hidden items-center space-x-4">
              <Button
                className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white shadow-lg text-sm"
                onClick={() => {
                  reachGoal("call_click", { place: "tablet_header" });
                  window.open("tel:+79930770168", "_self");
                }}
              >
                <Phone className="w-3 h-3 mr-1" />
                Звонок
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Mobile/Tablet Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 sm:py-6 border-t border-border animate-slide-down">
              <div className="space-y-3 sm:space-y-4">
                <a
                  href="#solutions"
                  className="block text-sm sm:text-base font-medium py-2 hover:text-primary transition-colors"
                >
                  Решения
                </a>
                <a
                  href="#services-header"
                  className="block text-sm sm:text-base font-medium py-2 hover:text-primary transition-colors"
                >
                  Услуги
                </a>
                <a
                  href="#faq"
                  className="block text-sm sm:text-base font-medium py-2 hover:text-primary transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="#contacts"
                  className="block text-sm sm:text-base font-medium py-2 hover:text-primary transition-colors"
                >
                  Контакты
                </a>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  onClick={() => {
                    reachGoal("call_click", { place: "mobile_menu" });
                    window.open("tel:+79930770168", "_self");
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +7 993 077-01-68
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* B2B/B2G Information Banner */}
      <div className="pt-16 sm:pt-18 lg:pt-20">
        <B2BBanner />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-green-50 via-background to-blue-50 overflow-hidden pt-20 sm:pt-24">
        {/* Animated Background (reverted to previous version) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-14 sm:py-16 md:py-20 lg:py-24 xl:py-28">
          <div className="max-w-6xl mx-auto text-center">
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6">
              Киберзащита для
              <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">госучреждений и бизнеса</span>
              </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Быстрее, легче и дешевле конкурентов. Всё по делу — за минуту вы поймёте, что нужно.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
                <Button
                  size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-700 hover:via-green-800 hover:to-emerald-700 text-white shadow-2xl hover:shadow-green-lg transition-all duration-400 ease-smooth transform hover:-translate-y-1 hover:scale-[1.02]"
                  onClick={() => {
                  reachGoal('consult_cta_click', { place: 'hero_primary' });
                  document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Headphones className="w-6 h-6 mr-3" />
                Бесплатная консультация
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                className="w-full sm:w-auto border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white shadow-xl transition-all duration-400 ease-smooth"
                  onClick={() => {
                  reachGoal('solution_cta_click', { place: 'hero_secondary' });
                  document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ShieldCheck className="w-6 h-6 mr-3" />
                Каталог решений
                </Button>
              </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {[
                { number: 'Соответствие', text: 'нормам кибербезопасности РФ', icon: ShieldCheck, color: 'from-green-500 to-emerald-600' },
                { number: '30+', text: 'лет на рынке', icon: Award, color: 'from-yellow-500 to-orange-500' },
                { number: '44/223‑ФЗ', text: 'поставка', icon: Building, color: 'from-blue-500 to-indigo-500' },
                { number: 'Партнёр', text: 'Dr.Web', icon: Star, color: 'from-purple-500 to-pink-500' },
              ].map((stat, idx) => (
                <Card key={idx} className="text-center border-0 bg-background/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    <div className="text-xl font-black text-foreground">{stat.number}</div>
                    <div className="text-xs text-muted-foreground">{stat.text}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* SEO Content Section (redesigned) */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">Антивирус Dr.Web для госучреждений и образования</h2>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-3xl mx-auto mb-10">Коротко и по делу: кому подходит, чем полезен и почему выбирают Dr.Web.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Госучреждения</CardTitle>
                <CardDescription className="text-sm">ФСТЭК/ФСБ, 44/223‑ФЗ, единый Центр управления</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Соответствие нормам кибербезопасности РФ</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Поставка по 44/223‑ФЗ</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Централизованная политика и отчётность</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Образование</CardTitle>
                <CardDescription className="text-sm">Комплекты для школ, колледжей и вузов</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Защита ПК учителей и серверов</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Простое развертывание и администрирование</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Льготные условия для ОУ</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-700"></div>
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Air‑gapped</CardTitle>
                <CardDescription className="text-sm">Работа в изолированных сетях</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Оффлайн‑обновления и управление</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Сертифицированные компоненты</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Лицензирование по узлам</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Малый бизнес</CardTitle>
                <CardDescription className="text-sm">Готовый комплект: станции + почта + управление</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Запуск за 3 дня</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Снижение ТСО за счёт UMC</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5"/> Русская поддержка 24/7</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section
        id="solutions"
        className="py-20 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20" data-animate id="solutions-header">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Выберите{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                идеальную защиту
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Коротко о ключевых продуктах. Никакой воды — только выгоды.
            </p>
          </div>

          {/* Swiper Carousel (all viewports) */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, A11y, FreeMode]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              freeMode={{ enabled: false }}
              loop
              spaceBetween={16}
              breakpoints={{
                0: { slidesPerView: 1.05, spaceBetween: 12 },
                480: { slidesPerView: 1.2, spaceBetween: 14 },
                640: { slidesPerView: 1.6, spaceBetween: 16 },
                768: { slidesPerView: 2.2, spaceBetween: 18 },
                1024: { slidesPerView: 3.2, spaceBetween: 20 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="!pb-10 solutions-swiper"
            >
            {[
              {
                icon: Building,
                title: "Комплект для школы",
                description:
                  "Защита компьютеров и серверов, фильтрация почты, простой контроль",
                features: ["ФСТЭК", "Центр управления"],
                price: "спец. цена",
                color: "from-green-500 to-emerald-600",
                popular: true,
                nodeType: "для образовательных учреждений",
              },
              {
                icon: Monitor,
                title: "Dr.Web Desktop Security Suite",
                description:
                  "Защита рабочих станций, в т.ч. виртуальных и терминальных клиентов",
                features: [
                  "ФСТЭК",
                  "Центр управления",
                ],
                price: "от 1900₽",
                color: "from-blue-500 to-blue-600",
                popular: false,
                nodeType: "за рабочую станцию",
              },
              {
                icon: Server,
                title: "Dr.Web Server Security Suite",
                description:
                  "Защита файловых и приложенческих серверов, в т.ч. виртуальных",
                features: [
                  "ФСТЭК",
                  "Центр управления",
                ],
                price: "от 4990₽",
                color: "from-purple-500 to-purple-600",
                popular: false,
                nodeType: "за сервер",
              },
              {
                icon: Building,
                title: "Комплект для малого бизнеса",
                description:
                  "Быстрый старт: рабочие станции + почта + управление",
                features: ["Экономия", "Простой запуск"],
                price: "спец. цена",
                color: "from-teal-500 to-cyan-600",
                popular: false,
                nodeType: "до 100 устройств",
              },
              {
                icon: Mail,
                title: "Dr.Web Mail Security Suite",
                description:
                  "Проверка почтового трафика (Unix, MS Exchange) + антиспам",
                features: [
                  "ФСТЭК",
                  "Антиспам",
                ],
                price: "от 7260₽",
                color: "from-orange-500 to-red-500",
                popular: false,
                nodeType: "за почтового пользователя",
              },
              {
                icon: Smartphone,
                title: "Dr.Web Mobile Security Suite",
                description:
                  "Защита Android и Аврора‑устройств с централизованным управлением",
                features: [
                  "ФСТЭК",
                  "Android/Аврора",
                ],
                price: "от 2500₽",
                color: "from-cyan-500 to-blue-600",
                popular: false,
                nodeType: "за мобильное устройство",
              },
            ].map((solution, index) => (
              <SwiperSlide key={index} className="!h-auto">
                
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-background/90 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${solution.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  ></div>

                  <CardHeader>
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <solution.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-3">
                      {solution.title}
                    </CardTitle>
                    <CardDescription>{solution.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {solution.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-foreground">
                        {solution.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {solution.nodeType}
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        reachGoal("solution_cta_click", { title: solution.title });
                        document
                          .getElementById("contacts")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Заказать консультацию
                    </Button>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
            </Swiper>
          </div>
        </div>
      </section>



      {/* Government & Corporate Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-background to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className="text-center mb-14"
            data-animate
            id="gov-benefits-header"
          >

            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Почему Dr.Web —{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                выгодный выбор
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Экономия бюджета, соответствие требованиям безопасности РФ,
              российская разработка
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-14">
            {[
              {
                icon: TrendingUp,
                title: "Экономия бюджета до 40%",
                description:
                  "Dr.Web дешевле зарубежных аналогов при превосходном качестве защиты",
                stats: "40%",
                statsLabel: "экономия vs конкуренты",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: ShieldCheck,
                title: "Российская разработка с сертификатами",
                description:
                  "Сертификаты ФСТЭК, ФСБ. В реестре российского ПО, соответствие 152-ФЗ",
                stats: "30+",
                statsLabel: "лет разработки",
                color: "from-blue-500 to-purple-600",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className={`group ${
                  visibleElements.has("gov-benefits-header")
                    ? "animate-slide-in-up"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-background/90 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardContent className="p-6 sm:p-7 md:p-8 relative z-10">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <benefit.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-foreground leading-tight">
                          {benefit.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl md:text-4xl font-black text-green-600 leading-none">
                          {benefit.stats}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {benefit.statsLabel}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Compliance Badges */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                Сертификаты и соответствие
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
                Dr.Web имеет все необходимые сертификаты для работы в госсекторе
                и защиты критически важной инфраструктуры
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {[
                {
                  name: "ФСТЭК России",
                  desc: "Сертификат по 2 уровню доверия",
                  icon: ShieldCheck,
                  color: "bg-blue-100 text-blue-800",
                },
                {
                  name: "ФСБ России",
                  desc: "Сертификат безопасности",
                  icon: Lock,
                  color: "bg-red-100 text-red-800",
                },
              ].map((cert, index) => (
                <Card
                  key={index}
                  className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 ${cert.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <cert.icon className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-foreground mb-2 text-lg">
                      {cert.name}
                    </h4>
                    <p className="text-sm font-semibold text-green-600">
                      {cert.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <strong>23 продукта</strong> в Едином реестре российского ПО • Соответствие <strong>152-ФЗ</strong> • Используется в <strong>ГАС «Выборы»</strong>
              </p>
            </div>
          </div>
        </div>
      </section>


      
      

      {/* Additional Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-background to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20" data-animate id="services-header">

            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Полный спектр{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                услуг поддержки
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              От предпродажного консультирования до экспертизы инцидентов — всё
              для вашей безопасности
            </p>
          </div>

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, A11y, FreeMode]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop
              spaceBetween={16}
              breakpoints={{
                0: { slidesPerView: 1.05, spaceBetween: 12 },
                480: { slidesPerView: 1.2, spaceBetween: 14 },
                640: { slidesPerView: 1.6, spaceBetween: 16 },
                768: { slidesPerView: 2.2, spaceBetween: 18 },
                1024: { slidesPerView: 3.2, spaceBetween: 20 },
                1280: { slidesPerView: 3.5, spaceBetween: 24 },
              }}
              className="!pb-10 services-swiper"
            >
            {[
              {
                icon: Cpu,
                title: "Dr.Web vxCube",
                description:
                  "Облачный интеллектуальный анализатор подозрительных объектов",
                features: [
                  "Анализ за 1 минуту",
                  "Немедленное изготовление лечащей утилиты",
                  "Подробный отчет",
                  "Для специалистов по ИБ",
                ],
                color: "from-blue-500 to-purple-600",
                badge: "Облачный сервис",
              },
              {
                icon: Users,
                title: "Антивирусные исследования",
                description:
                  "Анализ вредоносных файлов специалистами антивирусной лаборатории",
                features: [
                  "Анализ любой сложности",
                  "Описание алгоритмов работы",
                  "Категоризация объектов",
                  "Рекомендации по устранению",
                ],
                color: "from-green-500 to-emerald-600",
                badge: "Экспертиза",
              },
              {
                icon: Shield,
                title: "Экспертиза ВКИ",
                description:
                  "Квалифицированная экспертиза вирусозависимых компьютерных инцидентов",
                features: [
                  "Расследование инцидентов",
                  "Анализ последствий",
                  "Восстановление систем",
                  "Юридическое сопровождение",
                ],
                color: "from-red-500 to-pink-600",
                badge: "Спецподразделение",
              },
              {
                icon: Headphones,
                title: "Техническая поддержка",
                description: "Круглосуточная поддержка на русском языке",
                features: [
                  "24/7 по телефону",
                  "Через форму support.drweb.ru",
                  "Бесплатная расшифровка",
                  "VIP-поддержка",
                ],
                color: "from-orange-500 to-red-500",
                badge: "24/7",
              },
              {
                icon: Rocket,
                title: "Предпродажная поддержка",
                description: "Полное сопровождение процесса внедрения",
                features: [
                  "Бесплатное тестирование",
                  "Помощь при внедрении",
                  "Презентации и вебинары",
                  "Помощь с ТЗ",
                ],
                color: "from-indigo-500 to-purple-600",
                badge: "Бесплатно",
              },
              {
                icon: Code,
                title: "Dr.Web LiveDemo",
                description:
                  "Удаленное тестирование в виртуальной локальной сети",
                features: [
                  "Тестирование в облаке",
                  "Без установки",
                  "Полный функционал",
                  "Быстрый старт",
                ],
                color: "from-teal-500 to-green-600",
                badge: "Виртуальная сеть",
              },
            ].map((service, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-background/90 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-white/90 text-gray-700"
                    >
                      {service.badge}
                    </Badge>
                  </div>

                  <CardHeader>
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-3">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
            </Swiper>
          </div>

          {/* Support Contact Info - removed per request */}
        </div>
      </section>

      {/* Contacts Section */}
      <section
        id="contacts"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-muted/50 to-background"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16" data-animate id="contacts-header">

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 sm:mb-6">
              Получите{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                персональную консультацию
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Наши эксперты помогут подобрать оптимальное решение и рассчитают
              специальные условия
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-stretch">
            <div className={`${visibleElements.has("contacts-header") ? "animate-slide-in-left" : "opacity-0"}`}>
              <Card className="h-full border-0 shadow-2xl relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-white">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
                <CardHeader className="p-5 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground">
                    Как с нами связаться
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <a href="tel:+79930770168" className="group block p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 hover:border-green-300 transition-all shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-lg">Горячая линия</div>
                          <div className="text-muted-foreground text-base font-semibold">+7 993 077-01-68</div>
                          <div className="text-xs text-muted-foreground">Бесплатно по России • Круглосуточно</div>
                        </div>
                      </div>
                    </a>

                    <a href="mailto:info@gundyrev.com" className="group block p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 hover:border-green-300 transition-all shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-lg">Email поддержка</div>
                          <div className="text-muted-foreground text-base font-semibold">info@gundyrev.com</div>
                          <div className="text-xs text-muted-foreground">Ответ в течение 2 часов</div>
                        </div>
                      </div>
                    </a>

                    <div className="p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 hover:border-green-300 transition-all shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-lg">Режим работы</div>
                          <div className="text-muted-foreground text-sm">Пн-Пт: 9:00-18:00 МСК</div>
                          <div className="text-muted-foreground text-sm">Техподдержка: 24/7</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 hover:border-green-300 transition-all shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-emerald-500 to-green-700 p-3 rounded-xl shadow-lg">
                          <Headphones className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-lg">Экстренная поддержка</div>
                          <div className="text-muted-foreground text-sm">В выходные и праздники</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={`${visibleElements.has("contacts-header") ? "animate-slide-in-right" : "opacity-0"}`}>
              <Card className="h-full border-0 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>

                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span>Запросить консультацию</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <Input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} onBlur={() => setErrors((p) => ({ ...p, name: validators.name?.(contactForm.name) ?? "" }))} aria-invalid={!!errors.name || undefined} placeholder="Имя" className="transition-all hover:border-green-300 focus:border-green-500 focus:ring-green-500/20" />
                      <Input type="tel" required value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: formatRuPhone(e.target.value) })} onBlur={() => setErrors((p) => ({ ...p, phone: validators.phone?.(contactForm.phone) ?? "" }))} aria-invalid={!!errors.phone || undefined} placeholder="Контакт (телефон)" className="transition-all hover:border-green-300 focus:border-green-500 focus:ring-green-500/20" />
                      </div>
                    <Textarea rows={3} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Коротко: сколько устройств и что нужно" className="transition-all hover:border-green-300 focus:border-green-500 focus:ring-green-500/20" />

                    <p className="text-xs text-muted-foreground text-center">Нажимая «Получить консультацию», вы соглашаетесь с <a href="/privacy" className="underline">Политикой конфиденциальности</a> и <a href="/terms" className="underline">Пользовательским соглашением</a>.</p>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-700 hover:via-green-800 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-400 ease-smooth transform hover:-translate-y-1 hover:scale-102 py-5 text-lg font-bold"
                    >
                      <Rocket className="w-6 h-6 mr-3" />
                      Получить консультацию
                    </Button>

                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center">
                      <Lock className="w-3 h-3 mr-1" />
                      Ваши данные защищены и не передаются третьим лицам
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
              </section>




      {/* Testimonials Section (moved to bottom) */}
      <section
        id="testimonials"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden"
      >

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            data-animate
            id="testimonials-header"
          >

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">
              Что говорят{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                наши клиенты
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Более 10,000 довольных клиентов выбрали Dr.Web и Гундырев.рф для защиты своего
              бизнеса
            </p>
          </div>

          <div
            className={`max-w-4xl mx-auto ${
              visibleElements.has("testimonials-header")
                ? "animate-fade-in-up"
                : "opacity-0"
            }`}
          >
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                <blockquote className="text-xl md:text-2xl font-medium text-white mb-4 leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                </blockquote>
                <div className="text-purple-200 text-sm">
                  {testimonials[currentTestimonial].name} — {testimonials[currentTestimonial].company}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
      >
        <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-green-400 mb-4">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              Ответы на частые вопросы
            </h2>
            <p className="text-base sm:text-lg text-gray-300">
              Собрали основные вопросы о внедрении и сопровождении Dr.Web, чтобы
              вы быстро получили ключевую информацию.
            </p>
          </div>
          <div className="mt-12 max-w-4xl mx-auto space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-green-500/50"
              >
                <summary className="cursor-pointer list-none px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4">
                  <span className="text-lg sm:text-xl font-semibold text-white group-open:text-green-300">
                    {item.question}
                  </span>
                  <span className="text-green-400 text-2xl transform transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-gray-300 text-base leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        })}
      </Script>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur">
            <div className="absolute -top-32 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 h-72 w-72 rounded-full bg-green-500/10 blur-3xl"></div>
            <div className="relative flex flex-col gap-12 p-6 sm:p-10 lg:p-16">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-12">
                <div className="xl:w-5/12 space-y-8">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.35em] text-green-400">
                      официальный партнер
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">
                      Гундырев.рф × Dr.Web
                    </p>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                    <strong>Гундырев.рф</strong> - официальный начинающий партнер ООО «Доктор Веб» в России. 
                    Индивидуальный предприниматель <strong>Гундырев М. А.</strong> специализируется на продаже и
                    внедрении антивирусных решений Dr.Web для бизнеса и
                    государственных учреждений.
                  </p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-6 text-sm text-gray-300 space-y-5">
                      <div className="flex items-center gap-2 text-green-400">
                        <Building className="w-5 h-5" />
                        <span className="font-semibold">О компании Гундырев.рф:</span>
                      </div>
                      <div className="space-y-5 text-gray-400">
                        <div>
                          <p className="font-medium text-gray-200 mb-3 text-sm">
                            Наши услуги:
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 mt-0.5 text-green-400" />
                              <span>Консультации по выбору решений</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 mt-0.5 text-green-400" />
                              <span>Поставка лицензий Dr.Web</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 mt-0.5 text-green-400" />
                              <span>Техническая поддержка</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 mt-0.5 text-green-400" />
                              <span>Гарантированное сопровождение</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-gray-200 mb-3 text-sm">
                            Контактная информация:
                          </p>
                          <ul className="space-y-2">
                            <li><span className="text-gray-300">ИНН:</span> 637607810692</li>
                            <li><span className="text-gray-300">Телефон:</span> +7 993 077-01-68</li>
                            <li><span className="text-gray-300">Email:</span> info@gundyrev.com</li>
                            <li><span className="text-gray-300">Часы работы:</span> Пн-Пт 9:00-18:00</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-6 flex flex-col items-center text-center space-y-4 text-gray-300">
                      <Image
                        src="/logo_novice_partner.svg"
                        alt="Novice Partner Logo"
                        width={128}
                        height={128}
                        className="w-28 h-28"
                      />
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-green-400">
                          Гундырев М.А.
                        </p>
                        <p className="font-semibold">
                          Начинающий партнер ООО «Доктор Веб»
                        </p>
                        <p className="text-xs text-gray-400">
                          Официальный статус партнерства
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-gray-900/70 p-4 text-xs text-gray-400">
                    <p>
                      Информация на сайте носит справочный характер и не является публичной офертой. 
                      Окончательные условия поставки и цены уточняйте у менеджера.
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="rounded-3xl border border-white/10 bg-gray-900/70 p-8 text-gray-300 space-y-8">
                    <h4 className="text-2xl font-bold flex items-center gap-3 text-white">
                      <Phone className="w-6 h-6 text-green-400" />
                      Контакты
                    </h4>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4 hover:border-green-500/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-green-400" />
                          <span className="text-lg font-semibold">
                            +7 993 077-01-68
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4 hover:border-green-500/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-green-400" />
                          <span className="text-lg font-semibold">
                            info@gundyrev.com
                          </span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-green-400 mt-1" />
                          <div>
                            <div className="text-lg font-semibold text-white">
                              Пн-Пт: 9:00-18:00 МСК
                            </div>
                            <Badge
                              variant="secondary"
                              className="mt-3 text-sm text-green-400 bg-green-900/30"
                            >
                              Техподдержка 24/7
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-green-500/40 bg-green-900/20 px-5 py-4 text-sm text-green-200">
                      <p>
                        Свяжитесь с нами для консультации и подбора антивирусных решений Dr.Web под задачи вашего бизнеса.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3 text-sm text-gray-400">
                  <p className="text-gray-300">
                    &copy; 2025 Гундырев.рф Все права защищены.
                  </p>
                  <p>
                    Сайт Гундырев.рф - официального партнера ООО «Доктор Веб» | ИП Гундырев М.А. | ИНН: 637607810692
                  </p>
                  <p>
                    Контакты: Гундырев Максим Алексеевич | +7 993 077-01-68 | info@gundyrev.com
                  </p>
                  <p>
                    <span className="text-green-400">«Доктор Веб»</span> — российский разработчик средств информационной безопасности с 1992 года
                  </p>
                  <p className="text-gray-500">
                    Официальный сайт Dr.Web:{" "}
                    <a
                      href="https://www.drweb.ru"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-300"
                    >
                      www.drweb.ru
                    </a>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm">
                      <Fingerprint className="w-4 h-4 text-green-400" />
                      <span>ФСТЭК</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                      <span>ФСБ</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>РРПО</span>
                    </div>
                  </div>
                  <a
                    href="https://www.biveki.ru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 self-start rounded-full border border-green-500/40 bg-gradient-to-r from-green-500/30 to-emerald-500/30 px-5 py-3 text-sm font-semibold text-green-200 hover:border-green-400 hover:text-green-100 transition-colors"
                  >
                    <Code className="w-5 h-5" />
                    Разработка веб-приложений Biveki
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
