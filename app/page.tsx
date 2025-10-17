import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // if (!user) {
  //   redirect("/login");
  // }
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                ₱
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FRCashFlow
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                How It Works
              </a>
              {user ? (
                <Link
                  href="/dashboard"
                  className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  Login
                </Link>
              )}
              {!user && (
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>
            <button className="md:hidden p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
                💰 Track Every Peso
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Take Control of Your
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Finances
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Smart, simple, and powerful Cash Flow tracking. Monitor your
                income and expenses in real-time with beautiful insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all text-center"
                >
                  Start Free Trial
                </Link>
                <a
                  href="#demo"
                  className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center"
                >
                  Watch Demo
                </a>
              </div>
              <div className="flex items-center gap-8 mt-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free forever
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur-3xl opacity-30" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                <div className="space-y-6">
                  {/* Mock Dashboard Preview */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <p className="text-indigo-100 text-sm mb-2">
                      Total Balance
                    </p>
                    <p className="text-4xl font-bold">₱45,230.50</p>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <span className="text-green-300">↑ 12.5%</span>
                      <span className="text-indigo-100">vs last month</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <p className="text-xs text-green-600 mb-1">Income</p>
                      <p className="text-2xl font-bold text-green-700">
                        ₱52,000
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <p className="text-xs text-red-600 mb-1">Expenses</p>
                      <p className="text-2xl font-bold text-red-700">
                        ₱6,769.50
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          💰
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Salary</p>
                          <p className="text-xs text-slate-500">Oct 1, 2025</p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">+₱50,000</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          🍔
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Food</p>
                          <p className="text-xs text-slate-500">Oct 5, 2025</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-600">-₱2,500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Manage Money
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make financial tracking effortless
              and insightful
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Real-Time Tracking",
                desc: "Monitor your income and expenses instantly with live updates and beautiful visualizations.",
                gradient: "from-indigo-50 to-purple-50",
                border: "border-indigo-100",
                iconBg: "from-indigo-500 to-purple-600",
              },
              {
                icon: "🎯",
                title: "Smart Categories",
                desc: "Organize transactions with custom categories and get insights into spending patterns.",
                gradient: "from-green-50 to-emerald-50",
                border: "border-green-100",
                iconBg: "from-green-500 to-emerald-600",
              },
              {
                icon: "🔍",
                title: "Advanced Filters",
                desc: "Search and filter transactions by type, category, date, or amount effortlessly.",
                gradient: "from-blue-50 to-cyan-50",
                border: "border-blue-100",
                iconBg: "from-blue-500 to-cyan-600",
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                desc: "Track your finances on the go with a fully responsive design that works everywhere.",
                gradient: "from-orange-50 to-red-50",
                border: "border-orange-100",
                iconBg: "from-orange-500 to-red-600",
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                desc: "Your financial data is encrypted and protected with enterprise-grade security.",
                gradient: "from-pink-50 to-rose-50",
                border: "border-pink-100",
                iconBg: "from-pink-500 to-rose-600",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Blazing fast performance ensures you can access your data instantly, anytime.",
                gradient: "from-yellow-50 to-amber-50",
                border: "border-yellow-100",
                iconBg: "from-yellow-500 to-amber-600",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl border ${feature.border} hover:shadow-xl transition-all hover:scale-105`}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:rotate-6 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Start Tracking in
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Get up and running in less than a minute
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Sign Up Free",
                desc: "Create your account in seconds. No credit card required, no strings attached.",
                gradient: "from-indigo-500 to-purple-600",
              },
              {
                num: "2",
                title: "Add Transactions",
                desc: "Start logging your income and expenses with our intuitive interface.",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                num: "3",
                title: "Track & Analyze",
                desc: "Watch your financial health improve with clear insights and smart analytics.",
                gradient: "from-blue-500 to-cyan-600",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg`}
                >
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who are already managing their money smarter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Free Today
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-transparent text-white rounded-xl font-semibold text-lg border-2 border-white hover:bg-white hover:text-indigo-600 transition-all"
            >
              Learn More
            </a>
          </div>
          <p className="text-indigo-200 mt-6 text-sm">
            Free forever. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  ₱
                </div>
                <span className="text-xl font-bold text-white">FRCashFlow</span>
              </div>
              <p className="text-sm text-slate-400">
                Smart money management for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-white transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>© 2025 FRCashFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
