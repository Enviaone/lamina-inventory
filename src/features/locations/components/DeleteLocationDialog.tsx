import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { AlertTriangleIcon } from 'lucide-react';

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
                <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 mt-4">
                  <AlertTriangleIcon />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    This cannot be deleted as it is the default location.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={target?.isDefault}
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
