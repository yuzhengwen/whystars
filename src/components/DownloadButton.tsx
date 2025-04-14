import React from "react";
import { Download } from "lucide-react";
import { useTimetableStore } from "@/stores/useTimetableStore";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const DownloadButton = () => {
  const { modIndexesBasic } = useTimetableStore();
  function downloadJson() {
    const fileName = "timetable.json";
    const contentType = "text/plain";
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(modIndexesBasic)], {
      type: contentType,
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }
  function downloadPdf() {
    const input = document.getElementById("timetable-app") as HTMLElement;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("portrait", "mm", "a4");
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const pageRatio = pageWidth / pageHeight;
      if (ratio > pageRatio) {
        // canvas is wider than page, scale by width
        const scale = pageWidth / canvasWidth;
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, canvasHeight * scale);
      } else {
        // canvas is taller than page, scale by height
        const scale = pageHeight / canvasHeight;
        pdf.addImage(imgData, "PNG", 0, 0, canvasWidth * scale, pageHeight);
      }
      //pdf.output("dataurlnewwindow");
      pdf.save("download.pdf");
    });
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:cursor-pointer">
          <Download />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col">
            <DropdownMenuItem onClick={downloadJson} className="w-fit">
              Download JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadPdf} className="w-fit">
              Download PDF
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DownloadButton;
