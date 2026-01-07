"use client";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type CoreCardProps = {
  title: string;
  divClass?: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
};

export default function CoreCardComponent({ title, divClass, content, actions }: CoreCardProps) {
  return (
    <div className={`flex ${divClass}`}>
      <Card className="w-full m-6 pt-0 gap-0">
        <CardHeader className="flex justify-between items-center my-4">
          <CardTitle>{title}</CardTitle>

          <CardAction>{actions}</CardAction>
        </CardHeader>

        <Separator className="my-0" />

        <CardContent>{content}</CardContent>
      </Card>
    </div>
  );
}
