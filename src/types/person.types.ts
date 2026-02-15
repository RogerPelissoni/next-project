import { MainDataPayload } from "@/core/types/core.types";
import { initPersonResource } from "@/resources/person.resource";
import { PersonFormSchema } from "@/schemas/person.schema";

export interface PersonScreenData {
  obPerson: MainDataPayload<PersonFormSchema>;
}

export type PersonResourceConfig = ReturnType<typeof initPersonResource>;

export interface PersonPageContentProps {
  rsPerson: PersonResourceConfig;
  obPerson: MainDataPayload<PersonFormSchema>;
}
