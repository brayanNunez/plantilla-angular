export class PagedResult<T> {
  public data: T[];
  public top: number;
  public skip: number;
  public total: number;
}
