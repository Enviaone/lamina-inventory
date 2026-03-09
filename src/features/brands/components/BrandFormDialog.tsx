import { useEffect } from 'react';
import { useForm, Controller, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { ResponsiveDialog } from '@/components/shared/ResponsiveDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { brandFormSchema, type BrandFormSchema } from '@/schema/brand.schema';
import {
  BRAND_COLOR_MAP,
  type BrandColorKey,
} from '@/features/brands/constants/colorMap';
import type { Brand } from '@/types/brand';

export interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Brand;
  onSave: (data: BrandFormSchema) => void;
}

export function BrandFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: BrandFormDialogProps) {
  const isEdit = !!initial;

  const form = useForm<BrandFormSchema>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: '',
      code: '',
      color: 'blue',
    },
  });

  // Reset form when dialog opens/closes or initial data changes
  useEffect(() => {
    if (open) {
      if (initial) {
        form.reset({
          name: initial.name,
          code: initial.code,
          color: initial.color as BrandColorKey,
        });
      } else {
        form.reset({
          name: '',
          code: '',
          color: 'blue',
        });
      }
    }
  }, [open, initial, form]);

  const onSubmit = (data: BrandFormSchema) => {
    onSave(data);
    onOpenChange(false);
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
      />
    </ResponsiveDialog>
  );
}

function BrandFormInputs({
  form,
  onSubmit,
  isEdit,
  onCancel,
}: {
  form: UseFormReturn<BrandFormSchema>;
  onSubmit: (data: BrandFormSchema) => void;
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
              <FieldLabel htmlFor="brand-name">Brand Name</FieldLabel>
              <Input
                id="brand-name"
                placeholder="e.g. Ashok Leyland"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <FieldLabel htmlFor="brand-code">Brand Code</FieldLabel>
              <Input
                id="brand-code"
                placeholder="e.g. AL-001"
                className="uppercase"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-muted-foreground">
                Must be uppercase letters, numbers, or hyphens.
              </p>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="color"
          render={({ field, fieldState }) => (
            <Field className="gap-2">
              <FieldLabel htmlFor="brand-color">Brand Color</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="brand-color">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BRAND_COLOR_MAP) as BrandColorKey[]).map(
                    (colorKey) => {
                      const colors = BRAND_COLOR_MAP[colorKey];
                      return (
                        <SelectItem key={colorKey} value={colorKey}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-md ${colors.iconBg} flex items-center justify-center`}
                            >
                              <Package2
                                className={`w-3.5 h-3.5 ${colors.iconText}`}
                              />
                            </div>
                            <span className="capitalize">{colorKey}</span>
                          </div>
                        </SelectItem>
                      );
                    },
                  )}
                </SelectContent>
              </Select>
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
          <Button type="submit">{isEdit ? 'Save Changes' : 'Add Brand'}</Button>
        </div>
      </form>
    </Form>
  );
}
