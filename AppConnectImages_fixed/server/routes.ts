import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { insertUserSchema, insertDealSchema, insertMessageSchema } from "@shared/schema";

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-production";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Auth middleware
interface AuthRequest extends Express.Request {
  user?: any;
}

const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Off-platform communication blocking middleware
const blockOffPlatform = (req: any, res: any, next: any) => {
  const message = req.body.content || "";
  
  const banned = ["@", "email", ".com", "phone", "call", "whatsapp", "telegram", "discord", "skype", "zoom"];
  
  for (const keyword of banned) {
    if (message.toLowerCase().includes(keyword)) {
      return res.status(400).json({
        error: "Off-platform communication blocked. Please keep all communication on the platform.",
      });
    }
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });
      
      // Return token and user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Login failed" });
    }
  });

  // Deal routes
  app.get("/api/deals", authMiddleware, async (req: any, res) => {
    try {
      const deals = await storage.getAllDeals();
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", authMiddleware, async (req: any, res) => {
    try {
      const dealId = parseInt(req.params.id);
      const deal = await storage.getDeal(dealId);
      
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      
      res.json(deal);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (user.role !== "brand") {
        return res.status(403).json({ error: "Only brands can create deals" });
      }
      
      const validatedData = insertDealSchema.parse({
        ...req.body,
        brandId: user.id,
      });
      
      const deal = await storage.createDeal(validatedData);
      res.json(deal);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create deal" });
    }
  });

  app.post("/api/deals/:id/accept", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;
      const dealId = parseInt(req.params.id);
      
      if (user.role !== "creator") {
        return res.status(403).json({ error: "Only creators can accept deals" });
      }
      
      const deal = await storage.getDeal(dealId);
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      
      if (deal.creatorId) {
        return res.status(400).json({ error: "Deal already accepted" });
      }
      
      const updatedDeal = await storage.acceptDeal(dealId, user.id);
      res.json(updatedDeal);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to accept deal" });
    }
  });

  // Search route (requires subscription)
  app.get("/api/search", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (!user.hasSubscription) {
        return res.status(403).json({ error: "Subscription required to search deals" });
      }
      
      const deals = await storage.getSearchDeals();
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Search failed" });
    }
  });

  // Stats route
  app.get("/api/stats", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;
      const deals = await storage.getUserDeals(user.id);
      
      const stats = {
        totalDeals: deals.length,
        activeDeals: deals.filter(d => d.status === "accepted" || d.status === "paid").length,
        pendingDeals: deals.filter(d => d.status === "pending").length,
        completedDeals: deals.filter(d => d.status === "completed").length,
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch stats" });
    }
  });

  // Message routes
  app.get("/api/messages/:dealId", authMiddleware, async (req: any, res) => {
    try {
      const dealId = parseInt(req.params.dealId);
      const messages = await storage.getMessages(dealId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch messages" });
    }
  });

  app.post("/api/messages/send", authMiddleware, blockOffPlatform, async (req: any, res) => {
    try {
      const user = req.user;
      const { dealId, content } = req.body;
      
      const message = await storage.createMessage({
        dealId: parseInt(dealId),
        senderId: user.id,
        content,
      });
      
      res.json({ success: true, message });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to send message" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", authMiddleware, async (req: any, res) => {
    try {
      const { dealId, amount } = req.body;
      const user = req.user;
      
      if (user.role !== "brand") {
        return res.status(403).json({ error: "Only brands can initiate payments" });
      }
      
      const deal = await storage.getDeal(parseInt(dealId));
      if (!deal) {
        return res.status(404).json({ error: "Deal not found" });
      }
      
      if (deal.brandId !== user.id) {
        return res.status(403).json({ error: "You can only pay for your own deals" });
      }
      
      const dealAmount = parseFloat(amount);
      const platformFee = dealAmount * 0.09; // 9% platform fee
      const totalAmount = dealAmount + platformFee; // Total includes platform fee
      
      // Create Stripe checkout session with line items showing the breakdown
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Deal Payment: ${deal.title}`,
              },
              unit_amount: Math.round(dealAmount * 100), // Deal amount in cents
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Platform Fee (9%)",
              },
              unit_amount: Math.round(platformFee * 100), // Platform fee in cents
            },
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/dashboard?payment=success`,
        cancel_url: `${req.headers.origin}/deals/${dealId}?payment=cancelled`,
        metadata: {
          dealId: dealId.toString(),
        },
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Payment processing failed" });
    }
  });

  app.post("/api/create-subscription", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;
      
      // Check if user already has an active subscription
      const existingSubscription = await storage.getActiveSubscription(user.id);
      if (existingSubscription) {
        return res.status(400).json({ error: "You already have an active subscription" });
      }
      
      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id.toString(),
          },
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(user.id, customerId, null);
      }
      
      // Create Stripe checkout session for subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{
          price_data: {
            currency: "usd",
            recurring: { interval: "month" },
            product_data: { name: "Search Access Subscription" },
            unit_amount: 800, // $8.00 in cents
          },
          quantity: 1,
        }],
        success_url: `${req.headers.origin}/dashboard?subscription=success`,
        cancel_url: `${req.headers.origin}/subscribe?subscription=cancelled`,
        metadata: {
          userId: user.id.toString(),
        },
      });
      
      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Subscription failed" });
    }
  });

  // Stripe webhook to handle subscription success (simplified version)
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const event = req.body;
      
      // In production, verify webhook signature
      // const sig = req.headers['stripe-signature'];
      // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        if (session.mode === 'subscription' && session.metadata?.userId) {
          const userId = parseInt(session.metadata.userId);
          const subscriptionId = session.subscription as string;
          
          await storage.updateUserSubscription(userId, true);
          await storage.updateUserStripeInfo(userId, session.customer as string, subscriptionId);
          await storage.createSubscription({
            userId,
            active: true,
          });
        } else if (session.mode === 'payment' && session.metadata?.dealId) {
          const dealId = parseInt(session.metadata.dealId);
          await storage.updateDealStatus(dealId, "paid");
        }
      }
      
      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/subscription/status", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;
      const subscription = await storage.getActiveSubscription(user.id);
      
      res.json({
        active: user.hasSubscription,
        subscription,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch subscription status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
