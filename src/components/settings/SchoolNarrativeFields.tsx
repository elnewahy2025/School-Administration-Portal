import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SchoolNarrativeFields({
  vision,
  mission,
  disabled,
  visionLabel,
  missionLabel,
}: {
  vision: string;
  mission: string;
  disabled: boolean;
  visionLabel: string;
  missionLabel: string;
}) {
  return (
    <>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="vision">{visionLabel}</Label>
        <Textarea id="vision" name="vision" defaultValue={vision} disabled={disabled} rows={3} />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="mission">{missionLabel}</Label>
        <Textarea id="mission" name="mission" defaultValue={mission} disabled={disabled} />
      </div>
    </>
  );
}
