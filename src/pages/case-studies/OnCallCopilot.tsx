import { Callout } from '../../components/Callout';
import { Chart } from '../../components/Chart';
import { DataTable } from '../../components/DataTable';
import { Figure } from '../../components/Figure';
import { Section } from '../../components/Section';
import { OnCallArchitecture } from '../../components/diagrams/OnCallArchitecture';
import { oncallCopilot } from '../../content/projects';
import { CaseStudyShell } from '../CaseStudyShell';

export function OnCallCopilotPage() {
  return (
    <CaseStudyShell project={oncallCopilot}>
      <Section label="The problem" id="problem" index="01">
        <div className="prose">
          <p>
            When a production incident happens, engineers lose the first critical minutes
            to three manual tasks: correlating a flood of individual alerts into a single
            incident, recalling whether something similar has happened before, and
            drafting a coherent root-cause hypothesis to share with the team.
          </p>
          <p>
            OnCall Copilot automates all three. It is deliberately modelled as{' '}
            <strong>internal engineering tooling</strong> rather than another
            customer-facing chatbot — the interesting problems here are distributed
            systems, real-time streaming and grounded retrieval, not conversation.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <Figure
            flush
            caption="The replay drives the real ingestion path: four alerts collapse into one incident, severity escalates in place, and a cited hypothesis arrives over the authenticated live stream."
          >
            <img src="/oncall-demo.gif" alt="OnCall Copilot replay showing alerts collapsing into one incident and a cited hypothesis arriving live." />
          </Figure>
        </div>
      </Section>

      <Section label="Architecture" id="architecture" index="02">
        <div className="prose">
          <p>
            Three Spring Boot services sit behind a backend-for-frontend gateway. Each
            service owns its database, and the gateway owns JWT login, role checks, REST
            aggregation, and per-section degradation. Incident and analysis writes commit
            with transactional outbox rows; a dispatcher claims them with{' '}
            <code>FOR UPDATE SKIP LOCKED</code>, waits for RabbitMQ publisher confirms, and
            retries with persisted backoff. Delivery remains at least once by design, while
            stable message IDs, an advisory lock, a fast path, and a unique index protect the
            expensive AI operation from duplicate work.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <Figure caption="Each service owns its own database. The AI service references incident IDs without a cross-service foreign key, preserving the ownership boundary.">
            <OnCallArchitecture />
          </Figure>
        </div>
      </Section>

      <Section label="Correlation is structural, not semantic" id="correlation" index="03">
        <div className="prose">
          <p>
            A flood of alerts becomes one incident by walking the{' '}
            <strong>service-dependency graph</strong>, never by fuzzy-matching text. Alerts
            on two services with no dependency edge are never merged, however suggestive
            they look. Semantic pattern-matching is the AI step's job — deliberately a
            different mechanism for a different problem.
          </p>
        </div>

        <ul className="list" style={{ marginTop: 'var(--s-5)' }}>
          <li>
            <strong>Window anchoring</strong> to the incident's most recent alert rather
            than its creation time, so a slow-building incident keeps absorbing related
            alerts instead of hitting an arbitrary cutoff.
          </li>
          <li>
            <strong>Flap deduplication</strong> by service plus normalised message
            signature inside a debounce window.
          </li>
          <li>
            <strong>Reopening</strong> a just-resolved incident within a grace period,
            rather than duplicating it.
          </li>
          <li>
            <strong>Severity escalation</strong> that never walks back down.
          </li>
          <li>
            <strong>Concurrent-burst safety</strong> via a transaction-scoped Postgres advisory lock across
            the whole candidate service cluster, acquired in sorted order so two
            overlapping clusters cannot deadlock.
          </li>
        </ul>
      </Section>

      <Section label="Retrieval is measured, not assumed" id="retrieval" index="04">
        <div className="prose">
          <p>
            The evaluation set has 14 hand-labelled cases, including three{' '}
            <strong>negative</strong> cases the corpus deliberately cannot answer — so the
            "no confident match" path is measured rather than hoped for. Three things make
            the number honest:
          </p>
        </div>

        <ul className="list" style={{ marginTop: 'var(--s-5)' }}>
          <li>
            <strong>Queries state symptoms only, never causes.</strong> A query saying "TLS
            handshake failure" names the answer; no real alert knows its own root cause.
          </li>
          <li>
            <strong>The corpus is fiction grounded in fact.</strong> Each of the 15
            scenarios is modelled on a documented public incident and cites it. Those
            citations are excluded from the embedding input, and a test proves it —
            embedding them would let a query match on the word <em>Cloudflare</em> rather
            than on symptoms.
          </li>
          <li>
            <strong>A lexical baseline is the bar.</strong> The same evaluation runs
            through a keyword-overlap-only embedder, and a real model has to beat it. The
            first version of this eval set scored a perfect 1.000 MRR under that lexical
            stub — meaning keyword matching alone solved every case, and semantic
            embeddings could not have demonstrated any value. Applying the symptoms-only
            rule dropped the baseline to a discriminating 0.894.
          </li>
        </ul>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <DataTable
            caption="15 postmortems, 14 labelled cases, k=3."
            columns={[
              { header: 'Metric' },
              { header: 'Lexical baseline', numeric: true },
              { header: 'gemini-embedding-001', numeric: true },
            ]}
            rows={[
              { head: 'hit@3', cells: ['11 / 11', '11 / 11'] },
              { head: 'Ranked first', cells: ['9 / 11', '10 / 11'], highlight: true },
              { head: 'MRR', cells: ['0.894', '0.939'], highlight: true },
              { head: 'Correct rejections', cells: ['3 / 3 †', '3 / 3'] },
            ]}
            note={
              <>
                † The baseline's 3/3 is an artefact, not a result: its top similarity never
                exceeds 0.47, so it falls below the 0.70 confidence threshold on every case
                — including the eleven it ranked correctly. It scores full marks on
                rejection by never answering. Reported as a sanity check, not a benchmark:
                at n=14 one item moves the score about seven points, and with a
                15-document corpus hit@3 saturates trivially, so MRR and rank-1 are the
                metrics that mean anything.
              </>
            }
          />
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <Chart
            label="Mean reciprocal rank across three evaluation runs"
            max={1}
            rows={[
              {
                label: 'Lexical stub, original queries',
                value: 1.0,
                display: '1.000',
              },
              {
                label: 'Lexical stub, symptoms-only rule',
                value: 0.894,
                display: '0.894',
              },
              {
                label: 'gemini-embedding-001',
                value: 0.939,
                display: '0.939',
                emphasis: true,
              },
            ]}
            caption={
              <>
                MRR, 0 to 1. The first bar is the defect: keyword matching alone solved
                every case, so the embeddings could not have shown any value. Fixing the
                queries dropped the bar to something a model has to actually clear — and
                only then does the third bar mean anything.
              </>
            }
          />
        </div>

        <div className="prose" style={{ marginTop: 'var(--s-6)' }}>
          <p>
            The threshold separating "confident" from "no match" sits in a{' '}
            <strong>0.023 gap</strong> — negatives peak at 0.689, positives bottom out at
            0.712 — and the query that should have been least similar scored highest of the
            negatives. This model compresses operational prose into a narrow band, so
            absolute similarity is a weak discriminator. That is an argument for hybrid
            retrieval, not for trusting a tuned number.
          </p>
        </div>
      </Section>

      <Section label="What broke, and what caught it" id="defects" index="05">
        <Callout label="The guard that protected nothing">
          <p>
            The verification pass recorded <strong>99 regular tests passing</strong>: 40 in
            incident-service, 35 in AI-service, and 24 in the gateway, against real
            PostgreSQL/pgvector and RabbitMQ. The tests exercise rollback atomicity,
            publisher confirms, retry recovery, concurrent outbox workers, AI redelivery,
            gateway authorization, authenticated WebSocket delivery, and internal API keys.
          </p>
          <p>
            The most instructive defect was a Postgres advisory lock that looked correct but
            was not held inside the transaction that performed correlation. Removing the
            guard and confirming that the concurrency test failed made transaction placement
            part of the correctness proof.
          </p>
          <p>
            That is why every phase in this project ends with a gate, and why the sharpest
            question before calling anything done became:{' '}
            <strong>if I deleted the protective mechanism, would anything fail?</strong>
          </p>
        </Callout>

        <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
          <p>
            The same discipline verified dead-letter routing, provider fallback, idempotency,
            and the gateway's security boundary against live infrastructure rather than
            mocks. The current local verification is stronger than the earlier 66-test
            snapshot represented in older portfolio copy.
          </p>
        </div>
      </Section>

      <Section label="Known simplifications" id="simplifications" index="06">
        <div className="prose">
          <p>Each is a conscious trade, stated rather than hidden.</p>
        </div>

        <ul className="list" style={{ marginTop: 'var(--s-5)' }}>
          <li>
            <strong>At-least-once delivery.</strong> Transactional outboxes close the lost-event
            write/publish gap, but a crash after broker confirmation can still redeliver a
            message before its outbox row is marked published.
          </li>
          <li>
            <strong>1-hop correlation only.</strong> Not transitive: two services each
            adjacent to a third are not adjacent to each other.
          </li>
          <li>
            <strong>Pure vector similarity.</strong> Under-retrieves when a query names a
            service that a semantically similar postmortem words differently. Hybrid search
            — vectors plus a service-name filter — is the identified fix.
          </li>
          <li>
            <strong>The corpus and its eval queries share an author</strong>, so the
            evaluation measures wording agreement as well as retrieval.
          </li>
          <li>
            <strong>Scale boundaries remain.</strong> The current next steps are retention for
            published outbox rows and a horizontally scalable WebSocket relay or gateway-owned
            socket boundary.
          </li>
        </ul>
      </Section>
    </CaseStudyShell>
  );
}
