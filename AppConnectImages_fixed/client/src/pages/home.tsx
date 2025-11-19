import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, DollarSign, MessageSquare, Shield, TrendingUp, Zap } from "lucide-react";
import heroImage from "@assets/generated_images/Diverse_creators_working_collaboratively_d9b08747.png";
import brandImage from "@assets/generated_images/Brand_executive_at_work_b91c0a57.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CollabMarket</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">Login</Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="button-signup">Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with dark wash over image */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
        
        <div className="relative z-10 container px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Badge variant="outline" className="mb-6 bg-primary/10 text-primary-foreground border-primary/20 backdrop-blur-sm" data-testid="badge-stat">
            10,000+ successful collaborations
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Connect Creators <br className="hidden sm:block" />
            <span className="text-primary">With Brands</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            The trusted marketplace for content collaborations. Find opportunities, manage deals, and get paid securely.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="default" className="bg-primary hover:bg-primary text-primary-foreground" data-testid="button-start-creating">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur-sm border-white/20 text-foreground hover:bg-background/90" data-testid="button-find-creators">
                Find Creators
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to start collaborating</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate" data-testid="card-step-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Post or Browse</CardTitle>
                <CardDescription>
                  Brands post opportunities. Creators discover deals that match their skills.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-elevate" data-testid="card-step-2">
              <CardHeader>
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Connect & Negotiate</CardTitle>
                <CardDescription>
                  Message directly on platform. Our system keeps communication safe and professional.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-elevate" data-testid="card-step-3">
              <CardHeader>
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Deliver & Get Paid</CardTitle>
                <CardDescription>
                  Complete the work, get paid securely through Stripe. We handle the transaction.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* For Creators / For Brands */}
      <section className="py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <Badge className="mb-4" data-testid="badge-creators">For Creators</Badge>
              <h2 className="text-4xl font-bold mb-6">Monetize Your Creativity</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Access thousands of brand opportunities. Build your portfolio, set your rates, and get paid for what you love.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Secure payments via Stripe</span>
                </li>
                <li className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Track earnings and performance</span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Safe messaging platform</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button size="lg" data-testid="button-creator-signup">
                  Join as Creator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img src={heroImage} alt="Creators at work" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-xl overflow-hidden">
              <img src={brandImage} alt="Brand executive" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4" data-testid="badge-brands">For Brands</Badge>
              <h2 className="text-4xl font-bold mb-6">Find Perfect Creators</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with talented creators who match your brand. Post campaigns, review portfolios, and scale your content marketing.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Access vetted creator network</span>
                </li>
                <li className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Only 9% platform fee</span>
                </li>
                <li className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Simple, transparent pricing</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button size="lg" data-testid="button-brand-signup">
                  Join as Brand
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">No hidden fees. Pay only when you use the platform.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover-elevate" data-testid="card-pricing-search">
              <CardHeader>
                <CardTitle className="text-2xl">Search Access</CardTitle>
                <CardDescription>Find opportunities or creators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-5xl font-bold">$8</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Browse all deals and creators</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Advanced search filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Unlimited messaging</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" data-testid="button-subscribe">Subscribe Now</Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate border-primary" data-testid="card-pricing-platform">
              <CardHeader>
                <CardTitle className="text-2xl">Platform Fee</CardTitle>
                <CardDescription>Per completed deal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-5xl font-bold">9%</span>
                  <span className="text-muted-foreground"> of deal value</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Secure Stripe payments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Dispute resolution support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span>Transaction protection</span>
                  </li>
                </ul>
                <Button className="w-full" data-testid="button-get-started">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">CollabMarket</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CollabMarket. Secure payments powered by Stripe.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
