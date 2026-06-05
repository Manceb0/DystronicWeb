"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, Video, ListChecks, Target, PackageOpen, Bot } from "lucide-react";
import { MOCK_COURSES, MOCK_KITS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

export default function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { addToCart } = useAppContext();

    const course = MOCK_COURSES.find(c => c.id === id);

    if (!course) {
        return <div className="container mx-auto p-20 text-center font-mono">Course not found.</div>;
    }

    const suggestedKit = course.suggestedKitId ? MOCK_KITS.find(k => k.id === course.suggestedKitId) : null;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-gray-500 uppercase mb-8">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <ChevronRight size={12} />
                <span className="text-[#ffcc00]">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                        {/* Course Image Background */}
                        <div className="absolute right-0 top-0 w-1/2 h-full opacity-30 mask-image-to-l pointer-events-none">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover object-right" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-transparent"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest ${course.level === 'Beginner' ? 'bg-[#39ff14]/20 text-[#39ff14]' : course.level === 'Intermediate' ? 'bg-[#ffcc00]/20 text-[#ffcc00]' : 'bg-[#ff5e00]/20 text-[#ff5e00]'}`}>
                                    {course.level}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-400 font-mono"><Clock size={12} /> {course.duration}</span>
                                <span className="flex items-center gap-1 text-xs text-gray-400 font-mono"><Video size={12} /> {course.modality}</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold font-sans text-white mb-8 leading-tight">{course.title}</h1>

                            <div className="bg-[#121215] border border-[#00f0ff]/30 p-6 rounded-sm mb-8">
                                <h3 className="text-sm font-bold font-mono text-[#00f0ff] uppercase tracking-widest mb-2 flex items-center gap-2"><Target size={16} /> Final Project</h3>
                                <p className="text-lg text-white font-mono">{course.finalProject}</p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                                    <Link href={`/ai-builder?mode=overview&course=${course.id}`}>
                                        <Button variant="cyan" size="sm"><Bot size={14} className="mr-2" /> View Flow in AI Builder</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8">
                        <h3 className="text-xl font-bold font-mono text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                            <ListChecks size={20} className="text-[#ffcc00]" /> Syllabus & Skills
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.learnedSkills.map((skill, index) => (
                                <li key={index} className="bg-[#050507] p-4 border border-white/5 text-gray-300 font-mono text-sm flex items-start gap-3 relative overflow-hidden group hover:border-[#ffcc00]/50 transition-colors">
                                    <span className="text-[#ffcc00] font-bold">0{index + 1}.</span>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <div className="text-3xl font-mono font-bold text-white border-b border-white/10 pb-6 mb-6">
                            {course.price === 0 ? <span className="text-[#39ff14]">FREE</span> : `$${course.price.toFixed(2)}`}
                        </div>

                        <div className="space-y-4 mb-8">
                            <Button variant={course.price === 0 ? "green" : "outline"} className="w-full">
                                Enroll Now
                            </Button>
                        </div>

                        {/* Suggested Materials CTA */}
                        {suggestedKit && (
                            <div className="bg-[#0b1122]/50 border border-[#00f0ff]/20 p-5 rounded-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f0ff]"></div>
                                <h4 className="text-xs uppercase tracking-widest font-mono text-[#00f0ff] mb-4">Required Materials</h4>

                                <div className="flex gap-4 items-center mb-4 cursor-pointer group" onClick={() => router.push(`/kits/${suggestedKit.id}`)}>
                                    <div className="w-12 h-12 bg-[#050507] border border-white/10 flex items-center justify-center text-gray-500 group-hover:border-[#00f0ff] transition-colors">
                                        <PackageOpen size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-gray-200 group-hover:text-[#00f0ff] transition-colors">{suggestedKit.name}</h5>
                                        <span className="text-xs font-mono text-gray-400">${suggestedKit.price.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button variant="solid" size="sm" className="w-full mb-2" onClick={() => addToCart(suggestedKit, "kit")}>
                                    Buy Materials
                                </Button>
                                <p className="text-[10px] text-gray-500 font-mono text-center">Free shipping for enrolled students</p>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
