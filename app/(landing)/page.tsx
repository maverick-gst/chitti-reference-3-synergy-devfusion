import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Package, ShoppingCart, LucideIcon, CheckCircle, BarChart, Users, Rocket, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/app/(landing)/components/Header'

// Define types for the FeatureCard props
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Define types for the ProductCard props
interface ProductCardProps {
  title: string;
  description: string;
  price: string;
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 text-white">
      <main className="flex-grow">
        <Header />
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-bold mb-8">Maverick Synergy: Your AI-Powered Development Partner</h1>
              <p className="text-2xl mb-12">Create entire web solutions, from SaaS platforms to microservices, with the power of advanced AI. Go beyond code assistance - build complete, production-ready applications in record time.</p>
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600 text-lg px-8 py-4">
                Start Building Your Vision <Zap className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen flex items-center bg-indigo-900 bg-opacity-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-20">Revolutionize Your Development Process</h2>
            <div className="grid md:grid-cols-3 gap-16">
              <FeatureCard 
                icon={<Sparkles className="w-20 h-20 text-yellow-400" />}
                title="AI-Driven Full-Stack Development"
                description="Leverage our advanced AI to generate entire web applications, including frontend, backend, and database structures. Go from concept to deployment faster than ever before."
              />
              <FeatureCard 
                icon={<Zap className="w-20 h-20 text-yellow-400" />}
                title="Intelligent Project Management"
                description="Our AI doesn't just code - it manages your project, suggesting optimal architectures, identifying potential issues, and ensuring best practices throughout the development lifecycle."
              />
              <FeatureCard 
                icon={<Package className="w-20 h-20 text-yellow-400" />}
                title="Adaptive Learning & Customization"
                description="Maverick Synergy learns from your preferences and coding style, adapting its output to match your unique needs and continuously improving its suggestions."
              />
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="capabilities" className="min-h-screen flex items-center bg-blue-900 bg-opacity-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-20">Comprehensive Development Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-16">
              <CapabilityCard
                title="Full-Stack Web Applications"
                description="Create complex, scalable web applications with modern frameworks and architectures, all powered by AI-driven development."
              />
              <CapabilityCard
                title="Microservices & API Development"
                description="Design and implement robust microservices architectures and RESTful APIs with automated documentation and testing."
              />
              <CapabilityCard
                title="Database Design & Optimization"
                description="Generate efficient database schemas, write optimized queries, and manage data migrations with AI-powered insights."
              />
              <CapabilityCard
                title="DevOps & Deployment Automation"
                description="Set up CI/CD pipelines, containerize applications, and automate cloud deployments for seamless development workflows."
              />
            </div>
          </div>
        </section>

        {/* Who Can Benefit Section */}
        <section id="who-can-benefit" className="min-h-screen flex items-center bg-purple-900 bg-opacity-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-20">Who Can Benefit?</h2>
            <div className="grid md:grid-cols-3 gap-16">
              <TargetAudienceCard
                title="Visionary Founders"
                description="Transform your groundbreaking ideas into fully-functional MVPs and scalable products in a fraction of the time, allowing you to iterate and capture market share faster."
              />
              <TargetAudienceCard
                title="Enterprise Innovators"
                description="Accelerate digital transformation initiatives by rapidly prototyping, developing, and deploying custom solutions that integrate seamlessly with existing systems."
              />
              <TargetAudienceCard
                title="Solo Developers & Startups"
                description="Amplify your development capabilities, tackle complex projects with confidence, and compete with larger teams by leveraging AI-powered full-stack development."
              />
            </div>
          </div>
        </section>

        {/* Synergy SaaS Startup Creation Section */}
        <section id="startup-creation" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">Synergy SaaS Startup Creation</h2>
              <p className="text-xl max-w-3xl mx-auto">Transform your vision into a thriving SaaS business with our revolutionary AI-powered startup creation process. From concept to launch and beyond, we're with you every step of the way.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 mb-20">
              <div>
                <h3 className="text-3xl font-semibold mb-8">Why Choose Synergy?</h3>
                {[
                  { icon: Zap, text: "Rapid Idea to Market: Launch 3x faster" },
                  { icon: Shield, text: "Reduced Risk: Data-driven decision making" },
                  { icon: BarChart, text: "Cost-Effective: Optimize your budget by 40%" },
                  { icon: Rocket, text: "Built for Growth: Scalable from day one" },
                  { icon: Users, text: "User-Centric: Resonate with your audience" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center mb-6">
                    <item.icon className="w-8 h-8 mr-4 text-yellow-400" />
                    <span className="text-lg">{item.text}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-8">Our AI-Powered Process</h3>
                <div className="relative">
                  {[
                    "Idea Validation & Market Analysis",
                    "Product Design & Architecture",
                    "Agile Development & QA",
                    "Go-to-Market Strategy",
                    "Post-Launch Support & Growth"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-xl font-bold">
                        {index + 1}
                      </div>
                      <span className="text-lg">{step}</span>
                    </div>
                  ))}
                  <div className="absolute left-6 top-6 w-0.5 h-4/5 bg-blue-500"></div>
                </div>
              </div>
            </div>

            <div className="mb-20">
              <h3 className="text-3xl font-semibold text-center mb-12">What Sets Us Apart</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Sparkles,
                    title: "AI-Powered Insights",
                    description: "Harness the power of advanced AI for data-driven decision making and predictive analytics."
                  },
                  {
                    icon: Users,
                    title: "Expert Human Guidance",
                    description: "Benefit from our team's decades of combined experience in SaaS development and entrepreneurship."
                  },
                  {
                    icon: RefreshCw,
                    title: "Agile Iteration",
                    description: "Rapidly evolve your product with continuous feedback loops and AI-assisted improvements."
                  }
                ].map((card, index) => (
                  <div key={index} className="bg-white bg-opacity-10 p-8 rounded-lg text-center">
                    <card.icon className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
                    <h4 className="text-2xl font-semibold mb-4">{card.title}</h4>
                    <p className="text-gray-300">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600 text-xl px-12 py-6 rounded-full shadow-lg">
                Start Your SaaS Journey <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="min-h-screen flex items-center bg-indigo-900 bg-opacity-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-12">Ready to Redefine What's Possible in Web Development?</h2>
            <p className="text-2xl mb-16">Join the AI-powered development revolution with Maverick Synergy.</p>
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600 text-xl px-10 py-5">
              Start Your Free Trial <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">&copy; 2024 Maverick Synergy - Empowering the Future of AI-Driven Development. All rights reserved.</p>
          <div className="mt-6">
            <Link href="/terms" className="text-gray-400 hover:text-white mx-4">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white mx-4">Privacy Policy</Link>
            <Link href="/blog" className="text-gray-400 hover:text-white mx-4">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg text-center flex flex-col items-center justify-center h-full">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </div>
  )
}

function CapabilityCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white bg-opacity-10 p-10 rounded-lg shadow-lg flex flex-col justify-center h-full">
      <h3 className="text-2xl font-semibold mb-6">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </div>
  )
}

function TargetAudienceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white bg-opacity-10 p-10 rounded-lg shadow-lg flex flex-col justify-center h-full">
      <h3 className="text-2xl font-semibold mb-6">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </div>
  )
}

function SetUsApartCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg text-center">
      <h4 className="text-xl font-semibold mb-4">{title}</h4>
      <p className="text-gray-200">{description}</p>
    </div>
  )
}
