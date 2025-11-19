import { users, deals, messages, subscriptions, type User, type InsertUser, type Deal, type InsertDeal, type Message, type InsertMessage, type Subscription, type InsertSubscription, type DealWithRelations, type MessageWithSender } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, hasSubscription: boolean): Promise<User>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string | null, stripeSubscriptionId: string | null): Promise<User>;
  
  // Deal operations
  getDeal(id: number): Promise<DealWithRelations | undefined>;
  getAllDeals(): Promise<DealWithRelations[]>;
  getSearchDeals(): Promise<DealWithRelations[]>;
  getUserDeals(userId: number): Promise<DealWithRelations[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDealStatus(dealId: number, status: string): Promise<Deal>;
  acceptDeal(dealId: number, creatorId: number): Promise<Deal>;
  
  // Message operations
  getMessages(dealId: number): Promise<MessageWithSender[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Subscription operations
  getActiveSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  deactivateSubscription(userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserSubscription(userId: number, hasSubscription: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ hasSubscription })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: number, stripeCustomerId: string | null, stripeSubscriptionId: string | null): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId, stripeSubscriptionId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Deal operations
  async getDeal(id: number): Promise<DealWithRelations | undefined> {
    const [deal] = await db
      .select({
        id: deals.id,
        brandId: deals.brandId,
        creatorId: deals.creatorId,
        title: deals.title,
        description: deals.description,
        amount: deals.amount,
        status: deals.status,
        createdAt: deals.createdAt,
        brand: users,
      })
      .from(deals)
      .leftJoin(users, eq(deals.brandId, users.id))
      .where(eq(deals.id, id));

    if (!deal) return undefined;

    // Get creator separately if exists
    let creator: User | undefined;
    if (deal.creatorId) {
      const [creatorUser] = await db.select().from(users).where(eq(users.id, deal.creatorId));
      creator = creatorUser;
    }

    return {
      ...deal,
      brand: deal.brand || undefined,
      creator,
    };
  }

  async getAllDeals(): Promise<DealWithRelations[]> {
    const dealsData = await db
      .select({
        id: deals.id,
        brandId: deals.brandId,
        creatorId: deals.creatorId,
        title: deals.title,
        description: deals.description,
        amount: deals.amount,
        status: deals.status,
        createdAt: deals.createdAt,
        brand: users,
      })
      .from(deals)
      .leftJoin(users, eq(deals.brandId, users.id))
      .orderBy(desc(deals.createdAt));

    return dealsData.map(deal => ({
      ...deal,
      brand: deal.brand || undefined,
    }));
  }

  async getSearchDeals(): Promise<DealWithRelations[]> {
    const dealsData = await db
      .select({
        id: deals.id,
        brandId: deals.brandId,
        creatorId: deals.creatorId,
        title: deals.title,
        description: deals.description,
        amount: deals.amount,
        status: deals.status,
        createdAt: deals.createdAt,
        brand: users,
      })
      .from(deals)
      .leftJoin(users, eq(deals.brandId, users.id))
      .where(eq(deals.status, 'pending'))
      .orderBy(desc(deals.createdAt));

    return dealsData.map(deal => ({
      ...deal,
      brand: deal.brand || undefined,
    }));
  }

  async getUserDeals(userId: number): Promise<DealWithRelations[]> {
    const dealsData = await db
      .select({
        id: deals.id,
        brandId: deals.brandId,
        creatorId: deals.creatorId,
        title: deals.title,
        description: deals.description,
        amount: deals.amount,
        status: deals.status,
        createdAt: deals.createdAt,
        brand: users,
      })
      .from(deals)
      .leftJoin(users, eq(deals.brandId, users.id))
      .where(or(eq(deals.brandId, userId), eq(deals.creatorId, userId)))
      .orderBy(desc(deals.createdAt));

    return dealsData.map(deal => ({
      ...deal,
      brand: deal.brand || undefined,
    }));
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const [deal] = await db
      .insert(deals)
      .values(insertDeal)
      .returning();
    return deal;
  }

  async updateDealStatus(dealId: number, status: string): Promise<Deal> {
    const [deal] = await db
      .update(deals)
      .set({ status })
      .where(eq(deals.id, dealId))
      .returning();
    return deal;
  }

  async acceptDeal(dealId: number, creatorId: number): Promise<Deal> {
    const [deal] = await db
      .update(deals)
      .set({ creatorId, status: 'accepted' })
      .where(eq(deals.id, dealId))
      .returning();
    return deal;
  }

  // Message operations
  async getMessages(dealId: number): Promise<MessageWithSender[]> {
    const messagesData = await db
      .select({
        id: messages.id,
        dealId: messages.dealId,
        senderId: messages.senderId,
        content: messages.content,
        createdAt: messages.createdAt,
        sender: users,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.dealId, dealId))
      .orderBy(messages.createdAt);

    return messagesData.map(msg => ({
      ...msg,
      sender: msg.sender || undefined,
    }));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  // Subscription operations
  async getActiveSubscription(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.active, true)));
    return subscription || undefined;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async deactivateSubscription(userId: number): Promise<void> {
    await db
      .update(subscriptions)
      .set({ active: false })
      .where(eq(subscriptions.userId, userId));
  }
}

export const storage = new DatabaseStorage();
