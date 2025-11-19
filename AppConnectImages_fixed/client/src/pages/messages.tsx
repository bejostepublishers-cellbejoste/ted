import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, AlertTriangle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MessageWithSender } from "@shared/schema";
import defaultAvatar from "@assets/generated_images/Default_avatar_placeholder_neutral_9ecec0a4.png";

export default function Messages() {
  const [, params] = useRoute("/messages/:dealId");
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [blockedWarning, setBlockedWarning] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dealId = params?.dealId;

  const { data: messages } = useQuery<MessageWithSender[]>({
    queryKey: ["/api/messages", dealId],
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages/send", { dealId: parseInt(dealId!), content });
    },
    onSuccess: () => {
      setMessage("");
      setBlockedWarning(false);
      queryClient.invalidateQueries({ queryKey: ["/api/messages", dealId] });
    },
    onError: (error: any) => {
      if (error.message?.includes("blocked")) {
        setBlockedWarning(true);
        toast({
          title: "Message blocked",
          description: "Please avoid sharing contact information. Keep all communication on the platform.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to send message",
          description: error.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
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
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-2xl font-bold">Messages</h1>
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-hidden p-6">
            <div className="h-full max-w-4xl mx-auto">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Deal Conversation</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  {blockedWarning && (
                    <div className="px-6 pb-4">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Your message contains blocked keywords (email, phone, etc.). 
                          Please keep all communication on the platform for your protection.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4 pb-4">
                      {messages?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages?.map((msg) => {
                          const isOwnMessage = msg.senderId === user.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                              data-testid={`message-${msg.id}`}
                            >
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={defaultAvatar} />
                                <AvatarFallback>
                                  {msg.sender?.name?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`flex flex-col gap-1 max-w-[70%] ${isOwnMessage ? "items-end" : ""}`}>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-medium">{msg.sender?.name || "Unknown"}</span>
                                  <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <div
                                  className={`rounded-md px-4 py-2 ${
                                    isOwnMessage
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>

                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Type a message..."
                        disabled={sendMessageMutation.isPending}
                        data-testid="input-message"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!message.trim() || sendMessageMutation.isPending}
                        data-testid="button-send"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep all communication on the platform. Sharing contact info is not allowed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
