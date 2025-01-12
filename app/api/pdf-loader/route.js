import {NextResponse} from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const pdfUrl = 'https://diligent-ram-472.convex.cloud/api/storage/d6caaff8-dfa3-4976-882b-0f9128372a5a'

export async function GET(req) {
  try {
      const reqUrl = req.url; // Corrected to `url`
      const { searchParams } = new URL(reqUrl);
      const pdfUrl = searchParams.get('pdfUrl');

      if (!pdfUrl) {
          console.error("No PDF URL provided");
          return NextResponse.json({ error: "No PDF URL provided" }, { status: 400 });
      }

      console.log("Fetching PDF from URL:", pdfUrl);
      const response = await fetch(pdfUrl);

      if (!response.ok) {
          console.error("Failed to fetch PDF:", response.statusText);
          return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
      }

      const data = await response.blob();
      const loader = new WebPDFLoader(data);
      const docs = await loader.load();

      console.log("PDF loaded successfully. Splitting text...");
      let pdfTextContent = "";
      docs.forEach((doc) => {
          pdfTextContent += doc.pageContent;
      });

      const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 100,
          chunkOverlap: 0,
      });
      const output = await splitter.createDocuments([pdfTextContent]);

      const splitterList = output.map((doc) => doc.pageContent);
      console.log("Splitting complete. Returning response...");
      return NextResponse.json({ result: splitterList });
  } catch (error) {
      console.error("Error in pdf-loader API:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
