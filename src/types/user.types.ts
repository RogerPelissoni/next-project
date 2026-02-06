import { MainDataPayload } from "@/core/types/core.types";
import { UserFormSchema } from "@/schemas/user.schema";
import { KeyValueType } from "@/core/utils/core.util";
import { initUserResource } from "@/resources/user.resource";

export interface UserScreenData {
  obUser: MainDataPayload<UserFormSchema>;
  kvProfile: KeyValueType;
  kvCompany: KeyValueType;
  kvPerson: KeyValueType;
}

export type UserResourceConfig = ReturnType<typeof initUserResource>;

export interface UserPageContentProps {
  rsUser: UserResourceConfig;
  obUser: MainDataPayload<UserFormSchema>;
}
