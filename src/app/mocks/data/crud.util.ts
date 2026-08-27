import { MockApiError } from '../mock-backend.interceptor';
import { MockRoute } from '../mock-registry';

type Row = Record<string, unknown>;

/** MOCK LAYER — generic in-memory create / update / delete for a list. */
export function crudRoutes(
  base: string,
  items: object[],
  idKey = 'id',
  includeCreate = true,
  prepare?: (row: Row) => Row,
): MockRoute[] {
  const rows = items as Row[];
  const routes: MockRoute[] = [];
  if (includeCreate) {
    routes.push({
      method: 'POST',
      pattern: base,
      handler: ({ body }) => {
        const row: Row = prepare ? prepare({ ...(body as Row) }) : { ...(body as Row) };
        if (!row[idKey]) row[idKey] = `${idKey}-${Date.now()}`;
        rows.unshift(row);
        return row;
      },
    });
  }
  routes.push(
    {
      method: 'PUT',
      pattern: `${base}/:id`,
      handler: ({ path, body }) => {
        const id = decodeURIComponent(path.split('/').pop() ?? '');
        const index = rows.findIndex((item) => String(item[idKey]) === id);
        if (index < 0) throw new MockApiError(404, 'not-found');
        const merged = { ...rows[index], ...(body as Row), [idKey]: rows[index][idKey] };
        rows[index] = prepare ? prepare(merged) : merged;
        return rows[index];
      },
    },
    {
      method: 'DELETE',
      pattern: `${base}/:id`,
      handler: ({ path }) => {
        const id = decodeURIComponent(path.split('/').pop() ?? '');
        const index = rows.findIndex((item) => String(item[idKey]) === id);
        if (index < 0) throw new MockApiError(404, 'not-found');
        return rows.splice(index, 1)[0];
      },
    },
  );
  return routes;
}

export function filterBy<T>(list: T[], key: keyof T, value: string | null): T[] {
  if (!value) return list;
  return list.filter((item) => String(item[key]) === value);
}
