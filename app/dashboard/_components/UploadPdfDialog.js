"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import uuid4 from "uuid4";
import axios from "axios";
import { ingest } from "@/convex/myAction";
import { toast } from "sonner";

function UploadPdfDialog({ children ,isMaxFile}) {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const { user } = useUser();
  const [open,setOpen]=useState(false);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState();

  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const OnUpload = async () => {
    setLoading(true);
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    console.log("StorageId", storageId);
    const fileId = uuid4();
    const fileUrl = await getFileUrl({ storageId: storageId });
    // Step 3: Save the newly allocated storage id to the database
    const resp = await addFileEntry({
      fileId: fileId,
      storageId: storageId,
      fileName: fileName ?? "Untitled file",
      fileUrl: fileUrl,
      createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
    });
    console.log(resp);

    //API call to fetch Process Data
    const ApiResp = await axios.get(`/api/pdf-loader?pdfUrl=${fileUrl}`);
console.log("API Response:", ApiResp);


    const embeddResult = await embeddDocument({
      splitText: ApiResp.data.result,
      fileId: fileId,
    });
    console.log("Embedding Result:", embeddResult);

    setLoading(false);
    setOpen(false);

    toast('File is ready!')
  };
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} disabled={isMaxFile} className="w-full">
          +Upload PDF File
        </Button>
      </DialogTrigger>
  
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF file</DialogTitle>
          <DialogDescription asChild>
            <div className="">
              <h2> Select a file to upload </h2>
              <div className="mt-2 gap-2 p-3 rounded-md border">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => OnFileSelect(event)}
                />
              </div>
              <div className="mt-3">
                <label>File Name</label>
                <Input
                  placeholder="file name"
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
  
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)} // Manually close the dialog
          >
            Close
          </Button>
          <Button onClick={OnUpload} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
}

export default UploadPdfDialog;
