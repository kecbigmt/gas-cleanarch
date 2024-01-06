const googleSheetsExit = {
  toMatrixRange: <T = object>(
    input: ToMatrixRangeInput<T>,
    schema: ToMatrixRangeSchema<T>,
  ): MatrixRange => {
    return [
      schema.map(({ columnName }) => columnName),
      ...input.map((obj) =>
        schema.map(({ valueAccessor }) => valueAccessor(obj))
      ),
    ];
  },
};

export default googleSheetsExit;

export type ToMatrixRangeInput<T = object> = Array<T>;

export type ToMatrixRangeSchema<T = object> = {
  columnName: string;
  valueAccessor: (
    obj: T
  ) => string | number | boolean | null;
}[];

export type MatrixRange = Array<
  Array<string | number | boolean | null>
>;
