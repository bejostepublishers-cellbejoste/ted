import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Check, CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Subscribe() {
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: subscriptionStatus } = useQuery<any>({
    queryKey: ["/api/subscription/status"],
  });

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-subscription", {});
      return response;
    },
    onSuccess: (data: any) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const style = {
    "--sidebar-width": "16rem",
  };

  const isSubscribed = user.hasSubscription || subscriptionStatus?.active;

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-2xl font-bold">Subscription</h1>
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {isSubscribed ? (
                <Card className="border-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary" />
                          Active Subscription
                        </CardTitle>
                        <CardDescription className="mt-2">
                          You have full access to search and browse opportunities
                        </CardDescription>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">$8</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Browse all deals and creators</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Advanced search filters</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Unlimited messaging</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Priority support</span>
                        </li>
                      </ul>
                      <p className="text-sm text-muted-foreground pt-4 border-t">
                        Manage your subscription through your Stripe customer portal
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Search Access Subscription
                    </CardTitle>
                    <CardDescription>
                      Unlock full access to browse opportunities and connect with {user.role === "creator" ? "brands" : "creators"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">$8</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>

                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Browse all deals and creators</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Advanced search filters</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Unlimited messaging</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>Priority support</span>
                        </li>
                      </ul>

                      <div className="pt-4 border-t">
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => subscribeMutation.mutate()}
                          disabled={subscribeMutation.isPending}
                          data-testid="button-subscribe"
                        >
                          {subscribeMutation.isPending ? "Processing..." : "Subscribe Now"}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          Secure payments powered by Stripe. Cancel anytime.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Why Subscribe?</CardTitle>
                  <CardDescription>
                    Your subscription helps maintain a high-quality marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-foreground/40" />
                      </div>
                      <span>Access curated opportunities from verified brands</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-foreground/40" />
                      </div>
                      <span>Support platform maintenance and new features</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-foreground/40" />
                      </div>
                      <span>Fair pricing keeps the community sustainable</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
