import { useEffect } from 'react';
import { useForm, Controller, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';

import { brandFormSchema, type BrandFormSchema } from '@/schema/brand.schema';
import type { Brand } from '@/types/brand';

export interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Brand;
  onSave: (data: BrandFormSchema) => void;
  isSubmitting?: boolean;
}

export function BrandFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  isSubmitting,
}: BrandFormDialogProps) {
  const isEdit = !!initial;

  const form = useForm<BrandFormSchema>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when dialog opens/closes or initial data changes
  useEffect(() => {
    if (open) {
      if (initial) {
        form.reset({
          name: initial.name,
        });
      } else {
        form.reset({
          name: '',
        });
      }
    }
  }, [open, initial, form]);

  const onSubmit = (data: BrandFormSchema) => {
    onSave(data);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Brand' : 'Add Brand'}
      description={
        isEdit
          ? 'Update the details for this brand below.'
          : 'Enter the details to register a new brand.'
      }
    >
      <BrandFormInputs
        form={form}
        onSubmit={onSubmit}
        isEdit={isEdit}
        onCancel={() => onOpenChange(false)}
        isSubmitting={isSubmitting}
      />
    </ResponsiveDialog>
  );
}

function BrandFormInputs({
  form,
  onSubmit,
  isEdit,
  onCancel,
  isSubmitting,
}: {
  form: UseFormReturn<BrandFormSchema>;
  onSubmit: (data: BrandFormSchema) => void;
  isEdit: boolean;
  onCancel: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <FieldLabel htmlFor="brand-name">Brand Name</FieldLabel>
              <Input
                id="brand-name"
                placeholder="e.g. Ashok Leyland"
                {...field}
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="mt-2 sm:mt-0"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Add Brand'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
