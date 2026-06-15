import { crud, request } from "./client";
import type { ContactMessage, ContactReply } from "./types";

export const contactsApi = crud<
  ContactMessage,
  Omit<ContactMessage, "id" | "isRead">,
  Partial<ContactMessage>
>("/contact");

export const contactRepliesApi = {
  create: (contactId: string, message: string) =>
    request<ContactReply>(`/contact/${contactId}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
