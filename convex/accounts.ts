import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

export const deposit = mutation({
  args: {
    holder: v.string(),
    amount: v.number(),
  },
  handler: async ({ db }, { holder, amount }) => {
    const existing = await db
      .query("accounts")
      .withIndex("by_holder", (q) => q.eq("holder", holder))
      .first();

    await db.patch(existing!._id, {
      balance: existing!.balance + amount,
    });
  },
});

export const transfer = mutation({
  args: {
    from: v.string(),
    to: v.string(),
    amount: v.number(),
  },
  handler: async ({ db }, { from, to, amount }) => {
    const fromAccount = await db
      .query("accounts")
      .withIndex("by_holder", (q) => q.eq("holder", from))
      .first();
    const toAccount = await db
      .query("accounts")
      .withIndex("by_holder", (q) => q.eq("holder", to))
      .first();

    if (!fromAccount || !toAccount) {
      throw new ConvexError("Account not found");
    }

    if (fromAccount.balance < amount) {
      throw new ConvexError("Insufficient balance");
    }

    await db.patch(fromAccount._id, {
      balance: fromAccount.balance - amount,
    });
    await db.patch(toAccount._id, {
      balance: toAccount.balance + amount,
    });
  },
});
