'use client';

import { useRetrieveMultiple } from '@/hooks/useRetrieveMultiple';

/**
 * Exemplo de componente usando o hook useRetrieveMultiple
 */
export function ExampleResourceComponent() {
  const { data, loading, error } = useRetrieveMultiple();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-bold">Empresas</h3>
        {data.kvCompany?.map((company) => (
          <p key={company.id}>
            {company.id} - {company.name}
          </p>
        ))}
      </div>
      <div>
        <h3 className="font-bold">Perfis</h3>
        {data.kvProfile?.map((profile) => (
          <p key={profile.id}>
            {profile.id} - {profile.name}
          </p>
        ))}
      </div>
    </div>
  );
}
