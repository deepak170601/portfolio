import type { ReactNode } from 'react';

export type Column = {
  header: string;
  numeric?: boolean;
};

export type Row = {
  /** First cell, rendered as a row header. */
  head: string;
  cells: string[];
  /** Marks the row the surrounding prose is arguing for. */
  highlight?: boolean;
};

type Props = {
  caption?: string;
  /** The first column describes the row header; the rest describe the cells. */
  columns: Column[];
  rows: Row[];
  note?: ReactNode;
};

/**
 * Every table sits in its own horizontally scrolling box, so a wide result set
 * never makes the page body scroll sideways on a phone.
 */
export function DataTable({ caption, columns, rows, note }: Props) {
  return (
    <div>
      <div className="table-wrap">
        <table className="table">
          {caption ? <caption>{caption}</caption> : null}
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className={column.numeric ? 'th--num' : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.head} data-highlight={row.highlight ? 'true' : undefined}>
                <th scope="row" className="table__rowhead">
                  {row.head}
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.head}-${columns[index + 1]?.header ?? index}`}
                    className={columns[index + 1]?.numeric ? 'td--num' : undefined}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="table-note">{note}</p> : null}
    </div>
  );
}
