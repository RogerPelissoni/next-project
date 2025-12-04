import { FormFieldsInterface, TableColumnInterface, TableFiltersInterface } from "@/core/types/core.types";
import { _assign, _get, _pick } from "./lodash.util";

// FormFields
export interface FormFieldsInjectorInterface {
  [key: string]:
    | {
        [key: string]: FormFieldsInjectorSingle;
      }
    | FormFieldsInjectorSingle;
}

export interface FormFieldsInjectorSingle {
  options?: object[];
  onChange?: () => FormFieldsInjectorInterface;
}

export function injectOnFormFields(formFields: FormFieldsInterface<any, any>, formFieldsInjector: FormFieldsInjectorInterface): void {
  for (const keyGroup in formFields) {
    const obFields = formFields[keyGroup].fields;

    for (const keyField in obFields) {
      const sInjectionParam = _get(formFieldsInjector, [keyGroup, keyField]) ?? _get(formFieldsInjector, [keyField]);
      if (!sInjectionParam) continue;

      applyInjectionFormFields(obFields[keyField], sInjectionParam);
    }
  }
}

function applyInjectionFormFields(target: Record<string, any>, source: FormFieldsInjectorSingle) {
  const formFieldsInjectorKeys = ["options", "onChange"] satisfies (keyof FormFieldsInjectorSingle)[];
  _assign(target, _pick(source, formFieldsInjectorKeys));
}

// FilterFields
export interface FilterFieldsInjectorInterface {
  [key: string]: FilterFieldsInjectorSingle;
}

export interface FilterFieldsInjectorSingle {
  options?: object[];
}

export function injectOnFilterFields(filterFields: TableFiltersInterface, injectionParams: FilterFieldsInjectorInterface): void {
  for (const keyField in filterFields) {
    const sInjectionParam = _get(injectionParams, [keyField]);
    if (!sInjectionParam) continue;

    applyInjectionFilterFields(filterFields[keyField]!, sInjectionParam);
  }
}

function applyInjectionFilterFields(target: Record<string, any>, source: FilterFieldsInjectorSingle) {
  const tableColumnsInjectorKeys = ["options"] satisfies (keyof FilterFieldsInjectorSingle)[];
  _assign(target, _pick(source, tableColumnsInjectorKeys));
}

// TableColumns
export interface TableColumnsInjectorInterface {
  [key: string]: TableColumnsInjectorSingle;
}

export interface TableColumnsInjectorSingle {
  keyValue?: { [key: string]: any };
  optionsFilter?: object[];
}

export function injectOnTableColumns(tableColumns: TableColumnInterface, injectionParams: TableColumnsInjectorInterface): void {
  if (!injectionParams) return;

  for (const keyTableColumns in tableColumns) {
    const obColumns = tableColumns[keyTableColumns]!;
    const keyColumn = obColumns.accessorKey;

    const sInjectionParam = _get(injectionParams, [keyColumn]);
    if (!sInjectionParam) continue;

    applyInjectionTableColumns(tableColumns[keyTableColumns]!, sInjectionParam);
  }
}

function applyInjectionTableColumns(target: Record<string, any>, source: TableColumnsInjectorSingle) {
  const tableColumnsInjectorKeys = ["keyValue", "optionsFilter"] satisfies (keyof TableColumnsInjectorSingle)[];
  _assign(target, _pick(source, tableColumnsInjectorKeys));
}
