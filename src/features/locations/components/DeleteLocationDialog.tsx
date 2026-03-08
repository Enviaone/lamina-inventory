import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Location } from '@/store/locations-store';

export interface DeleteLocationDialogProps {
  target: Location | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteLocationDialog({
  target,
  onOpenChange,
  onConfirm,
}: DeleteLocationDialogProps) {
  return (
    <AlertDialog
      open={!!target}
      onOpenChange={(v: boolean) => !v && onOpenChange(false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Location?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <span className="font-medium text-foreground">
                {target?.name}
              </span>{' '}
              will be permanently removed. This cannot be undone.
              {target?.isDefault && (
                <p className="mt-2 text-amber-600 font-medium text-sm">
                  ⚠ This is the default location. Another location will be
                  promoted automatically.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              if (target) onConfirm(target.id);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
