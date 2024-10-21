import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Command } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function AuthenticationLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="relative flex-1 hidden md:flex">
        <Image
          src="/images/auth-background.jpg"
          alt="Authentication background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-purple-600 " />
        <div className="relative z-20 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center text-lg font-medium">
            <Command className="mr-2 h-6 w-6" /> Maverick Synergy
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">
              Revolutionize Your Development Process
            </h1>
            <p className="text-xl">
              Join Maverick Synergy and harness the power of AI to create entire web solutions in record time.
            </p>
            <div className="space-y-2">
              <p className="text-lg font-semibold">Transform your workflow:</p>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <pre className="p-4 bg-gray-100">
                  <code className="text-sm text-gray-800">
{`// Before Maverick Synergy
const buildApp = async () => {
  await planArchitecture(weeks);
  await writeBackend(months);
  await createFrontend(months);
  await testAndDeploy(weeks);
};`}
                  </code>
                </pre>
                <pre className="p-4 bg-purple-50">
                  <code className="text-sm text-purple-900">
{`// With Maverick Synergy
const buildApp = async () => {
  const app = await MaverickSynergy.generateFullStackApp({
    description: "E-commerce platform with AI recommendations",
    features: ["user auth", "product catalog", "shopping cart", "payment integration"],
    architecture: "microservices",
    database: "PostgreSQL",
    frontend: "React",
  });
  
  await app.deploy();
};

// Result: Complex applications built in days, not months!`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-purple-900">
              Welcome to Maverick Synergy
            </h2>
            <p className="text-sm text-gray-600">
              Enter your credentials to access your account or create a new one
            </p>
          </div>
          {children}
          <p className="px-8 text-center text-sm text-gray-600">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-purple-700"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-purple-700"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
