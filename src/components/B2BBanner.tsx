"use client";

import { Building2, ShieldCheck } from "lucide-react";

/**
 * Информационная плашка о специализации на B2B/B2G сегменте
 * Отображается в верхней части главной страницы
 * Постоянно видима, без возможности закрытия
 */
export default function B2BBanner() {
  return (
    <div
      className="relative w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 border-b-2 border-green-800 shadow-lg"
      role="banner"
      aria-label="Информация о специализации B2B/B2G"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Иконки */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Текст */}
          <div className="text-center">
            <p className="text-white font-semibold text-sm sm:text-base leading-tight">
              <span className="inline sm:hidden">
                <Building2 className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              </span>
              Работаем только с юридическими лицами и государственными учреждениями
            </p>
            <p className="hidden sm:block text-green-100 text-xs sm:text-sm mt-1">
              Лицензии Dr.Web для корпоративных клиентов, госучреждений и образовательных организаций
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
