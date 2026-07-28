import { prisma } from '../prisma';
import crypto from 'crypto';

export class AdminService {
  /**
   * Hash password
   */
  private static hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * Initialize a default admin if none exists
   */
  static async initDefaultAdmin() {
    const count = await prisma.admin.count();
    if (count === 0) {
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: this.hashPassword('scout2026') // default password
        }
      });
    }
  }

  /**
   * Authenticate admin
   */
  static async authenticate(username: string, password: string): Promise<boolean> {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return false;
    
    return admin.password === this.hashPassword(password);
  }
}
