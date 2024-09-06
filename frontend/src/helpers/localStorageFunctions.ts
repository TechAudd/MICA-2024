interface IGetterFunctionProps {
  key: string;
}

interface IVals {
  data: object;
  key: string;
}

interface ISetterFunctionProps {
  vals: IVals;
}

export const getterFunction = <T>({ key }: IGetterFunctionProps): T | null => {
  const stringifiedValues = localStorage.getItem(key);
  const parsedValues = stringifiedValues
    ? (JSON.parse(stringifiedValues) as T)
    : null;
  return parsedValues;
};

export const setterFunction = ({ vals }: ISetterFunctionProps): void => {
  localStorage.setItem(vals.key, JSON.stringify(vals.data));
};
