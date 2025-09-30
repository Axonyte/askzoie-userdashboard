// dto/create-webhook.dto.ts
export class CreateWebhookDto {
    id: string;
    event_version: string;
    create_time: string;
    resource_type: string;
    event_type: string; // e.g., BILLING.SUBSCRIPTION.ACTIVATED
    summary: string;
    resource: any; // Subscription resource
    links: any[];
}
