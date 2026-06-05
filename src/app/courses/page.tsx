"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, Clock, Video } from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/LanguageProvider";
import { translateLevel } from "@/i18n/helpers";

export default function CoursesPage() {
    const { t, locale } = useTranslation();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 border-b border-white/5 pb-8 relative">
                <div className="absolute right-0 top-0 opacity-10 text-[#ffcc00]">
                    <GraduationCap size={120} />
                </div>
                <h1 className="text-4xl font-bold font-mono uppercase tracking-widest text-white mb-4">{t("courses.title")}</h1>
                <p className="text-gray-400 font-mono max-w-2xl text-sm leading-relaxed">
                    {t("courses.subtitle")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_COURSES.map(course => (
                    <div key={course.id} className="glass-panel flex flex-col group overflow-hidden border-t-2 border-t-transparent hover:border-t-[#ffcc00]">
                        <div className="h-40 bg-[#050507] border-b border-white/5 relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                            <div className="absolute top-2 left-2 flex gap-1 z-20">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${course.level === 'Beginner' ? 'bg-[#39ff14]/20 text-[#39ff14]' : course.level === 'Intermediate' ? 'bg-[#ffcc00]/20 text-[#ffcc00]' : 'bg-[#ff5e00]/20 text-[#ff5e00]'}`}>
                                    {translateLevel(locale, course.level)}
                                </span>
                            </div>
                            <div className="absolute inset-0 w-full h-full z-0">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                            </div>

                            <div className="absolute bottom-2 left-2 z-20 flex gap-3 text-xs text-gray-300 font-mono">
                                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                                <span className="flex items-center gap-1"><Video size={12} /> {course.modality.split(' ')[0]}</span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <h2 className="text-lg font-bold text-gray-100 group-hover:text-[#ffcc00] transition-colors mb-4 line-clamp-2 leading-tight">
                                {course.title}
                            </h2>

                            <div className="mb-6 flex-1">
                                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">{t("courses.finalProject")}</p>
                                <p className="text-sm font-bold text-white border-l-2 border-[#00f0ff] pl-3 py-1">
                                    {course.finalProject}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <span className="text-lg font-bold font-mono text-white">
                                    {course.price === 0 ? <span className="text-[#39ff14]">{t("common.free")}</span> : `$${course.price.toFixed(2)}`}
                                </span>
                                <Link href={`/courses/${course.id}`}>
                                    <Button variant="outline" size="sm">{t("common.syllabus")} <ArrowRight size={14} className="ml-2" /></Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
