export interface OptionType {
  value: string | number;
  label: string;
}

export interface KeyValueType {
  [key: string]: any;
}

export const toOptions = (keyValue: KeyValueType): OptionType[] => {
  const obOptions = [];

  for (const keyOption in keyValue) {
    const labelOption = keyValue[keyOption];

    obOptions.push({
      value: keyOption,
      label: labelOption,
    });
  }

  return obOptions;
};

export const toKeyValue = <K extends keyof OptionType, L extends keyof OptionType>(options: OptionType[], key: K, label: L): KeyValueType => {
  const keyValue: KeyValueType = {};

  for (const opt of options) {
    keyValue[String(opt[key])] = opt[label];
  }

  return keyValue;
};
