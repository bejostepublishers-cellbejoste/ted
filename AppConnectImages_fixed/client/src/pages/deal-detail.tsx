import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ArrowLeft, DollarSign, User, Calendar, MessageSquare } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DealWithRelations } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultAvatar from "@assets/generated_images/Default_avatar_placeholder_neutral_9ecec0a4.png";

export default function DealDetail() {
  const [, params] = useRoute("/deals/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dealId = params?.id;

  const { data: deal, isLoading } = useQuery<DealWithRelations>({
    queryKey: ["/api/deals", dealId],
  });

  const acceptDealMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/deals/${dealId}/accept`, {});
    },
    onSuccess: () => {
      toast({
        title: "Deal accepted!",
        description: "You can now start working on this opportunity.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals", dealId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to accept deal",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { dealId, amount: deal?.amount });
      return response;
    },
    onSuccess: (data: any) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  const style = {
    "--sidebar-width": "16rem",
  };

  const isCreator = user.role === "creator";
  const isBrand = user.role === "brand";
  const isMyDeal = deal && (
    (isCreator && deal.creatorId === user.id) ||
    (isBrand && deal.brandId === user.id)
  );

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/dashboard")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-60 w-full" />
                </div>
              ) : deal ? (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl font-bold" data-testid="text-deal-title">{deal.title}</h1>
                        <Badge variant={
                          deal.status === "completed" ? "default" :
                          deal.status === "paid" ? "default" :
                          deal.status === "accepted" ? "secondary" :
                          "outline"
                        } data-testid="badge-status">
                          {deal.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Posted {new Date(deal.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-muted-foreground" data-testid="text-description">
                          {deal.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          Budget
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-primary" data-testid="text-amount">${deal.amount}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          9% platform fee applies
                        </p>
                      </CardContent>
                    </Card>

                    {deal.brand && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Brand
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={defaultAvatar} />
                              <AvatarFallback>{deal.brand.name[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold" data-testid="text-brand-name">{deal.brand.name}</p>
                              <p className="text-xs text-muted-foreground">{deal.brand.email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {deal.creator && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Creator
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={defaultAvatar} />
                              <AvatarFallback>{deal.creator.name[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold" data-testid="text-creator-name">{deal.creator.name}</p>
                              <p className="text-xs text-muted-foreground">{deal.creator.email}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                      {isCreator && deal.status === "pending" && !deal.creatorId && (
                        <Button 
                          className="w-full" 
                          onClick={() => acceptDealMutation.mutate()}
                          disabled={acceptDealMutation.isPending}
                          data-testid="button-accept-deal"
                        >
                          {acceptDealMutation.isPending ? "Accepting..." : "Accept Opportunity"}
                        </Button>
                      )}

                      {isBrand && deal.status === "accepted" && (
                        <Button 
                          className="w-full" 
                          onClick={() => paymentMutation.mutate()}
                          disabled={paymentMutation.isPending}
                          data-testid="button-pay"
                        >
                          {paymentMutation.isPending ? "Processing..." : "Pay Now"}
                        </Button>
                      )}

                      {isMyDeal && deal.creatorId && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setLocation(`/messages/${dealId}`)}
                          data-testid="button-message"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Messages
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <h2 className="text-xl font-semibold mb-2">Deal not found</h2>
                  <p className="text-muted-foreground mb-6">
                    This opportunity doesn't exist or has been removed.
                  </p>
                  <Button onClick={() => setLocation("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
