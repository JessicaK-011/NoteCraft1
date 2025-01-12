import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { api } from "./_generated/api.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Ingest action triggered");
    console.log("SplitText:", args.splitText);
    console.log("FileId:", args.fileId);

    if (!args.splitText || args.splitText.length === 0) {
      console.error("SplitText is empty or invalid.");
      throw new Error("SplitText is empty or invalid.");
    }

    try {
      const metadata = { fileId: args.fileId };

      const store = await ConvexVectorStore.fromTexts(
        args.splitText,
        metadata, // Pass metadata as the second argument
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyBEX-g0bC0gqjnfkU7k25NHc24D5DbmkNE",
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );
      console.log("Documents successfully inserted into the schema:", store);
    } catch (error) {
      console.error("Error inserting documents:", error);
      throw new Error("Failed to insert documents into the schema.");
    }
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const vectorStore = new ConvexVectorStore(
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyBEX-g0bC0gqjnfkU7k25NHc24D5DbmkNE",
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );

      const searchResults = await vectorStore.similaritySearch(args.query, 1);

      // Filter results based on new metadata format
      const filteredResults = searchResults.filter(
        (result) => result.metadata.fileId === args.fileId
      );
      console.log("Filtered Results:", filteredResults);
      return JSON.stringify(filteredResults);
    } catch (error) {
      console.error("Error in search action:", error);
      throw new Error("Failed to process the search action.");
    }
  },
});

export const updateMetadataFormat = action({
  args: {},
  handler: async (ctx) => {
    try {
      const documentsTable = await ctx.db.query("documents").collect();
      for (const doc of documentsTable) {
        if (typeof doc.metadata === "string") {
          // Convert metadata from string to object format
          const updatedMetadata = { fileId: doc.metadata };
          await ctx.db.update(doc._id, { metadata: updatedMetadata });
          console.log(`Updated metadata for document ${doc._id}`);
        }
      }
      console.log("Metadata format update completed successfully.");
    } catch (error) {
      console.error("Error updating metadata format:", error);
      throw new Error("Failed to update metadata format.");
    }
  },
});
