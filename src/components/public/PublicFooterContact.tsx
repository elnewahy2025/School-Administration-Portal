import { PhoneIcon, MailIcon, MapPinIcon } from "lucide-react";

export function PublicFooterContact({
  phone,
  email,
  address,
}: {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}) {
  if (!phone && !email && !address) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
      {phone && (
        <div className="flex items-center gap-1.5" dir="ltr">
          <PhoneIcon className="size-3.5 text-primary" />
          <span>{phone}</span>
        </div>
      )}
      {email && (
        <div className="flex items-center gap-1.5" dir="ltr">
          <MailIcon className="size-3.5 text-primary" />
          <span>{email}</span>
        </div>
      )}
      {address && (
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="size-3.5 text-primary" />
          <span>{address}</span>
        </div>
      )}
    </div>
  );
}
