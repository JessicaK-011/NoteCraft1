import { chatSession } from "@/configs/AiModel";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useAction, useMutation } from "convex/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  HighlighterIcon,
  ItalicIcon,
  SparkleIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function EditorExtensions({ editor }) {
  const SearchAI = useAction(api.myAction.search);
  const saveNotes=useMutation(api.notes.AddNotes);
  const {user}=useUser();
  const { fileId } = useParams();
  const onAiClick = async () => {
    toast("Please wait..AI is generating the answer")
    // Get the selected text (question) from the editor
    const selectedText = editor.state.doc
      .textBetween(editor.state.selection.from, editor.state.selection.to, " ")
      .trim(); // Trim to remove extra spaces or line breaks

    console.log("Selected Text:", selectedText);

    if (!selectedText) {
      console.error("No text selected!");
      return;
    }

    // Fetch the AI's response using the selected text as a query
    const result = await SearchAI({
      query: selectedText,
      fileId: fileId,
    });

    const unformattedAnswer = JSON.parse(result);
    let fullAnswerContent = "";
    unformattedAnswer?.forEach((item) => {
      fullAnswerContent += item.pageContent.trim(); // Concatenate content with trimmed spaces
    });

    if (!fullAnswerContent) {
      console.error("No relevant content found for the query.");
      return;
    }

    // Generate a clean answer using the AI model
    const prompt = `For the question: "${selectedText}" and the given content: "${fullAnswerContent}", 
        generate a concise, clean, and well-structured HTML response with no unnecessary prefixes or formatting. Only return the answer content.`;

    const aiModelResult = await chatSession.sendMessage(prompt);
    let finalAnswer = aiModelResult.response
      .text()
      .replace(/```/g, "") // Remove Markdown formatting
      .replace(/^html\s*/i, "") // Remove unintended "Answer: html" or similar prefixes
      .trim();

    if (!finalAnswer) {
      console.error("AI model did not return an answer.");
      return;
    }

    // Prepare the content to insert directly
    const contentToInsert = `
        <p><strong>Answer:</strong> ${finalAnswer}</p>
    `.replace(/[\r\n]+/g, ""); // Clean up unnecessary newlines

    // Insert the content at the current selection without altering font size or style
    editor.commands.insertContentAt(editor.state.selection.to, contentToInsert);

    saveNotes({
      notes: editor?.getHTML() || "", // Default to an empty string if getHTML() fails
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
    });
    
  };

  return (
    editor && (
      <div className="p-3">
        {/* Editor Controls */}
        <div className="control-group">
          <div className="button-group flex gap-2 flex-wrap">
            {/* Bold */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "text-blue-500" : ""}
            >
              <BoldIcon />
            </button>

            {/* Italic */}
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "text-blue-500" : ""}
            >
              <ItalicIcon />
            </button>

            {/* Underline */}
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "text-blue-500" : ""}
            >
              <UnderlineIcon />
            </button>

            {/* Highlight Button */}
            <button
              onClick={() => {
                // Check if highlight is already active
                if (editor.isActive("highlight")) {
                  // If active, remove highlight
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  // If not active, apply blue highlight
                  editor
                    .chain()
                    .focus()
                    .toggleHighlight({ color: "#74c0fc" })
                    .run();
                }
              }}
              className={editor?.isActive("highlight") ? "text-blue-500" : ""}
            >
              <HighlighterIcon />
            </button>

            {/* Heading 1 */}
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "text-blue-500" : ""
              }
            >
              <Heading1Icon />
            </button>

            {/* Heading 2 */}
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "text-blue-500" : ""
              }
            >
              <Heading2Icon />
            </button>

            {/* Align Left */}
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "text-blue-500" : ""
              }
            >
              <AlignLeftIcon />
            </button>

            {/* Align Center */}
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "text-blue-500" : ""
              }
            >
              <AlignCenterIcon />
            </button>

            {/* Align Right */}
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "text-blue-500" : ""
              }
            >
              <AlignRightIcon />
            </button>

            {/* Strike */}
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "text-blue-500" : ""}
            >
              <StrikethroughIcon />
            </button>

            {/* Subscript */}
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive("subscript") ? "text-blue-500" : ""}
            >
              <SubscriptIcon />
            </button>

            {/* Superscript */}
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive("superscript") ? "text-blue-500" : ""}
            >
              <SuperscriptIcon />
            </button>

            {/*AI Icon*/}
            <button
              onClick={() => onAiClick()}
              className={"hover:text-blue-500"}
            >
              <SparkleIcon />
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditorExtensions;
