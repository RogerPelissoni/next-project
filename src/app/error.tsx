"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Algo deu errado</h1>
      <button onClick={() => reset()} className="px-4 py-2 border rounded">
        Tentar novamente
      </button>
    </div>
  );
}
