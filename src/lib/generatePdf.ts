import { pdf, type DocumentProps } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { createElement, type ReactElement } from "react";
import { EstimatePdf } from "@/lib/EstimatePdf";
import type { ClientInfo, EstimateResult, WizardSelections } from "@/types/estimate";

async function tryLoadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/logo.jpg");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function downloadEstimatePdf(
  selections: WizardSelections,
  estimate: EstimateResult,
  reportId: string,
  client?: ClientInfo | null,
) {
  const [qrDataUrl, logoDataUrl] = await Promise.all([
    QRCode.toDataURL(`ARCHIUNITE-REPORT:${reportId}`, { margin: 1, width: 120 }),
    tryLoadLogoDataUrl(),
  ]);

  const pdfDocument = createElement(EstimatePdf, {
    selections,
    estimate,
    client,
    reportId,
    qrDataUrl,
    logoDataUrl,
  }) as ReactElement<DocumentProps>;

  const blob = await pdf(pdfDocument).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Archiunite-Estimate-${reportId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
