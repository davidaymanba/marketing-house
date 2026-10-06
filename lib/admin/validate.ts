import { z } from "zod";
import type { Resource } from "./resources";

const str = (max = 5000) => z.string().trim().max(max);
const optionalUrl = z.union([z.literal(""), z.url().max(2000)]);

/** Builds the server-side zod schema for a resource from its field config. */
export function buildSchema(resource: Resource) {
  const shape: Record<string, z.ZodType> = { is_published: z.boolean().default(true) };

  for (const f of resource.fields) {
    switch (f.type) {
      case "bilingual":
        shape[`${f.name}_ar`] = f.required ? str().min(1, "required") : str().default("");
        shape[`${f.name}_en`] = f.required ? str().min(1, "required") : str().default("");
        break;
      case "text":
      case "textarea":
        shape[f.name] = f.required ? str().min(1, "required") : str().default("");
        break;
      case "slug":
        shape[f.name] = z
          .string()
          .trim()
          .toLowerCase()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "invalid")
          .max(120);
        break;
      case "url":
      case "image":
        shape[f.name] = optionalUrl.default("");
        break;
      case "number":
        shape[f.name] = z.coerce
          .number("invalid")
          .min(f.min ?? -1e9, "invalid")
          .max(f.max ?? 1e9, "invalid");
        break;
      case "boolean":
        shape[f.name] = z.boolean().default(false);
        break;
      case "select":
        shape[f.name] = str(100).default("");
        break;
      case "multiselect":
        shape[f.name] = z.array(str(120)).max(50).default([]);
        break;
      case "gallery":
        shape[f.name] = z.array(z.url().max(2000)).max(60).default([]);
        break;
      case "list":
      case "object": {
        const item: Record<string, z.ZodType> = {};
        for (const sf of f.itemFields) item[sf.name] = sf.type === "number" ? z.coerce.number("invalid") : str(2000).default("");
        shape[f.name] = f.type === "list" ? z.array(z.object(item)).max(50).default([]) : z.object(item).partial().default({});
        break;
      }
    }
  }
  return z.object(shape);
}

/** Converts validated form values into DB column values. */
export function toRow(resource: Resource, values: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) {
    const field = resource.fields.find((f) => f.name === k);
    if (field?.type === "gallery") continue; // stored in project_images
    if (field && (field.type === "image" || field.type === "url" || (field.type === "select" && field.options === "categories"))) {
      row[k] = v === "" ? null : v;
    } else row[k] = v;
  }
  return row;
}
