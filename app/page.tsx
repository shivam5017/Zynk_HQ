import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Calendar,
  BarChart3,
  Zap,
  Users,
  Clock,
  Check,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Zynk Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold">Zynk</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link href="/sign-up">
                <Button>Get Started Free</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Schedule tweets,
            <br />
            grow your audience
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The easiest way to plan, schedule, and manage your Twitter content.
            Save time and grow your audience with powerful automation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Watch Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed on Twitter
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you grow your audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description:
                  "Schedule tweets and threads weeks in advance with our intuitive calendar interface.",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description:
                  "Track engagement, impressions, and growth with detailed analytics and insights.",
              },
              {
                icon: Zap,
                title: "Auto-Publishing",
                description:
                  "Set it and forget it. Your tweets will be published automatically at the perfect time.",
              },
              {
                icon: Users,
                title: "Multiple Accounts",
                description:
                  "Manage multiple Twitter accounts from a single dashboard.",
              },
              {
                icon: Clock,
                title: "Best Time to Post",
                description:
                  "AI-powered suggestions for the best times to post based on your audience.",
              },
              {
                icon: Twitter,
                title: "Thread Composer",
                description:
                  "Create engaging Twitter threads with our easy-to-use thread composer.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for getting started",
                features: [
                  "5 scheduled posts per month",
                  "1 Twitter account",
                  "Basic analytics",
                  "Email support",
                ],
              },
              {
                name: "Pro",
                price: "$19",
                description: "For serious content creators",
                features: [
                  "Unlimited scheduled posts",
                  "3 Twitter accounts",
                  "Advanced analytics",
                  "Thread support",
                  "Best time to post",
                  "Priority support",
                ],
                popular: true,
              },
              {
                name: "Business",
                price: "$49",
                description: "For teams and agencies",
                features: [
                  "Everything in Pro",
                  "Unlimited Twitter accounts",
                  "Team collaboration",
                  "Custom analytics reports",
                  "API access",
                  "Dedicated support",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg p-8 ${
                  plan.popular
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="text-sm font-semibold mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={plan.popular ? "text-blue-100" : "text-gray-600"}>
                  {plan.description}
                </p>
                <div className="my-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span
                    className={plan.popular ? "text-blue-100" : "text-gray-600"}
                  >
                    /month
                  </span>
                </div>
                <Link href="/sign-up">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-white text-blue-600 hover:bg-gray-100"
                        : ""
                    }`}
                    variant={plan.popular ? "secondary" : "default"}
                  >
                    Get Started
                  </Button>
                </Link>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className={`h-5 w-5 mt-0.5 ${plan.popular ? "text-white" : "text-green-600"}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to grow your Twitter audience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators using TweetScheduler to save time and
            grow their audience
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="h-12 px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <Twitter className="h-6 w-6" />
                <span className="text-lg font-bold">TweetScheduler</span>
              </div>
              <p className="text-sm">
                The easiest way to schedule and manage your Twitter content.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features">Features</Link>
                </li>
                <li>
                  <Link href="#pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/docs">Documentation</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2024 TweetScheduler. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
