import { z } from 'zod';

export const stageRowSchema = z.object({
  inputQty: z.string().optional(),
  productionQty: z.string().optional(),
  rejectionQty: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type StageRowSchema = z.infer<typeof stageRowSchema>;

export const stageSubmissionSchema = z.record(z.string(), stageRowSchema);

export type StageSubmissionSchema = z.infer<typeof stageSubmissionSchema>;
