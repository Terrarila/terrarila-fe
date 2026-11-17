import "server-only";

const DEFAULT_MESSENGER_URL = "https://m.me/1417505371445202";

type Contact = { label: string; href: string | undefined };
function configuredContacts(contacts: Contact[]) {
  return contacts.filter(
    (contact): contact is { label: string; href: string } => {
      if (!contact.href) return false;
      try {
        return new URL(contact.href).protocol === "https:";
      } catch {
        return false;
      }
    },
  );
}
export function shopContacts() {
  return configuredContacts([
    { label: "Messenger", href: process.env.TERRALA_MESSENGER_URL || DEFAULT_MESSENGER_URL },
    { label: "Zalo", href: process.env.TERRALA_ZALO_URL },
  ]);
}
export function shopSocialContacts() {
  return configuredContacts([
    {
      label: "Instagram",
      href:
        process.env.TERRALA_INSTAGRAM_URL ||
        "https://www.instagram.com/petiteterra_/",
    },
    { label: "Messenger", href: process.env.TERRALA_MESSENGER_URL || DEFAULT_MESSENGER_URL },
  ]);
}
