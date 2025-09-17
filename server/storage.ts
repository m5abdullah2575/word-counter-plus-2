import { type User, type InsertUser, type Upload, type InsertUpload } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Upload methods
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUpload(id: string): Promise<Upload | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private uploads: Map<string, Upload>;

  constructor() {
    this.users = new Map();
    this.uploads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createUpload(insertUpload: InsertUpload): Promise<Upload> {
    const id = randomUUID();
    const upload: Upload = { 
      ...insertUpload, 
      id, 
      uploadedAt: new Date() 
    };
    this.uploads.set(id, upload);
    return upload;
  }

  async getUpload(id: string): Promise<Upload | undefined> {
    return this.uploads.get(id);
  }
}

export const storage = new MemStorage();
