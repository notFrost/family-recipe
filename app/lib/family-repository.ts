import type { Family, FamilyMember, FamilyRole } from "./types";
import { prisma } from "./prisma";

/**
 * Shape of a Prisma Family row (raw from the DB, before mapping to app type).
 */
interface FamilyRow {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

/**
 * Shape of a Prisma FamilyMember row including the user's name + avatar.
 */
interface FamilyMemberRowWithUser {
  id: string;
  familyId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  user: { name: string | null; image: string | null };
}

/**
 * Repository abstraction for family data access.
 *
 * Mirrors the style of `recipe-repository.ts`: an interface + Prisma
 * implementation + exported singleton.
 */
export interface FamilyRepository {
  getFamilyById(id: string): Promise<Family | null>;
  getFamiliesForUser(userId: string): Promise<Family[]>;
  createFamily(input: { name: string; ownerId: string }): Promise<Family>;
  getFamilyMembers(familyId: string): Promise<FamilyMember[]>;
  getMemberRole(familyId: string, userId: string): Promise<FamilyRole | null>;
  isMember(familyId: string, userId: string): Promise<boolean>;
  addMember(familyId: string, userId: string): Promise<FamilyMember>;
  removeMember(familyId: string, userId: string): Promise<boolean>;
  transferOwnership(familyId: string, newOwnerId: string): Promise<boolean>;
  deleteFamily(id: string): Promise<boolean>;
}

/** Map a Prisma Family row to the app Family type. */
function toFamily(row: FamilyRow): Family {
  return {
    id: row.id,
    name: row.name,
    ownerId: row.ownerId,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Map a Prisma FamilyMember row (with joined user name) to the app FamilyMember type. */
function toFamilyMember(row: FamilyMemberRowWithUser): FamilyMember {
  return {
    id: row.id,
    familyId: row.familyId,
    userId: row.userId,
    role: row.role as FamilyRole,
    joinedAt: row.joinedAt.toISOString(),
    userName: row.user.name ?? null,
    userImage: row.user.image ?? null,
  };
}

/** Include clause for member queries that need the user name + avatar. */
const memberInclude = {
  user: { select: { name: true, image: true } },
} as const;

class PrismaFamilyRepository implements FamilyRepository {
  async getFamilyById(id: string): Promise<Family | null> {
    const row = await prisma.family.findUnique({ where: { id } });
    return row ? toFamily(row) : null;
  }

  async getFamiliesForUser(userId: string): Promise<Family[]> {
    // Find all FamilyMember rows for this user, then fetch the families.
    const memberships = await prisma.familyMember.findMany({
      where: { userId },
      select: { family: true },
      orderBy: { family: { createdAt: "desc" } },
    });
    return memberships.map((m) => toFamily(m.family));
  }

  async createFamily(input: {
    name: string;
    ownerId: string;
  }): Promise<Family> {
    // Transaction: create the family AND the owner as a member with role OWNER.
    return await prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          name: input.name,
          ownerId: input.ownerId,
        },
      });

      await tx.familyMember.create({
        data: {
          familyId: family.id,
          userId: input.ownerId,
          role: "OWNER",
        },
      });

      return toFamily(family);
    });
  }

  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    const rows = await prisma.familyMember.findMany({
      where: { familyId },
      orderBy: { joinedAt: "desc" },
      include: memberInclude,
    });
    return rows.map(toFamilyMember);
  }

  async getMemberRole(
    familyId: string,
    userId: string,
  ): Promise<FamilyRole | null> {
    const row = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId } },
    });
    return row ? (row.role as FamilyRole) : null;
  }

  async isMember(familyId: string, userId: string): Promise<boolean> {
    const count = await prisma.familyMember.count({
      where: { familyId, userId },
    });
    return count > 0;
  }

  async addMember(familyId: string, userId: string): Promise<FamilyMember> {
    // Idempotent: upsert on the unique [familyId, userId] constraint.
    const row = await prisma.familyMember.upsert({
      where: { familyId_userId: { familyId, userId } },
      update: {}, // no-op if already exists
      create: {
        familyId,
        userId,
        role: "MEMBER",
      },
      include: memberInclude,
    });
    return toFamilyMember(row);
  }

  async removeMember(
    familyId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      await prisma.familyMember.delete({
        where: { familyId_userId: { familyId, userId } },
      });
      return true;
    } catch {
      // Row doesn't exist or other constraint violation — not a member.
      return false;
    }
  }

  async transferOwnership(
    familyId: string,
    newOwnerId: string,
  ): Promise<boolean> {
    // Verify the family exists.
    const family = await prisma.family.findUnique({ where: { id: familyId } });
    if (!family) {
      return false;
    }

    // Verify newOwnerId is currently a member of this family.
    const memberRow = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId: newOwnerId } },
    });
    if (!memberRow) {
      return false;
    }

    const oldOwnerId = family.ownerId;

    await prisma.$transaction(async (tx) => {
      // Transfer ownership on the Family row.
      await tx.family.update({
        where: { id: familyId },
        data: { ownerId: newOwnerId },
      });

      // Demote the old owner to MEMBER.
      await tx.familyMember.update({
        where: { familyId_userId: { familyId, userId: oldOwnerId } },
        data: { role: "MEMBER" },
      });

      // Promote the new owner to OWNER.
      await tx.familyMember.update({
        where: { familyId_userId: { familyId, userId: newOwnerId } },
        data: { role: "OWNER" },
      });
    });

    return true;
  }

  async deleteFamily(id: string): Promise<boolean> {
    const family = await prisma.family.findUnique({ where: { id } });
    if (!family) {
      return false;
    }

    await prisma.$transaction(async (tx) => {
      // Re-scope all FAMILY recipes to PRIVATE before deleting the family.
      await tx.recipe.updateMany({
        where: { familyId: id },
        data: { visibility: "PRIVATE", familyId: null },
      });

      // Delete the family (FamilyMember rows cascade via onDelete: Cascade).
      await tx.family.delete({ where: { id } });
    });

    return true;
  }
}

export const familyRepository: FamilyRepository =
  new PrismaFamilyRepository();
