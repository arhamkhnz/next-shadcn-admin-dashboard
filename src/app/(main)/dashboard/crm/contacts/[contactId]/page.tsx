import { ContactDetail } from "./_components/contact-detail";

export default async function ContactDetailPage({ params }: { params: Promise<{ contactId: string }> }) {
  const { contactId } = await params;

  return <ContactDetail contactId={contactId} />;
}
