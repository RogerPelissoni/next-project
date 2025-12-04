"use client";

import CoreButtonComponent from "./coreButton.component";

export function SideMenu() {
  const doLogout = async () => {
    const resLogout = await fetch("/api/logout", { method: "POST" });
    if (!resLogout.ok) throw new Error("Erro ao efetuar logout");
    window.location.href = "/auth/login";
  };

  return (
    <div>
      <CoreButtonComponent label="Sair" onClick={doLogout} />
    </div>
  );
}
