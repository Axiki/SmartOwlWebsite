// Simple in-memory storage for development
// In production, this would be replaced with a proper database

export interface IStorage {
  getUser(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, any> = new Map();
  private usersByUsername: Map<string, any> = new Map();

  async getUser(id: string): Promise<any> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<any> {
    return this.usersByUsername.get(username) || null;
  }

  async createUser(user: any): Promise<any> {
    const id = `user_${Date.now()}`;
    const newUser = { ...user, id, createdAt: new Date() };
    
    this.users.set(id, newUser);
    this.usersByUsername.set(user.username, newUser);
    
    return newUser;
  }
}

export const storage = new MemStorage();