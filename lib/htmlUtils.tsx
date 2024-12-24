import { jsPDF } from "jspdf";
import { createRoot } from "react-dom/client";
import GenerateBarcode from "@/components/GenerateBarcode";
import html2canvas from "html2canvas";
import GenerateAztecCode from "@/components/GenerateAztecCode";

export interface BarInfo {
  pages: {
    onlyBarcode: boolean;
    barcode: string;
    qrcode?: string;
  }[][][];
}

export const generateBarcodePDF = async ({ pages }: BarInfo) => {
  const A4_WIDTH = 210;
  const A4_HEIGHT = 297;
  const DPI = 96;
  const MM_TO_PX = DPI / 25.4;

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const tempContainer = document.createElement("div");
  tempContainer.style.width = `${A4_WIDTH * MM_TO_PX}px`;
  tempContainer.style.height = `${A4_HEIGHT * MM_TO_PX}px`;
  tempContainer.style.position = "absolute";
  tempContainer.style.top = "0";
  tempContainer.style.left = "0";
  tempContainer.style.background = "white";
  tempContainer.style.overflow = "hidden";
  document.body.appendChild(tempContainer);

  const root = createRoot(tempContainer);

  for (let pageNum = 0; pageNum < pages.length; pageNum++) {
    const page = pages[pageNum];
    const barcodes = [];

    for (let row = 0; row < page.length; row++) {
      for (let col = 0; col < page[0].length; col++) {
        const code = page[row][col];
        barcodes.push(
          <div
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              top: row * 29 * MM_TO_PX + 10,
              left: col * 69 * MM_TO_PX + 10,
              width: code.onlyBarcode ? `${60 * MM_TO_PX}px` : "100%",
              height: `${20 * MM_TO_PX}px`,
            }}
          >
            <div className={"flex"}>
              <div
                style={{
                  width: `${60 * MM_TO_PX}px`,
                }}
              >
                <GenerateBarcode value={code.barcode} />
              </div>
              {!code.onlyBarcode && (
                <div
                  className={"text-sm"}
                  style={{
                    width: "220px",
                    marginLeft: "30px",
                  }}
                >
                  Don&#39;t share this token with others. Anyone who have this
                  can track your file status.
                </div>
              )}
              {!code.onlyBarcode && (
                <div
                  className={"text-sm"}
                  style={{
                    width: "180px",
                  }}
                >
                  <p>URL: https://fts.brur.ac.bd/</p>
                  <p>UID: {code.qrcode}</p>
                </div>
              )}
              {!code.onlyBarcode && (
                <div className={"w-8"}>
                  <GenerateAztecCode
                    value={`https://fts.brur.com.bd/f/${code.qrcode}`}
                  />
                </div>
              )}
            </div>
          </div>,
        );
      }
    }

    root.render(<>{barcodes}</>);

    await new Promise((resolve) => setTimeout(resolve, 200));

    await html2canvas(tempContainer).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      if (pageNum > 0) {
        doc.addPage();
      }
      doc.addImage(imgData, "PNG", 0, 0, A4_WIDTH, A4_HEIGHT);
    });
  }

  document.body.removeChild(tempContainer);
  const dateTimeStr = new Date().toISOString();
  doc.save(dateTimeStr + "-barcodes.pdf");
};
