import { NextRequest, NextResponse } from "next/server";
import {
  sendTransactionalEmailWithTemplate,
  sendTransactionalEmail,
} from "@/services/customerio";

interface TransactionalEmailWithTemplateBody {
  transactionalMessageId: string | number;
  identifiers: { id: string | number } | { email: string };
  to: string;
  messageData?: Record<string, unknown>;
}

interface TransactionalEmailWithoutTemplateBody {
  identifiers: { id: string | number } | { email: string };
  to: string;
  from: string;
  subject: string;
  body: string;
  messageData?: Record<string, unknown>;
}

type RequestBody =
  | TransactionalEmailWithTemplateBody
  | TransactionalEmailWithoutTemplateBody;

function isTemplateEmail(
  body: RequestBody
): body is TransactionalEmailWithTemplateBody {
  return "transactionalMessageId" in body;
}

export async function POST(req: NextRequest) {
  try {
    const data: RequestBody = await req.json();

    if (!data.identifiers || !data.to) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: identifiers, to" },
        { status: 400 }
      );
    }

    if (isTemplateEmail(data)) {
      const response = await sendTransactionalEmailWithTemplate({
        transactionalMessageId: data.transactionalMessageId,
        identifiers: data.identifiers,
        to: data.to,
        messageData: data.messageData,
      });
      return NextResponse.json({ success: true, data: response });
    } else {
      if (!data.from || !data.subject || !data.body) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields: from, subject, body",
          },
          { status: 400 }
        );
      }

      const response = await sendTransactionalEmail({
        identifiers: data.identifiers,
        to: data.to,
        from: data.from,
        subject: data.subject,
        body: data.body,
        messageData: data.messageData,
      });
      return NextResponse.json({ success: true, data: response });
    }
  } catch (error: unknown) {
    let message = "Unknown error";
    let statusCode = 500;

    if (error && typeof error === "object") {
      if ("message" in error) {
        message = (error as { message: string }).message;
      }
      if ("statusCode" in error) {
        statusCode = (error as { statusCode: number }).statusCode;
      }
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode }
    );
  }
}
