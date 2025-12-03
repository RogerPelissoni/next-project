# CoreTable - Documentação de Uso

## Visão Geral

O `CoreTable` foi atualizado para suportar **paginação e filtragem coluna a coluna via backend**, com estado gerenciado centralmente pelo provider.

## Mudanças Principais

### 1. **CoreTableProvider**
Agora gerencia:
- **Paginação**: `pagination` e `setPagination`
- **Filtragem por coluna**: `filters` e `setFilters`
- **Ordenação**: `sorting` e `setSorting`
- **Total de registros**: `totalRecords`

### 2. **Endpoint da API**
O provider envia os seguintes parâmetros para `/api/get`:

```
GET /api/get?resource=user&skip=0&take=10&filter.name=valor&sortBy=id&sortOrder=asc
```

**Parâmetros:**
- `resource`: Nome do recurso
- `skip`: Quantidade de registros a pular
- `take`: Quantidade de registros a retornar
- `filter.{columnId}`: Filtro para a coluna específica
- `sortBy`: Coluna para ordenação
- `sortOrder`: `asc` ou `desc`

### 3. **Resposta da API**
O endpoint deve retornar:

```json
{
  "data": [...],
  "total": 150
}
```

## Exemplo de Uso

### Básico

```tsx
import { CoreTableProvider } from "@/core/table/CoreTableProvider";
import { CoreTableComponent } from "@/core/table/CoreTableComponent";
import { ColumnDef } from "@tanstack/react-table";

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function UserTable() {
  return (
    <CoreTableProvider resource="user" columns={columns}>
      <CoreTableComponent />
    </CoreTableProvider>
  );
}
```

### Com Filtragem por Coluna

```tsx
import { CoreTableColumnFilter } from "@/core/table/CoreTableColumnFilter";

export function UserTableWithFilters() {
  return (
    <CoreTableProvider resource="user" columns={columns}>
      <div className="flex gap-4 mb-4">
        <CoreTableColumnFilter columnId="name" placeholder="Filtrar por nome..." />
        <CoreTableColumnFilter columnId="email" placeholder="Filtrar por email..." />
      </div>
      <CoreTableComponent />
    </CoreTableProvider>
  );
}
```

## Implementação do Backend

### Exemplo com Prisma

```typescript
// src/server/api/get.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const resource = searchParams.get("resource");
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "10");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // Construir filtros
  const where: any = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith("filter.")) {
      const columnId = key.replace("filter.", "");
      where[columnId] = {
        contains: value,
        mode: "insensitive", // para case-insensitive
      };
    }
  });

  try {
    let query = prisma[resource as keyof typeof prisma].findMany({
      where,
      skip,
      take,
    });

    if (sortBy) {
      query = query.orderBy(sortBy, sortOrder);
    }

    const data = await query;
    const total = await prisma[resource as keyof typeof prisma].count({
      where,
    });

    return NextResponse.json({ data, total });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

## Features

- ✅ **Paginação no backend**: Skip/Take
- ✅ **Filtragem por coluna**: Envio via query params
- ✅ **Ordenação**: Sort by + sort order
- ✅ **Loading state**: Skeleton durante carregamento
- ✅ **Total de registros**: Cálculo automático de páginas
- ✅ **Gerenciamento centralizado**: Provider context

## Tipos

```typescript
interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

interface ColumnFilter {
  columnId: string;
  value: any;
}

interface CoreTableContextType<T> {
  data: T[];
  setData: (d: T[]) => void;
  resource: string;
  reload: () => Promise<void>;
  loading: boolean;
  totalRecords: number;
  columns: ColumnDef<T>[];
  filters: ColumnFilter[];
  setFilters: (f: ColumnFilter[]) => void;
  pagination: PaginationState;
  setPagination: (p: PaginationState) => void;
  sorting: Array<{ id: string; desc: boolean }>;
  setSorting: (s: Array<{ id: string; desc: boolean }>) => void;
}
```

## Notas Importantes

1. **Paginação**: Sempre use `pageSize` de 10 por padrão, customize conforme necessário
2. **Filtros**: São enviados como `filter.{columnId}=valor`
3. **Backend**: Deve retornar `{ data, total }` obrigatoriamente
4. **Ordenação**: Apenas uma coluna por vez
5. **Reload**: Use `reload()` para atualizar dados manualmente
