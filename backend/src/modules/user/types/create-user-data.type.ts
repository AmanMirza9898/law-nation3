import type { createUserSchema } from "@/modules/user/validators/user.validator.js";
import { z } from "zod";

// /src/modules/user/types/create-user-data.type.ts
export type CreateUserData = z.infer<typeof createUserSchema>;
