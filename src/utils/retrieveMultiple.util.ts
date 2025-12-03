/**
 * Utility para fazer requisições múltiplas de resources
 *
 * Exemplo de uso com keyValue (apenas id e name):
 * const result = await RetrieveMultiple.setResource([
 *   { resource: 'company', keyValue: true, alias: 'kvCompany' },
 *   { resource: 'profile', keyValue: true, alias: 'kvProfile' }
 * ])
 *
 * Exemplo de uso com dados completos:
 * const result = await RetrieveMultiple.setResource([
 *   { resource: 'company', keyValue: false, alias: 'fullCompany' },
 *   { resource: 'profile', alias: 'kvProfile' } // keyValue é true por padrão
 * ])
 */

export interface ResourceRequest {
  resource: "company" | "profile" | "user" | "person";
  keyValue?: boolean; // true = id e name apenas, false = todos os campos
  alias?: string;
}

export interface KeyValueResult {
  id: string | number;
  name: string;
}

export class RetrieveMultiple {
  static async get(requests: ResourceRequest[]): Promise<Record<string, any[]>> {
    try {
      const response = await fetch("/api/retrieveMultiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resources: requests }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error retrieving multiple resources:", error);
      throw error;
    }
  }
}
