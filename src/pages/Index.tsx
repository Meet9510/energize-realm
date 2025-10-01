import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Zap, TrendingDown, Shield, BarChart3, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Leaf className="w-10 h-10 text-primary" />
              <Zap className="w-5 h-5 text-accent absolute -bottom-1 -right-1" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              REMS
            </span>
          </div>
          <Link to="/auth">
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Monitor, Manage, and Optimize{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Renewable Energy
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform to track energy consumption, reduce carbon footprint,
            and accelerate the transition to sustainable energy sources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage renewable energy at scale
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Monitor energy generation and consumption with live dashboards and insights.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Role Access</h3>
              <p className="text-muted-foreground">
                Tailored interfaces for admins, users, providers, technicians, and government.
              </p>
            </CardContent>
          </Card>

          <Card className="border-success/20 hover:border-success/40 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Carbon Tracking</h3>
              <p className="text-muted-foreground">
                Track CO₂ savings and visualize environmental impact in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-warning/20 hover:border-warning/40 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with compliance tracking and audit logs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
              <p className="text-muted-foreground">
                Get notified about faults, maintenance needs, and performance issues.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability Goals</h3>
              <p className="text-muted-foreground">
                Set and track energy reduction goals with progress monitoring.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Go Green?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of organizations managing their renewable energy with REMS.
              Start your free trial today.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Leaf className="w-6 h-6 text-primary" />
              <Zap className="w-3 h-3 text-accent absolute -bottom-0.5 -right-0.5" />
            </div>
            <span className="font-semibold">REMS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Renewable Energy Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
