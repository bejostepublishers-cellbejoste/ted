import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DollarSign, Briefcase, MessageSquare, Plus, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import type { DealWithRelations } from "@shared/schema";
import emptyStateImage from "@assets/generated_images/Empty_state_illustration_minimal_ec2f77d5.png";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isCreator = user.role === "creator";

  const { data: deals, isLoading } = useQuery<DealWithRelations[]>({
    queryKey: ["/api/deals"],
  });

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
  });

  const myDeals = deals?.filter((deal) => 
    isCreator ? deal.creatorId === user.id : deal.brandId === user.id
  ) || [];

  const activeDealCount = myDeals.filter((d) => d.status === "accepted" || d.status === "paid").length;
  const pendingDealCount = myDeals.filter((d) => d.status === "pending").length;
  const totalEarnings = myDeals
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Stats Overview */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card data-testid="card-stat-earnings">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isCreator ? "Total Earnings" : "Total Spent"}
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-total-earnings">
                      ${totalEarnings.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From completed deals
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-stat-active">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-active-deals">{activeDealCount}</div>
                    <p className="text-xs text-muted-foreground">
                      Currently in progress
                    </p>
                  </CardContent>
                </Card>

                <Card data-testid="card-stat-pending">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold" data-testid="text-pending-deals">{pendingDealCount}</div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting response
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Deals */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Recent Deals</h2>
                    <p className="text-muted-foreground">
                      {isCreator ? "Opportunities you're working on" : "Your posted opportunities"}
                    </p>
                  </div>
                  {!isCreator && (
                    <Button onClick={() => setLocation("/deals/new")} data-testid="button-create-deal">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Opportunity
                    </Button>
                  )}
                </div>

                {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : myDeals.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myDeals.slice(0, 6).map((deal) => (
                      <Card 
                        key={deal.id} 
                        className="hover-elevate cursor-pointer transition-all"
                        onClick={() => setLocation(`/deals/${deal.id}`)}
                        data-testid={`card-deal-${deal.id}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg line-clamp-2">{deal.title}</CardTitle>
                            <Badge 
                              variant={
                                deal.status === "completed" ? "default" :
                                deal.status === "paid" ? "default" :
                                deal.status === "accepted" ? "secondary" :
                                "outline"
                              }
                              data-testid={`badge-status-${deal.id}`}
                            >
                              {deal.status}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {deal.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-primary">${deal.amount}</p>
                              <p className="text-xs text-muted-foreground">
                                {isCreator ? "Potential earnings" : "Budget"}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              View
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <img 
                          src={emptyStateImage} 
                          alt="No deals" 
                          className="w-48 h-48 object-contain opacity-50"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">No deals yet</h3>
                        <p className="text-muted-foreground mb-6">
                          {isCreator 
                            ? "Browse available opportunities to start earning"
                            : "Create your first opportunity to find creators"}
                        </p>
                        <Button onClick={() => setLocation(isCreator ? "/search" : "/deals/new")} data-testid="button-get-started">
                          {isCreator ? "Browse Opportunities" : "Post Opportunity"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
