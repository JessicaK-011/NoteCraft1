import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(), // Ensure "name" is included
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user?.length === 0) {
      await ctx.db.insert("users", {
        email: args.email,
        userName: args.name, // Map "name" to "userName"
        imageUrl: args.imageUrl,
        upgrade:false
      });
      return "Inserted New User...";
    }
    return "User already exists.";
  },
});

export const userUpgradePlan = mutation({
  args: {
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.userEmail)).collect();

      // Check if the result array is empty
      if (result.length === 0) {
        return "User not found"; // Handle the case where no user matches
      }

      // Access the first user's `_id` safely
      await ctx.db.patch(result[0]._id, { upgrade: true });
      return "Success";
    } catch (error) {
      console.error("Error in userUpgradePlan:", error);
      return "An error occurred while upgrading the user.";
    }
  },
});


export const GetUserInfo=query({
  
  args:{
    userEmail:v.optional(v.string())
  },
  handler:async(ctx,args)=>{
    if(!args.userEmail){
      return ;
    }
    const result=await ctx.db.query('users').filter(q=>q.eq(q.field('email'),args?.userEmail)).collect();
    return result[0];
    
  }
});
