import { useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeadershipFieldPair({
  idAr,
  idEn,
  labelAr,
  labelEn,
  defaultValueAr,
  defaultValueEn,
  disabled,
}: {
  idAr: string;
  idEn: string;
  labelAr: string;
  labelEn: string;
  defaultValueAr: string;
  defaultValueEn: string;
  disabled: boolean;
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={idAr}>{labelAr}</Label>
        <Input id={idAr} name={idAr} defaultValue={defaultValueAr} disabled={disabled} />
      </div>
      {isArabic ? (
        <input type="hidden" id={idEn} name={idEn} value={defaultValueEn} />
      ) : (
        <div className="space-y-2">
          <Label htmlFor={idEn}>{labelEn}</Label>
          <Input id={idEn} name={idEn} defaultValue={defaultValueEn} disabled={disabled} />
        </div>
      )}
    </>
  );
}
