import { randomBytes } from "node:crypto";
import type { FamilyInvite, FamilyRole } from "./types";
import { prisma } from "./prisma";

/**
 * Family-invite data access. An invite is a tokenized link
 * (/families/<id>/join?token=<token>) that lets the holder join a family.
 * Single-use isn't enforced — membership is an idempotent upsert at accept
 * time — but a link can be revoked by deleting the row.
 */
export interface InviteRepository {
  create(
    familyId: string,
    createdById: string,
    role?: FamilyRole,
  ): Promise<FamilyInvite>;
  getByToken(token: string): Promise<FamilyInvite | null>;
  listByFamily(familyId: string): Promise<FamilyInvite[]>;
  revoke(id: string, familyId: string): Promise<boolean>;
}

function toInvite(row: {
  id: string;
  token: string;
  familyId: string;
  role: string;
  createdAt: Date;
}): FamilyInvite {
  return {
    id: row.id,
    token: row.token,
    familyId: row.familyId,
    role: row.role as FamilyRole,
    createdAt: row.createdAt.toISOString(),
  };
}

function newToken(): string {
  return randomBytes(18).toString("base64url");
}

class PrismaInviteRepository implements InviteRepository {
  async create(
    familyId: string,
    createdById: string,
    role: FamilyRole = "MEMBER",
  ): Promise<FamilyInvite> {
    const row = await prisma.familyInvite.create({
      data: { token: newToken(), familyId, createdById, role },
    });
    return toInvite(row);
  }

  async getByToken(token: string): Promise<FamilyInvite | null> {
    const row = await prisma.familyInvite.findUnique({ where: { token } });
    return row ? toInvite(row) : null;
  }

  async listByFamily(familyId: string): Promise<FamilyInvite[]> {
    const rows = await prisma.familyInvite.findMany({
      where: { familyId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toInvite);
  }

  async revoke(id: string, familyId: string): Promise<boolean> {
    const result = await prisma.familyInvite.deleteMany({
      where: { id, familyId },
    });
    return result.count > 0;
  }
}

export const inviteRepository: InviteRepository = new PrismaInviteRepository();
