import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const data = await req.json();

  const msg = {
    to: "support@mendi.app",
    from: "hei@mendi.app",
    subject: "Ny forespørsel fra Mendi-appen",
    text: `
E-post: ${data.repairDetails?.email || "Ikke oppgitt"}
By: ${data.repairDetails?.city || "Ikke oppgitt"}
Forespørsel: ${data.repairDetails?.additionalDetails}
---
Full state:
${JSON.stringify(data, null, 2)}
    `,
    html: `
      <h2>Ny forespørsel fra Mendi-appen</h2>
      <p><strong>E-post:</strong> ${data.repairDetails?.email || "Ikke oppgitt"}</p>
      <p><strong>By:</strong> ${data.repairDetails?.city || "Ikke oppgitt"}</p>
      <p><strong>Forespørsel:</strong><br/>${data.repairDetails?.additionalDetails}</p>
      <hr/>
      <h3>Full state:</h3>
      <pre style="font-size:13px; background:#f6f6f6; padding:10px; border-radius:6px;">${JSON.stringify(data, null, 2)}</pre>
    `,
  };

  try {
    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let message = "Unknown error";
    if (error && typeof error === "object" && "message" in error) {
      message = (error as { message: string }).message;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 