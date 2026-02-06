interface CoreErrorMessageProps {
  error: string | null;
  onRetry: () => void;
}

export function CoreErrorMessage({ error, onRetry }: CoreErrorMessageProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="text-red-600 text-lg mb-4">⚠️ Erro ao carregar dados</div>
        <p className="text-gray-600 mb-4">{error || "Dados incompletos. Tente novamente."}</p>
        <button
          onClick={onRetry}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
}
