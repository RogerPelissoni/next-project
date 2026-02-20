import { createQueryResourceBuilder } from "@/core/utils/resource.util";
import { PersonGenderEnum } from "@/enums/personGender.enum";
import { z } from "zod";

export const personSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(150),
  ds_document: z.string().max(20).optional().nullable(),
  ds_email: z.string().email().max(100).optional().nullable(),
  ds_phone: z.string().max(20).optional().nullable(),
  da_birth: z
    .union([z.string().refine((val) => !val || !isNaN(Date.parse(val)), "Data inválida"), z.date()])
    .optional()
    .nullable(),
  tp_gender: z.enum(Object.keys(PersonGenderEnum)).optional().nullable(),
  ds_address_street: z.string().max(120).optional().nullable(),
  ds_address_number: z.string().max(20).optional().nullable(),
  ds_address_complement: z.string().max(60).optional().nullable(),
  ds_address_district: z.string().max(80).optional().nullable(),
  ds_address_city: z.string().max(80).optional().nullable(),
  ds_address_state: z.string().length(2).optional().nullable(),
  ds_address_zipcode: z.string().max(10).optional().nullable(),
  fl_active: z.boolean().default(true),
});

export type PersonFormSchema = z.infer<typeof personSchema>;
type PersonSchemaKeys = keyof z.infer<typeof personSchema>;

export const personPhoneSchema = z.object({
  id: z.string().optional(),
  person_id: z.string().optional(),
  ds_phone: z.string().min(8).max(20),
});

export type PersonPhoneFormSchema = z.infer<typeof personPhoneSchema>;
type PersonPhoneSchemaKeys = keyof z.infer<typeof personPhoneSchema>;

export const PERSON_QUERY_SCHEMA = {
  fields: {
    id: {},
    name: {},
    ds_document: {},
    ds_email: {},
    ds_phone: {},
    da_birth: {},
    tp_gender: {},
    ds_address_street: {},
    ds_address_number: {},
    ds_address_complement: {},
    ds_address_district: {},
    ds_address_city: {},
    ds_address_state: {},
    ds_address_zipcode: {},
    fl_active: {},
  } satisfies Record<PersonSchemaKeys, any>,
  appends: {
    ds_company: {},
  },
  hydrators: {
    personPhone: {},
  },
};

export const makePersonQueryResources = createQueryResourceBuilder<typeof PERSON_QUERY_SCHEMA>();
