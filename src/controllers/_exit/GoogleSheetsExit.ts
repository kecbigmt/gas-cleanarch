export namespace GoogleSheetsExit {
  export function toMatrixRange<T = object>(
    input: ToMatrixRangeInput<T>,
    schema: ToMatrixRangeSchema<T>
  ): MatrixRange {
    return [
      schema.map(({ columnName }) => columnName),
      ...input.map((obj) => schema.map(({ getValue }) => getValue(obj))),
    ];
  }

  export type ToMatrixRangeInput<T = object> = Array<T>;

  export type ToMatrixRangeSchema<T = object> = {
    columnName: string;
    getValue: (obj: T) => CellValue;
  }[];

  export type MatrixRange = Array<Array<CellValue>>;
  export type CellValue = string | number | boolean | Date | null;

  export const toDateCellValue = (value: string | number | Date): Date =>
    new Date(value);
}
