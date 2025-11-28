"use client";

import { Button } from "@/components/ui/button";
import CoreTableComponent from "@/components/core/coreTable.component";
import CoreCardComponent from "@/components/core/coreCard.component";

type CoreCrudBuilderProps = {
  title: string;
};

export default function CoreCrudBuilderComponent({
  title,
}: CoreCrudBuilderProps) {
  return (
    <CoreCardComponent
      title={title}
      actions={<Button size="sm">Novo Registro</Button>}
      content={<CoreTableComponent />}
    />
  );
}
