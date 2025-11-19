import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { insertDealSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";

const dealFormSchema = insertDealSchema.extend({
  amount: z.string().min(1, "Amount is required"),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

export default function NewDeal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      brandId: user.id,
    },
  });

  const createDealMutation = useMutation({
    mutationFn: async (data: DealFormValues) => {
      return apiRequest("POST", "/api/deals", data);
    },
    onSuccess: () => {
      toast({
        title: "Opportunity posted!",
        description: "Creators can now see your opportunity.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to post opportunity",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DealFormValues) => {
    createDealMutation.mutate(data);
  };

  const style = {
    "--sidebar-width": "16rem",
  };

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
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Post New Opportunity</CardTitle>
                  <CardDescription>
                    Create a content opportunity for creators. Be clear about your expectations and budget.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opportunity Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., TikTok Product Review - Tech Gadget" 
                                {...field} 
                                data-testid="input-title"
                              />
                            </FormControl>
                            <FormDescription>
                              A clear, descriptive title that creators will see
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the content you need, your target audience, deliverables, timeline, and any specific requirements..."
                                className="min-h-[200px]"
                                {...field}
                                data-testid="input-description"
                              />
                            </FormControl>
                            <FormDescription>
                              Include all important details about the collaboration
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget (USD)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  $
                                </span>
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  placeholder="500.00" 
                                  className="pl-7"
                                  {...field}
                                  data-testid="input-amount"
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              9% platform fee will be added at payment
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation("/dashboard")}
                          className="flex-1"
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createDealMutation.isPending}
                          className="flex-1"
                          data-testid="button-submit"
                        >
                          {createDealMutation.isPending ? "Posting..." : "Post Opportunity"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
