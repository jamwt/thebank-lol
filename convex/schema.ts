import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accounts: defineTable({
    balance: v.float64(),
    holder: v.string(),
  }).index("by_holder", ["holder"]),
});
