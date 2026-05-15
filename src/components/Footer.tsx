import { GitBranch, ExternalLink, Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Security', 'Roadmap'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API', 'Blog', 'Community'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Careers', 'Legal'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Cookies', 'Compliance'],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
              <span className="font-bold text-lg">CodePilot</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              AI Code Builder — generates complete, runnable projects powered by Puter AI.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-white transition">
                <GitBranch className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-white transition">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Email" className="text-slate-400 hover:text-white transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white text-sm transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="py-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2026 CodePilot. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-4 sm:mt-0">
            Built with ❤️ for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
