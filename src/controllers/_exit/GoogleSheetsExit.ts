export namespace GoogleSheetsExit {
  
  export function toMatrixRange<T = object>(
    input: ToMatrixRangeInput<T>,
    schema: ToMatrixRangeSchema<T>,
  ): MatrixRange {
    return [
      schema.map(({ columnName }) => columnName),
      ...input.map((obj) =>
        schema.map(({ valueAccessor, convertTo }) => convert(valueAccessor(obj), convertTo))
      ),
    ];
  };

  export type ToMatrixRangeInput<T = object> = Array<T>;
  
  export type ToMatrixRangeSchema<T = object> = {
    columnName: string;
    valueAccessor: (
      obj: T
    ) => string | number | boolean | null;
    convertTo?: 'date';
  }[];
  
  export type MatrixRange = Array<
    Array<CellValue>
  >;

  type ConvertTo = 'date';

  type CellValue = string | number | boolean | Date | null;

  const toDate = (value: number | string): Date => new Date(value);

  function convert(value: number | string | boolean | null, to?: ConvertTo): any {
    switch (to) {
      case 'date':
        if (typeof value !== 'number' && typeof value !== 'string') {
          throw new Error('unexpected data type');
        }
        return toDate(value);
      default:
        return value;
    }
  }
};
