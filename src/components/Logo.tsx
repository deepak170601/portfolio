/**
 * Three nodes and the edges between them — a service-dependency graph, which is
 * literally the structure the OnCall correlation engine walks. A mark that
 * means something about the work, rather than a monogram in a rounded square.
 */
export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g className="logo__edge" fill="none">
        <path d="M4.5 17.5 12 5.5" />
        <path d="M12 5.5 19.5 15" />
        <path d="M4.5 17.5 19.5 15" />
      </g>
      <circle className="logo__node" cx="4.5" cy="17.5" r="2.4" />
      <circle className="logo__node logo__node--hollow" cx="12" cy="5.5" r="2.4" />
      <circle className="logo__node" cx="19.5" cy="15" r="2.4" />
    </svg>
  );
}
