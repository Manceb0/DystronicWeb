"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircuitBoard } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on AI lab fullscreen interface
    if (pathname === "/ai-builder") {
        return null;
    }

    return (
        <footer className="w-full bg-[#121215] border-t border-white/5 py-12 mt-20 relative z-10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <Link href="/" className="flex items-center gap-2 group mb-4">
                        <div className="text-[#00f0ff]">
                            <CircuitBoard size={20} />
                        </div>
                        <span className="font-mono font-bold tracking-wider text-sm uppercase">Dystronic</span>
                    </Link>
                    <p className="text-sm text-gray-500 font-mono leading-relaxed">
                        SYSTEM_STATUS: ONLINE<br />
                        PROJ: HYBRID_STORE_LAB_v2.0<br />
                        Build, learn, source.
                    </p>
                </div>

                <div>
                    <h4 className="text-gray-100 font-bold mb-4 font-mono text-sm tracking-widest uppercase">Platform</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><Link href="/store" className="hover:text-[#00f0ff] transition-colors">Components</Link></li>
                        <li><Link href="/kits" className="hover:text-[#00f0ff] transition-colors">Kits</Link></li>
                        <li><Link href="/courses" className="hover:text-[#00f0ff] transition-colors">Courses</Link></li>
                        <li><Link href="/ai-builder" className="hover:text-[#39ff14] transition-colors">AI Lab Builder</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-gray-100 font-bold mb-4 font-mono text-sm tracking-widest uppercase">Community</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><Link href="/community" className="hover:text-[#ff5e00] transition-colors">Resell & Donate</Link></li>
                        <li><Link href="/request" className="hover:text-[#00f0ff] transition-colors">Request a Part</Link></li>
                        <li><Link href="/profile" className="hover:text-[#00f0ff] transition-colors">My Projects</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-gray-100 font-bold mb-4 font-mono text-sm tracking-widest uppercase">Terminal</h4>
                    <div className="bg-[#050507] rounded-sm p-3 border border-white/5 font-mono text-xs text-gray-400">
                        <span className="text-[#39ff14]">guest@dystronic:~$</span> ./subscribe.sh<br />
                        <span className="text-gray-600">Enter email to get lab updates...</span>
                        <div className="mt-2 flex">
                            <input type="text" className="bg-transparent border-b border-white/20 outline-none w-full text-white placeholder:text-gray-600 focus:border-[#00f0ff]" placeholder="user@email.com" />
                            <button className="text-[#00f0ff] ml-2 font-bold">{">>"}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600 font-mono">
                © {new Date().getFullYear()} DYSTRONIC. ALL RIGHTS RESERVED.
            </div>
        </footer>
    );
}
