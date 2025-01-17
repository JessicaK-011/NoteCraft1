import { mutation } from "./_generated/server";
import { v } from "convex/values"; 
import { query } from "./_generated/server";


export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const AddFileEntryToDb = mutation({
    args: v.object({
      fileId: v.string(),
      storageId: v.string(),
      fileName: v.string(),
      fileUrl: v.string(),
      createdBy: v.string(),
    }),
    handler: async (ctx, args) => {
      const result = await ctx.db.insert("pdfFiles", {
        fileId: args.fileId,
        fileName: args.fileName,
        storageId: args.storageId,
        fileUrl: args.fileUrl,
        createdBy: args.createdBy,
      });
      return "Inserted";
    },
  });

 export const getFileUrl = mutation({
  args: v.object({
    storageId: v.string(),
  }),
  handler: async (ctx, { storageId }) => {
    const url = await ctx.storage.getUrl(storageId);
    return url; // Return the file URL
  },
});

export const GetFileRecord = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('pdfFiles').filter((q) =>
      q.eq(q.field('fileId'), args.fileId)
    ).collect();

    console.log(result);

    // Return the first record, or handle an empty result case
    if (result.length > 0) {
      return result[0];  // Return the first entry if found
    } else {
      return null; // If no file is found with the provided fileId
    }
  },
});

export const GetUserFiles = query({
  args:{
    userEmail:v.optional(v.string())
  },
  handler:async(ctx,args)=>{
    if(!args?.userEmail){
      return ;
    }
    const result = await ctx.db.query('pdfFiles')
    .filter((q)=>q.eq(q.field('createdBy'),args.userEmail)).collect();

    return result;
  }
})