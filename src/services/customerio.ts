import { APIClient, SendEmailRequest } from "customerio-node";

interface TransactionalEmailWithTemplateParams {
  transactionalMessageId: string | number;
  identifiers: { id: string | number } | { email: string };
  to: string;
  messageData?: Record<string, unknown>;
}

interface TransactionalEmailWithoutTemplateParams {
  identifiers: { id: string | number } | { email: string };
  to: string;
  from: string;
  subject: string;
  body: string;
  messageData?: Record<string, unknown>;
}

interface CustomerIOResponse {
  delivery_id: string;
  queued_at: number;
}

interface CustomerIOError extends Error {
  statusCode?: number;
}

function getCustomerIOClient(): APIClient {
  const apiKey = process.env.CUSTOMERIO_API_KEY;
  if (!apiKey) {
    throw new Error("Missing CUSTOMERIO_API_KEY environment variable");
  }
  return new APIClient(apiKey);
}

export async function sendTransactionalEmailWithTemplate(
  params: TransactionalEmailWithTemplateParams
): Promise<CustomerIOResponse> {
  const client = getCustomerIOClient();

  const request = new SendEmailRequest({
    transactional_message_id: params.transactionalMessageId,
    identifiers: params.identifiers,
    to: params.to,
    message_data: params.messageData,
  });

  try {
    const response = await client.sendEmail(request);
    return response as CustomerIOResponse;
  } catch (error) {
    const customerIOError = error as CustomerIOError;
    console.error(
      "Customer.io email error:",
      customerIOError.statusCode,
      customerIOError.message
    );
    throw customerIOError;
  }
}

export async function sendTransactionalEmail(
  params: TransactionalEmailWithoutTemplateParams
): Promise<CustomerIOResponse> {
  const client = getCustomerIOClient();

  const request = new SendEmailRequest({
    identifiers: params.identifiers,
    to: params.to,
    from: params.from,
    subject: params.subject,
    body: params.body,
    message_data: params.messageData,
  });

  try {
    const response = await client.sendEmail(request);
    return response as CustomerIOResponse;
  } catch (error) {
    const customerIOError = error as CustomerIOError;
    console.error(
      "Customer.io email error:",
      customerIOError.statusCode,
      customerIOError.message
    );
    throw customerIOError;
  }
}