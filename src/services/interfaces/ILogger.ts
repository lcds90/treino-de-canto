export interface ILogger {
  /**
   * Envolve uma operação assíncrona para medir tempo e registrar payload
   */
  track<T>(
    operationName: string,
    pathOrUrl: string,
    payload: any,
    operation: () => Promise<T>
  ): Promise<T>;
}
