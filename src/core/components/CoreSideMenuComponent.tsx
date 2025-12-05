"use client";

import { IconLogOut } from "../utils/icon.util";
import CoreButtonComponent from "./CoreButtonComponent";

export function CoreSideMenu() {
  const doLogout = async () => {
    const resLogout = await fetch("/api/logout", { method: "POST" });
    if (!resLogout.ok) throw new Error("Erro ao efetuar logout");
    window.location.href = "/auth/login";
  };

  return (
    <div>
      <CoreButtonComponent onClick={doLogout}>
        <IconLogOut /> Sair
      </CoreButtonComponent>
    </div>
  );
}
