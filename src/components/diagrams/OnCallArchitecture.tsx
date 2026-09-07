/**
 * OnCall Copilot service topology. Theme-aware: every colour comes from a CSS
 * custom property via the .diagram__* classes, so it reads correctly in both
 * themes without a second copy of the drawing.
 */
export function OnCallArchitecture() {
  return (
    <svg
      className="diagram diagram--animate"
      viewBox="0 0 900 470"
      role="img"
      aria-labelledby="oncall-arch-title oncall-arch-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="oncall-arch-title">OnCall Copilot service architecture</title>
      <desc id="oncall-arch-desc">
        An Angular dashboard talks over REST and a STOMP WebSocket to a gateway
        backend-for-frontend. The gateway calls two services: incident-service, which owns
        alert ingestion, correlation and lifecycle, and ai-service, which owns retrieval and
        hypothesis generation. Each service has its own Postgres database, ai-service using
        pgvector. Both publish to and consume from a RabbitMQ topic exchange with a bound
        dead-letter exchange, and a notification consumer inside incident-service reads the
        same event stream.
      </desc>

      <defs>
        <marker
          id="oncall-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path className="diagram__arrow" d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>

      {/* Dashboard */}
      <rect className="diagram__box" x="350" y="10" width="200" height="48" rx="4" />
      <text className="diagram__label" x="450" y="33" textAnchor="middle">
        Angular dashboard
      </text>
      <text className="diagram__sub" x="450" y="49" textAnchor="middle">
        live incident list
      </text>

      <path
        className="diagram__edge"
        d="M450,58 L450,105"
        markerEnd="url(#oncall-arrow)"
      />
      <text className="diagram__edge-label" x="462" y="86">
        REST + WebSocket (STOMP)
      </text>

      {/* Gateway */}
      <rect className="diagram__box" x="350" y="105" width="200" height="48" rx="4" />
      <text className="diagram__label" x="450" y="128" textAnchor="middle">
        gateway (BFF)
      </text>
      <text className="diagram__sub" x="450" y="144" textAnchor="middle">
        JWT · aggregation
      </text>

      <path
        className="diagram__edge"
        d="M410,153 L410,182 L195,182 L195,205"
        markerEnd="url(#oncall-arrow)"
      />
      <path
        className="diagram__edge"
        d="M490,153 L490,182 L705,182 L705,205"
        markerEnd="url(#oncall-arrow)"
      />

      {/* incident-service */}
      <rect className="diagram__box" x="90" y="205" width="210" height="64" rx="4" />
      <text className="diagram__label" x="195" y="230" textAnchor="middle">
        incident-service
      </text>
      <text className="diagram__sub" x="195" y="247" textAnchor="middle">
        ingest · correlation
      </text>
      <text className="diagram__sub" x="195" y="261" textAnchor="middle">
        lifecycle · WS broadcast
      </text>

      {/* ai-service */}
      <rect className="diagram__box" x="600" y="205" width="210" height="64" rx="4" />
      <text className="diagram__label" x="705" y="230" textAnchor="middle">
        ai-service
      </text>
      <text className="diagram__sub" x="705" y="247" textAnchor="middle">
        retrieval (RAG)
      </text>
      <text className="diagram__sub" x="705" y="261" textAnchor="middle">
        hypothesis generation
      </text>

      {/* Databases */}
      <path
        className="diagram__edge"
        d="M195,269 L195,300"
        markerEnd="url(#oncall-arrow)"
      />
      <rect className="diagram__box" x="90" y="300" width="210" height="42" rx="4" />
      <text className="diagram__sub" x="195" y="326" textAnchor="middle">
        Postgres
      </text>

      <path
        className="diagram__edge"
        d="M705,269 L705,300"
        markerEnd="url(#oncall-arrow)"
      />
      <rect className="diagram__box" x="600" y="300" width="210" height="42" rx="4" />
      <text className="diagram__sub" x="705" y="326" textAnchor="middle">
        Postgres + pgvector
      </text>

      {/* Broker */}
      <path
        className="diagram__edge"
        d="M300,237 L325,237 L325,318 L345,318"
        markerEnd="url(#oncall-arrow)"
      />
      <path
        className="diagram__edge"
        d="M600,237 L575,237 L575,318 L555,318"
        markerEnd="url(#oncall-arrow)"
      />

      <rect
        className="diagram__box diagram__box--accent"
        x="345"
        y="294"
        width="210"
        height="48"
        rx="4"
      />
      <text className="diagram__label" x="450" y="317" textAnchor="middle">
        RabbitMQ
      </text>
      <text className="diagram__sub" x="450" y="333" textAnchor="middle">
        incidents.events
      </text>

      {/* Dead-letter */}
      <path
        className="diagram__edge diagram__edge--dashed"
        d="M555,330 L620,330 L620,390"
        markerEnd="url(#oncall-arrow)"
      />
      <rect
        className="diagram__box"
        x="530"
        y="390"
        width="180"
        height="42"
        rx="4"
        strokeDasharray="4 3"
      />
      <text className="diagram__sub" x="620" y="416" textAnchor="middle">
        dead-letter exchange
      </text>

      {/* Notification consumer */}
      <path
        className="diagram__edge"
        d="M400,342 L400,390"
        markerEnd="url(#oncall-arrow)"
      />
      <rect className="diagram__box" x="190" y="390" width="220" height="42" rx="4" />
      <text className="diagram__sub" x="300" y="410" textAnchor="middle">
        notification consumer
      </text>
      <text className="diagram__sub" x="300" y="424" textAnchor="middle">
        (inside incident-service)
      </text>
    </svg>
  );
}
