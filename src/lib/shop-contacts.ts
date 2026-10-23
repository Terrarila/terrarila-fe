import "server-only";
export function shopContacts() {
  return [
    { label: "Messenger", href: process.env.TERRALA_MESSENGER_URL },
    { label: "Zalo", href: process.env.TERRALA_ZALO_URL },
  ].filter((contact): contact is { label: string; href: string } => {
    if (!contact.href) return false;
    try { return new URL(contact.href).protocol === "https:"; } catch { return false; }
  });
}
