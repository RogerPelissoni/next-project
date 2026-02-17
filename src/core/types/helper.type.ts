type ExtractArray<ArrayType> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type ExtractArrayIfExists<TObject, TKey extends PropertyKey> = TKey extends keyof TObject
  ? ExtractArray<TObject[TKey]>
  : never;
