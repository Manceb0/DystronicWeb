import Link from "next/link";
import { ArrowRight, Cpu, Wrench, GraduationCap, PackageOpen, Recycle, Activity, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* HERO SECTION */}
      <section className="relative w-full py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-transparent z-[-2]"></div>
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full z-[-1] mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-1/2 left-[20%] w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full z-[-1] mix-blend-screen pointer-events-none"></div>

        <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-3 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
            <span className="text-sm font-medium text-blue-200 tracking-wide">Physical Store + Digital Lab</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight max-w-4xl font-sans">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">build, learn, and prototype</span> in one place.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
            Not just parts. A structured path to create. Dystronic gives you the components, guided kits, courses, and AI project planning to turn your idea into physical reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/store">
              <Button variant="orange" size="lg" className="w-full sm:w-auto">
                Explore Components <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/ai-builder">
              <Button variant="cyan" size="lg" className="w-full sm:w-auto">
                <Bot className="mr-2 h-4 w-4" /> Try Dystronic AI
              </Button>
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 w-full max-w-3xl flex justify-center gap-12 text-sm text-gray-500 tracking-wide">
            <div className="flex flex-col items-center"><Activity size={20} className="mb-2 text-gray-400" /> Fast Local Restock</div>
            <div className="flex flex-col items-center"><PackageOpen size={20} className="mb-2 text-gray-400" /> Ready to Build Kits</div>
            <div className="flex flex-col items-center"><Wrench size={20} className="mb-2 text-gray-400" /> Lab Tested</div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS BLOCKS */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-wider">Platform Modules</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Block 1 */}
            <Link href="/store" className="glass-panel p-8 group hover:-translate-y-1 relative overflow-hidden flex flex-col items-start h-full">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(59,130,246,0.15)]">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sensors & Parts</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">Search through microcontrollers, sensors, actuators, and mechanical parts in stock.</p>
              <span className="text-blue-400 text-xs font-medium uppercase tracking-wider flex items-center mt-auto">Browse Catalog <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
            </Link>

            {/* Block 2 */}
            <Link href="/kits" className="glass-panel p-8 group hover:-translate-y-1 relative overflow-hidden flex flex-col items-start h-full">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(168,85,247,0.15)]">
                <PackageOpen size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Guided Kits</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">Don't know what parts go together? Buy complete kits designed for a specific learning outcome.</p>
              <span className="text-purple-400 text-xs font-medium uppercase tracking-wider flex items-center mt-auto">View Kits <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
            </Link>

            {/* Block 3 */}
            <Link href="/courses" className="glass-panel p-8 group hover:-translate-y-1 relative overflow-hidden flex flex-col items-start h-full">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(251,191,36,0.15)]">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Learning Paths</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">Courses covering basic electronics to advanced IoT and Robotics.</p>
              <span className="text-amber-400 text-xs font-medium uppercase tracking-wider flex items-center mt-auto">Start Learning <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
            </Link>

            {/* Block 4 */}
            <Link href="/ai-builder" className="glass-panel border-teal-500/20 p-8 group hover:-translate-y-1 relative overflow-hidden flex flex-col items-start h-full lg:col-span-2 bg-teal-500/5">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(20,184,166,0.15)]">
                <Bot size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-teal-400">Dystronic AI Lab Builder</h3>
              <p className="text-gray-300 text-sm max-w-xl mb-6 flex-1">If you don't know where to start, Dystronic gives you a route. Tell us what you want to build and the AI will draft a system plan, a visual wiring diagram, and a complete parts list.</p>
              <span className="text-teal-400 text-xs font-medium uppercase tracking-wider flex items-center mt-auto">Open Lab <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
            </Link>

            {/* Block 5 */}
            <Link href="/community" className="glass-panel p-8 group hover:-translate-y-1 relative overflow-hidden flex flex-col items-start h-full">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-gray-300 group-hover:scale-110 transition-transform">
                <Recycle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Resell & Donate</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">Finished a project? Post your unused components so other creators can reuse them, or buy parts from graduates.</p>
              <span className="text-gray-300 text-xs font-medium uppercase tracking-wider flex items-center mt-auto">Explore Community <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTED MESSAGE SECTION */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass-panel p-12 text-center border-t-2 border-t-blue-500/50">
            <h3 className="text-3xl font-bold mb-6">We blur the lines between sourcing and building.</h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              Dystronic helps both the expert who knows exactly what they need, and the beginner who is just starting out.
              Turn an idea into a complete project with less friction through our hybrid ecosystem.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/request">
                <Button variant="outline" className="w-full sm:w-auto">Request Specific Part</Button>
              </Link>
              <Link href="/store">
                <Button variant="cyan" className="w-full sm:w-auto">Go to Main Catalog</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
