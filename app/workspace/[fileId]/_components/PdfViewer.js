import React from "react";

function PdfViewer({ fileUrl }) {
  console.log(fileUrl);

  if (!fileUrl) {
    return <div>File not found</div>;
  }

  return (
    <div>
      <div style={{ height: "100vh" }}>
        <iframe
          src={fileUrl+"#toolbar=0"}
          height="100%"
          width="100%"
          className="h-[100vh]"
        />
      </div>
    </div>
  );
}

export default PdfViewer;
