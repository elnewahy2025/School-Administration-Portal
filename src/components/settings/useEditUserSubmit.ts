import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateUserAction, type UpdateUserInput } from "@/actions/settings/updateUserAction";

export function useEditUserSubmit(onClose: () => void) {
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const submit = (input: UpdateUserInput) => {
    startTransition(async () => {
      const res = await updateUserAction(input);
      if (res.success) {
        toast.success(tCommon("saved"));
        onClose();
      } else {
        toast.error(res.error ?? tCommon("error"));
      }
    });
  };

  return { isPending, submit };
}
