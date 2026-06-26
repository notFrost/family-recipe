-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed the demo user BEFORE the Recipe table is redefined with its new
-- authorId -> User.id foreign key. Existing recipes were seeded with
-- authorId = 'user-1'; this row guarantees that FK is satisfied when the
-- deferred foreign-key check runs at the end of the RedefineTables block.
-- passwordHash is a bcrypt hash of "password123". (The seed script later
-- upserts this same user idempotently.)
INSERT INTO "User" ("id", "email", "name", "passwordHash", "createdAt")
VALUES ('user-1', 'demo@recipes.app', 'Demo Cook', '$2b$10$l0dP3AJEorA2guk2Fe728.WcDKgpzUogiaU.U9yyCjj4mPUtmyPY6', CURRENT_TIMESTAMP);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "ingredientsJson" TEXT NOT NULL,
    "stepsJson" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recipe" ("authorId", "createdAt", "description", "id", "imageUrl", "ingredientsJson", "stepsJson", "title") SELECT "authorId", "createdAt", "description", "id", "imageUrl", "ingredientsJson", "stepsJson", "title" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE INDEX "Recipe_authorId_idx" ON "Recipe"("authorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
