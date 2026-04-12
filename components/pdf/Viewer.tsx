"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const ReactPdfViewer = ({ url }: { url: string }) => {
  return (
    <div className="w-full flex justify-center">
      <Document file={url} loading="Loading PDF…">
        <Page pageNumber={1} width={600} />
      </Document>
    </div>
  );
};
