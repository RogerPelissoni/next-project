# Sistema de Filtros Dinâmicos - Documentação

## Resumo das Mudanças

Foi implementado um sistema completo de filtros dinâmicos para o `CoreTableComponent`, permitindo criar filtragens configuráveis e reutilizáveis por resource.

---

## 📝 Arquivos Modificados

### 1. **`src/types/core.types.ts`**
Adicionados novos tipos para suportar filtros dinâmicos:

```typescript
export type TableFilterType = "text" | "select" | "date" | "number" | "boolean";

export interface TableFilterConfig {
  type: TableFilterType;
  label?: string;
  placeholder?: string;
  matchMode?: "like" | "equals" | "contains" | "startsWith" | "endsWith";
  options?: { label: string; value: string | number }[];
}

export type TableFiltersInterface = Record<string, TableFilterConfig>;
```

**Também atualizado:**
- Interface `FieldInterface` agora suporta propriedade `disabled?: boolean`

---

### 2. **`src/core/table/CoreTableContext.tsx`**
Adicionada propriedade ao contexto:

```typescript
export interface CoreTableContextType<T> {
  // ... outras propriedades
  filterConfig?: TableFiltersInterface;
  // ... resto
}
```

---

### 3. **`src/core/table/CoreTableProvider.tsx`**
Adicionado suporte para receber e passar `filterConfig`:

```typescript
interface Props<T> {
  resource: string;
  columns: ColumnDef<T>[];
  filterConfig?: TableFiltersInterface;  // ← Novo
  children: ReactNode;
}
```

---

### 4. **`src/core/table/CoreTableComponent.tsx`**
Implementada UI dinâmica de filtros com:

- **Componente de filtros renderizado dinamicamente** baseado em `filterConfig`
- **Tipos suportados:**
  - `text` - Input de texto
  - `select` - Select com opções
  - `number` - Input numérico
  - `date` - Input de data
- **Gerenciamento de estado** dos valores de filtro
- **Integração automática** com o sistema de filtros existente

```tsx
<div className="border rounded-md p-4 bg-muted/30">
  <h3 className="text-sm font-semibold mb-3">Filtros</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {Object.entries(filterConfig).map(([columnId]) => (
      <div key={columnId} className="flex flex-col gap-1">
        {renderFilterInput(columnId)}
      </div>
    ))}
  </div>
</div>
```

---

### 5. **`src/resources/user.resource.ts`**
Expandido com configuração de filtros:

```typescript
export const tableFilters: TableFiltersInterface = {
  name: { 
    type: "text", 
    label: "Nome",
    placeholder: "Filtrar por nome",
    matchMode: "like" 
  },
  email: { 
    type: "text", 
    label: "Email",
    placeholder: "Filtrar por email",
    matchMode: "like" 
  },
  ds_profile: { 
    type: "select", 
    label: "Perfil",
    placeholder: "Selecionar perfil",
    matchMode: "equals"
  },
  ds_company: { 
    type: "select", 
    label: "Empresa",
    placeholder: "Selecionar empresa",
    matchMode: "equals"
  },
};

export const useUserResource = () => ({
  schema: userSchema,
  tableColumns,
  tableFilters,  // ← Adicionado
  formState,
  formFields,
  injectors,
});
```

---

### 6. **`src/app/user/page.tsx`**
Atualizado para passar `filterConfig` ao provider:

```tsx
<CoreTableProvider 
  resource="user" 
  columns={userResource.tableColumns} 
  filterConfig={userResource.tableFilters}  // ← Novo
>
  <UserPageContent />
</CoreTableProvider>
```

---

## 🚀 Como Usar

### Passo 1: Definir Filtros no Resource

```typescript
// src/resources/seu.resource.ts
export const tableFilters: TableFiltersInterface = {
  nome_coluna: {
    type: "text",
    label: "Rótulo",
    placeholder: "Digite aqui...",
    matchMode: "like"
  },
  outra_coluna: {
    type: "select",
    label: "Seleção",
    placeholder: "Selecione uma opção",
    matchMode: "equals",
    options: [
      { label: "Opção 1", value: "opt1" },
      { label: "Opção 2", value: "opt2" }
    ]
  }
};
```

### Passo 2: Passar ao Provider

```tsx
<CoreTableProvider 
  resource="seu_resource" 
  columns={seuResource.tableColumns}
  filterConfig={seuResource.tableFilters}
>
  <CoreTableComponent />
</CoreTableProvider>
```

---

## 🎨 Tipos de Filtros Disponíveis

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `text` | Input de texto com busca | Nome, Email |
| `select` | Seleção com opções pré-definidas | Status, Tipo |
| `number` | Input numérico | ID, Quantidade |
| `date` | Seletor de data | Data de Criação |
| `boolean` | Checkbox (futuro) | Ativo/Inativo |

---

## 📋 Configuração Completa de um Filtro

```typescript
{
  type: "text",              // Tipo do filtro
  label: "Nome",             // Rótulo exibido
  placeholder: "Digite...",  // Placeholder do input
  matchMode: "like",         // like | equals | contains | startsWith | endsWith
  options?: [...]            // Apenas para tipo 'select'
}
```

---

## 🔄 Fluxo de Filtragem

1. Usuário digita/seleciona valor no filtro
2. `handleFilterChange()` atualiza `filterValues` (estado local)
3. Filtro é adicionado/atualizado na lista `filters` do contexto
4. `CoreTableProvider` detecta mudança em `filters`
5. `loadData()` é chamado com parâmetros de filtro
6. API recebe filtros via query string: `filter.nome_coluna=valor`

---

## ✅ Benefícios

- ✅ Filtros completamente dinâmicos por resource
- ✅ Sem necessidade de modificar componentes
- ✅ Suporte a múltiplos tipos de filtro
- ✅ Integração automática com API
- ✅ UI responsiva (grid layout)
- ✅ Fácil manutenção e extensão

---

## 📦 Exemplo Completo

Veja a implementação pronta em:
- `src/resources/user.resource.ts` - Definição de filtros
- `src/app/user/page.tsx` - Uso no component
- `src/core/table/CoreTableComponent.tsx` - Renderização dinâmica
