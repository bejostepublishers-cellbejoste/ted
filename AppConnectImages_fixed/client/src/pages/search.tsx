import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Search as SearchIcon, Lock, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import type { DealWithRelations } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import emptyStateImage from "@assets/generated_images/Empty_state_illustration_minimal_ec2f77d5.png";

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: deals, isLoading } = useQuery<DealWithRelations[]>({
    queryKey: ["/api/search"],
    enabled: user.hasSubscription,
  });

  const style = {
    "--sidebar-width": "16rem",
  };

  const filteredDeals = deals?.filter((deal) =>
    searchTerm === "" ||
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const availableDeals = filteredDeals.filter((deal) => deal.status === "pending" && !deal.creatorId);

  if (!user.hasSubscription) {
    return (
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-bold">Search Deals</h1>
              <div className="flex-1" />
            </header>
            <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
              <Card className="max-w-md">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Subscription Required</CardTitle>
                  <CardDescription>
                    Subscribe for $8/month to search and browse all opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => setLocation("/subscribe")}
                    data-testid="button-subscribe"
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-2xl font-bold">Search Deals</h1>
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>

              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
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
              ) : availableDeals.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Found {availableDeals.length} available {availableDeals.length === 1 ? "opportunity" : "opportunities"}
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {availableDeals.map((deal) => (
                      <Card 
                        key={deal.id}
                        className="hover-elevate cursor-pointer transition-all"
                        onClick={() => setLocation(`/deals/${deal.id}`)}
                        data-testid={`card-deal-${deal.id}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg line-clamp-2">{deal.title}</CardTitle>
                            <Badge variant="outline">Open</Badge>
                          </div>
                          <CardDescription className="line-clamp-3">
                            {deal.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-primary">${deal.amount}</p>
                              <p className="text-xs text-muted-foreground">Budget</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              View
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                          {deal.brand && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-muted-foreground">Posted by</p>
                              <p className="font-medium text-sm">{deal.brand.name}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="p-12">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={emptyStateImage} 
                        alt="No results" 
                        className="w-48 h-48 object-contain opacity-50"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {searchTerm ? "No results found" : "No opportunities available"}
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? "Try adjusting your search terms"
                          : "Check back soon for new opportunities"}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
