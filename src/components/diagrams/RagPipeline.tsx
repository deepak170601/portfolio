/**
 * The Multimodal RAG retrieval pipeline: a dual-space ingest feeding one store,
 * and the query path that reads from it.
 */
export function RagPipeline() {
  return (
    <svg
      className="diagram diagram--animate"
      viewBox="0 0 900 400"
      role="img"
      aria-labelledby="rag-pipeline-title rag-pipeline-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="rag-pipeline-title">Multimodal RAG retrieval pipeline</title>
      <desc id="rag-pipeline-desc">
        At ingest, a PDF is split into page text embedded with MiniLM into 384 dimensions,
        and embedded images encoded with CLIP into 512 dimensions. Both are stored in one
        Postgres database using pgvector. At query time the question is embedded into both
        spaces, both are searched by cosine similarity, a cross-encoder reorders the text
        candidates, the two ranked lists are calibrated against their own observed ranges
        and fused, a relevance floor decides what is admitted, and the survivors are sent to
        a vision-capable language model that answers with page citations.
      </desc>

      <defs>
        <marker
          id="rag-arrow"
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

      <text className="diagram__sub" x="20" y="20">
        INGEST
      </text>

      {/* PDF */}
      <rect className="diagram__box" x="20" y="55" width="110" height="50" rx="4" />
      <text className="diagram__label" x="75" y="78" textAnchor="middle">
        PDF
      </text>
      <text className="diagram__sub" x="75" y="94" textAnchor="middle">
        pymupdf4llm
      </text>

      <path className="diagram__edge" d="M130,68 L165,68 L165,47 L190,47" markerEnd="url(#rag-arrow)" />
      <path className="diagram__edge" d="M130,92 L165,92 L165,113 L190,113" markerEnd="url(#rag-arrow)" />

      {/* Two embedding spaces */}
      <rect className="diagram__box" x="190" y="25" width="190" height="44" rx="4" />
      <text className="diagram__label" x="285" y="43" textAnchor="middle">
        Page text → MiniLM
      </text>
      <text className="diagram__sub" x="285" y="59" textAnchor="middle">
        384-dim
      </text>

      <rect className="diagram__box" x="190" y="91" width="190" height="44" rx="4" />
      <text className="diagram__label" x="285" y="109" textAnchor="middle">
        Images → CLIP
      </text>
      <text className="diagram__sub" x="285" y="125" textAnchor="middle">
        512-dim
      </text>

      <path className="diagram__edge" d="M380,47 L410,47 L410,68 L435,68" markerEnd="url(#rag-arrow)" />
      <path className="diagram__edge" d="M380,113 L410,113 L410,92 L435,92" markerEnd="url(#rag-arrow)" />

      {/* Store */}
      <rect
        className="diagram__box diagram__box--accent"
        x="435"
        y="55"
        width="190"
        height="50"
        rx="4"
      />
      <text className="diagram__label" x="530" y="78" textAnchor="middle">
        Postgres + pgvector
      </text>
      <text className="diagram__sub" x="530" y="94" textAnchor="middle">
        two vector columns
      </text>

      {/* Store feeds the search step */}
      <path
        className="diagram__edge diagram__edge--dashed"
        d="M530,105 L530,180 L450,180 L450,230"
        markerEnd="url(#rag-arrow)"
      />

      <text className="diagram__sub" x="20" y="200">
        QUERY
      </text>

      {/* Query pipeline */}
      <rect className="diagram__box" x="20" y="230" width="148" height="54" rx="4" />
      <text className="diagram__label" x="94" y="254" textAnchor="middle">
        Question
      </text>
      <text className="diagram__sub" x="94" y="270" textAnchor="middle">
        scoped or corpus-wide
      </text>
      <path className="diagram__edge" d="M168,257 L198,257" markerEnd="url(#rag-arrow)" />

      <rect className="diagram__box" x="198" y="230" width="148" height="54" rx="4" />
      <text className="diagram__label" x="272" y="254" textAnchor="middle">
        Embed ×2
      </text>
      <text className="diagram__sub" x="272" y="270" textAnchor="middle">
        MiniLM + CLIP
      </text>
      <path className="diagram__edge" d="M346,257 L376,257" markerEnd="url(#rag-arrow)" />

      <rect className="diagram__box" x="376" y="230" width="148" height="54" rx="4" />
      <text className="diagram__label" x="450" y="254" textAnchor="middle">
        Search both
      </text>
      <text className="diagram__sub" x="450" y="270" textAnchor="middle">
        cosine, over-fetched
      </text>
      <path className="diagram__edge" d="M524,257 L554,257" markerEnd="url(#rag-arrow)" />

      <rect className="diagram__box" x="554" y="230" width="148" height="54" rx="4" />
      <text className="diagram__label" x="628" y="254" textAnchor="middle">
        Rerank · fuse
      </text>
      <text className="diagram__sub" x="628" y="270" textAnchor="middle">
        cross-encoder orders
      </text>
      <path className="diagram__edge" d="M702,257 L732,257" markerEnd="url(#rag-arrow)" />

      <rect
        className="diagram__box diagram__box--accent"
        x="732"
        y="230"
        width="148"
        height="54"
        rx="4"
      />
      <text className="diagram__label" x="806" y="254" textAnchor="middle">
        Floor admits
      </text>
      <text className="diagram__sub" x="806" y="270" textAnchor="middle">
        or nothing is sent
      </text>

      {/* Output */}
      <path
        className="diagram__edge"
        d="M806,284 L806,320 L530,320 L530,345"
        markerEnd="url(#rag-arrow)"
      />
      <rect className="diagram__box" x="380" y="345" width="300" height="44" rx="4" />
      <text className="diagram__label" x="530" y="363" textAnchor="middle">
        Vision LLM → answer + page citations
      </text>
      <text className="diagram__sub" x="530" y="379" textAnchor="middle">
        or “not in these documents”
      </text>
    </svg>
  );
}
