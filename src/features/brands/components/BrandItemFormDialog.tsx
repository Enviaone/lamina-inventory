import { useEffect } from 'react';
import { useForm, Controller, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';

import {
  brandItemFormSchema,
  type BrandItemFormSchema,
} from '@/schema/brand.schema';
import type { BrandItem } from '@/types/brand';

export interface BrandItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  initial?: BrandItem;
  onSave: (data: BrandItemFormSchema) => void;
}

export function BrandItemFormDialog({
  open,
  onOpenChange,
  brandName,
  initial,
  onSave,
}: BrandItemFormDialogProps) {
  const isEdit = !!initial;

  const form = useForm<BrandItemFormSchema>({
    resolver: zodResolver(brandItemFormSchema),
    defaultValues: {
      name: '',
    },
  });

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

  const onSubmit = (data: BrandItemFormSchema) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Item' : 'Add Item'}
      description={
        isEdit
          ? `Update details for this ${brandName} item.`
          : `Add a new item to ${brandName}.`
      }
    >
      <ItemForm
        form={form}
        onSubmit={onSubmit}
        isEdit={isEdit}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}

function ItemForm({
  form,
  onSubmit,
  isEdit,
  onCancel,
}: {
  form: UseFormReturn<BrandItemFormSchema>;
  onSubmit: (data: BrandItemFormSchema) => void;
  isEdit: boolean;
  onCancel: () => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <FieldLabel htmlFor="item-name">Item Name</FieldLabel>
              <Input id="item-name" placeholder="e.g. Brake Drum" {...field} />
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
          >
            Cancel
          </Button>
          <Button type="submit">{isEdit ? 'Save Changes' : 'Add Item'}</Button>
        </div>
      </form>
    </Form>
  );
}
