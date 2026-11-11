import { shopSocialContacts } from "@/lib/shop-contacts";
import { ContactAction } from "@/components/landing/landing-actions";
import styles from "@/components/landing/landing-sections.module.css";

export function ContactActions({
  light = false,
  product,
}: {
  light?: boolean;
  product?: string;
}) {
  const contacts = shopSocialContacts();
  return (
    <div className={styles.contactActions}>
      {(["Instagram", "Messenger"] as const).map((channel) => (
        <ContactAction
          key={channel}
          channel={channel}
          href={contacts.find((contact) => contact.label === channel)?.href}
          product={product}
          variant={light ? "light" : "outline"}
        />
      ))}
    </div>
  );
}
