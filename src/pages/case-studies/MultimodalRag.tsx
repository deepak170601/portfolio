import { Callout } from '../../components/Callout';
import { Chart } from '../../components/Chart';
import { DataTable } from '../../components/DataTable';
import { Figure } from '../../components/Figure';
import { Section } from '../../components/Section';
import { RagPipeline } from '../../components/diagrams/RagPipeline';
import { multimodalRag } from '../../content/projects';
import { CaseStudyShell } from '../CaseStudyShell';

export function MultimodalRagPage() {
  return (
    <CaseStudyShell project={multimodalRag}>
      <Section label="The problem" id="problem" index="01">
        <div className="prose">
          <p>
            Standard RAG pipelines only index the text layer, so{' '}
            <em>"what does the diagram on page 12 show?"</em> is unanswerable — the visual
            content was never indexed at all. This one embeds page text with a sentence
            transformer and embedded images with CLIP, searches both, fuses the two ranked
            lists, and sends the survivors — text and images together — to a vision-capable
            model, with citations back to the page.
          </p>
          <p>
            The engineering question underneath it is not "does RAG work" but{' '}
            <strong>which retrieval decisions actually pay</strong>. Every one below was
            settled against a labelled set of 89 questions — 75 answerable and 14 the corpus
            deliberately cannot answer — rather than by looking at output and deciding it
            seemed better. The reproduced September 2026 run delivered relevant evidence for
            <strong>65 of 75 answerable questions (86.7%)</strong>, versus 52 of 75 (69.3%)
            for text-only retrieval, while rejecting 11 of 14 off-topic questions.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <Figure caption="Text and images are embedded into two different vector spaces, searched separately, calibrated against their own observed ranges, then fused into one ranking. Nothing truncates after fusion — everything above the relevance floor is sent to the model.">
            <RagPipeline />
          </Figure>
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <DataTable
            caption="Retrieval configurations measured against the labelled set. Latency is retrieval only — embedding, search, rerank, fusion — on a laptop CPU; generation is not in it."
            columns={[
              { header: 'Config' },
              { header: 'Delivered', numeric: true },
              { header: '@1', numeric: true },
              { header: '@3', numeric: true },
              { header: '@5', numeric: true },
              { header: 'MRR', numeric: true },
              { header: 'Rejects off-topic', numeric: true },
              { header: 'p50', numeric: true },
            ]}
            rows={[
              {
                head: 'text_only — an ordinary text-RAG pipeline',
                cells: ['0.69', '0.47', '0.55', '0.69', '0.536', '0.71', '10 ms'],
              },
              {
                head: 'image_only — CLIP alone',
                cells: ['0.23', '0.21', '0.23', '0.23', '0.220', '0.93', '19 ms'],
              },
              {
                head: 'fused — text + CLIP',
                cells: ['0.85', '0.55', '0.68', '0.80', '0.641', '0.71', '26 ms'],
              },
              {
                head: 'fused_reranked — plus a cross-encoder (the default)',
                cells: ['0.87', '0.56', '0.76', '0.81', '0.679', '0.79', '460 ms'],
                highlight: true,
              },
              {
                head: 'fused_captions — text + captions, one space',
                cells: ['0.83', '0.49', '0.68', '0.81', '0.607', '0.64', '17 ms'],
              },
              {
                head: 'fused_hyde — search widened by a drafted answer',
                cells: ['0.88', '0.49', '0.68', '0.80', '0.617', '0.86', '~6 s cold'],
              },
            ]}
            note={
              <>
                <strong>Delivered</strong> is the headline metric: a relevant chunk cleared
                the relevance floor and actually reached the model. It, rather than
                recall@5, is the honest measure here because nothing truncates after fusion.{' '}
                <strong>Rejects off-topic</strong> is its counterweight — the share of
                unanswerable questions that correctly retrieved nothing at all. A pipeline
                can buy delivery with rejection, so neither number means much alone.
              </>
            }
          />
        </div>
      </Section>

              <div style={{ marginTop: 'var(--s-6)' }}>
          <Chart
            label="Delivered rate by retrieval configuration"
            max={1}
            rows={[
              { label: 'image_only', value: 0.23, display: '0.23' },
              { label: 'text_only', value: 0.69, display: '0.69' },
              { label: 'fused_captions', value: 0.83, display: '0.83' },
              { label: 'fused', value: 0.85, display: '0.85' },
              {
                label: 'fused_reranked (default)',
                value: 0.87,
                display: '0.87',
                emphasis: true,
              },
              { label: 'fused_hyde', value: 0.88, display: '0.88' },
            ]}
            caption="Delivered rate, 0 to 1 — the share of questions where a relevant chunk cleared the relevance floor and actually reached the model. Read alongside off-topic rejection in the table above: a pipeline can buy delivery with rejection."
          />
        </div>

<Section label="1 — Does indexing images help?" id="images" index="02">
        <div className="prose">
          <p>Yes, and this is the clearest result in the project.</p>
        </div>

        <div style={{ marginTop: 'var(--s-5)' }}>
          <DataTable
            columns={[
              { header: 'Question category' },
              { header: 'n', numeric: true },
              { header: 'text_only', numeric: true },
              { header: 'fused', numeric: true },
            ]}
            rows={[
              {
                head: 'Answer exists only in a figure',
                cells: ['11', '0.00', '1.00'],
                highlight: true,
              },
              { head: 'Text mentions it, a figure shows it', cells: ['6', '0.83', '1.00'] },
              { head: 'Answer is in the text layer', cells: ['58', '0.81', '0.81'] },
            ]}
          />
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <Chart
            label="Share of figure-only questions answered, text-only versus fused"
            max={1}
            rows={[
              { label: 'text_only', value: 0.0, display: '0.00' },
              { label: 'fused (text + CLIP)', value: 1.0, display: '1.00', emphasis: true },
            ]}
            caption="Questions whose answer exists only inside a figure (n=11). This is the clearest result in the project, and the one the whole premise rests on."
          />
        </div>

        <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
          <p>
            <strong>
              Text-only retrieval answers none of the eleven figure-only questions.
            </strong>{' '}
            Not fewer — zero. Adding image retrieval takes that to 1.00 and costs nothing on
            the 58 text questions, which are identical by construction.
          </p>
          <p>
            That first row used to read n=1. Growing the labelled set is what turned it from
            a suggestive anecdote into the load-bearing claim of the project.
          </p>
        </div>
      </Section>

      <Section label="2 — Is CLIP the right way to index them?" id="clip" index="03">
        <div className="prose">
          <p>
            Not obviously, and this is the comparison worth having. CLIP puts images in a{' '}
            <em>second</em> embedding space, and three hand-set constants exist only to make
            two incomparable score ranges comparable. Captioning removes the gap instead of
            calibrating across it — describe each figure with a vision model at ingest,
            embed the description with the <em>same</em> encoder that embeds the text, and a
            figure becomes an ordinary row in the text index. One space, one calibration,
            one floor.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-5)' }}>
          <DataTable
            caption="A genuine trade, not a clean win."
            columns={[
              { header: '' },
              { header: 'fused (CLIP)', numeric: true },
              { header: 'fused_captions', numeric: true },
            ]}
            rows={[
              { head: 'Figure-only questions (n=11)', cells: ['0.91', '0.82'] },
              { head: 'recall@5 overall', cells: ['0.79', '0.81'] },
              { head: 'Rejects off-topic', cells: ['0.71', '0.64'], highlight: true },
              { head: 'p50 latency', cells: ['21 ms', '14 ms'] },
              { head: 'Hand-set cross-modal constants', cells: ['3', '0'] },
            ]}
          />
        </div>

        <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
          <p>
            What captioning costs is rejection, and the reason is the counter-argument to
            the whole idea. Those three "redundant" constants were not pure waste — the
            separate image floor was doing real work suppressing CLIP's noise. Put captions
            in the text space and they inherit the <em>text</em> floor, which is far more
            permissive, so a weak caption match on an off-topic query now clears it.{' '}
            <strong>
              One space means one floor, and one floor cannot be strict for figures and
              lenient for prose at the same time.
            </strong>
          </p>
          <p>
            The default stays CLIP, because refusing to answer what it cannot source is a
            load-bearing property of this project, and captioning trades it away.
          </p>
        </div>
      </Section>

      <Section label="3 — Does a cross-encoder earn its forward pass?" id="reranker" index="04">
        <div className="prose">
          <p>
            The first version <strong>lost</strong>, and the reason is the most interesting
            thing the labelled set has produced: it supplied the admission floor as well as
            the ordering. A cross-encoder ranks candidates <em>against each other</em> and
            carries no absolute "is any of this relevant?" signal — asked about sourdough
            over a thesis corpus it still scores its best candidate highly, because that
            candidate genuinely is the best of what it was handed.
          </p>
          <p>The fix is to let each score do only the job it can do:</p>
        </div>

        <div style={{ marginTop: 'var(--s-5)' }}>
          <DataTable
            columns={[{ header: 'Decision' }, { header: 'Made by' }]}
            rows={[
              { head: 'Admission — does anything here belong?', cells: ['Calibrated cosine'] },
              { head: 'Ordering — which of these goes first?', cells: ['Cross-encoder'] },
            ]}
          />
        </div>

        <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
          <p>
            But a floor only a cosine can open has its own blind spot: a cosine cannot see
            past vocabulary, so a passage answering an abstractly phrased question while
            sharing no words with it gets fetched and then discarded. So the cross-encoder
            gets one narrow power back — above a bar noise cannot reach, it may admit what
            the cosine rejected. That bar was <strong>fitted, not guessed</strong>. A
            hand-picked probe suggested 0.40, and 0.40 rescued nothing.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-5)' }}>
          <DataTable
            caption="Sweep of the rescue bar. 0.2 strictly dominates: identical rejection to switching the rescue off, and better delivery."
            columns={[
              { header: 'Bar' },
              { header: 'Delivered', numeric: true },
              { header: 'Drops', numeric: true },
              { header: 'Rejects off-topic', numeric: true },
            ]}
            rows={[
              { head: '0.0 — the original broken design', cells: ['0.94', '0', '0.00'] },
              { head: '0.1', cells: ['0.84', '3', '0.50'] },
              { head: '0.2', cells: ['0.84', '3', '0.83'], highlight: true },
              { head: '0.3 / off', cells: ['0.81', '4', '0.83'] },
            ]}
            note="The noise boundary sits between 0.1 and 0.2 — narrower than the probe implied, and not somewhere guessing would have landed. It took three designs; the first two lost, and the third is why the reranker is on by default."
          />
        </div>
      </Section>

      <Section label="4 — Is the bottleneck what gets fetched?" id="hyde" index="05">
        <div className="prose">
          <p>
            Everything above works on candidates the search already returned. A chunk the
            bi-encoder ranks below the floor is never fetched, so none of them can ever see
            it. That can only be fixed at the query.
          </p>
          <p>
            <strong>HyDE</strong> asks the model to draft the answer it would expect and
            searches with that instead of the question. The draft is usually wrong on
            specifics — it is inventing an answer about documents it has never read — and
            that doesn't matter. It only has to be wrong in the right{' '}
            <em>neighbourhood</em>, written in the register of a document rather than a
            question. Passage-to-passage similarity is what the encoder is actually good at.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-5)' }}>
          <DataTable
            caption="How far the search vector moves from the question toward the draft."
            columns={[
              { header: 'Weight' },
              { header: 'Delivered', numeric: true },
              { header: '@1', numeric: true },
              { header: 'MRR', numeric: true },
              { header: 'Rejects', numeric: true },
            ]}
            rows={[
              { head: '0.0 — plain query', cells: ['0.81', '0.56', '0.626', '0.67'] },
              { head: '0.5 — blended', cells: ['0.88', '0.50', '0.611', '0.83'], highlight: true },
              { head: '1.0 — classic HyDE', cells: ['0.81', '0.47', '0.584', '0.83'] },
            ]}
            note="Searching with the draft alone scores no better than not using HyDE at all — an invented answer about an unread corpus points somewhere plausible-but-wrong often enough to cancel what it gains. Keeping the question in the vector is what makes it work. Weight 0.0 reproducing plain fusion to three decimals is the control that says these arms differ by HyDE and nothing else."
          />
        </div>

        <div className="prose" style={{ marginTop: 'var(--s-5)' }}>
          <p>
            It produces the best delivered rate in the project and{' '}
            <strong>defaults to off</strong>, entirely because of latency: p50 goes from 21
            ms to 6,192 ms, one LLM call before retrieval even starts. With drafts cached
            the same arm runs at 30 ms — so HyDE's own overhead is about 9 ms and the rest
            is network. The cost is real, but it is <em>cacheable</em>, and a corpus whose
            queries repeat would pay it once.
          </p>
        </div>
      </Section>

      <Section label="What the labelled set caught" id="reversal" index="06">
        <Callout label="The regression that wasn't">
          <p>
            On the original 38-question set the reranker appeared to <em>cost</em> recall@1,
            0.56 → 0.50. That was written up as its one real regression, and stood
            documented as a finding for exactly as long as the set was too small to see
            through it.
          </p>
          <p>
            On 89 questions it <strong>reverses</strong>: 0.53 → 0.56. The regression was a
            handful of questions of noise.
          </p>
          <p>
            This is the strongest argument in the project for owning a labelled set rather
            than trusting a spot check — and equally the warning that comes with it. Several
            sweeps were fitted against the smaller set; the rescue bar was re-fitted and
            held, and the rest should be read as historical until they get the same
            treatment.
          </p>
        </Callout>
      </Section>

      <Section label="Limitations" id="limitations" index="07">
        <div className="prose">
          <p>Known and deliberate, not oversights.</p>
        </div>

        <ul className="list" style={{ marginTop: 'var(--s-5)' }}>
          <li>
            <strong>Chunking is structural, not semantic.</strong> Pages split on paragraph
            and heading boundaries into token-bounded overlapping windows — a large
            improvement on one-chunk-per-page, but still using layout as a proxy for topic
            structure, which a PDF with poor heading markup won't provide.
          </li>
          <li>
            <strong>The relevance floor is a hand-set constant.</strong> Genuine but weakly
            phrased matches can land just under it and get dropped.
          </li>
          <li>
            <strong>Bi-encoder retrieval is weak on abstract questions.</strong> Swapping in
            a QA-tuned encoder was measured and did not help. The reranker orders what was
            fetched; it cannot see a chunk that was never fetched at all.
          </li>
          <li>
            <strong>The evaluation corpus is small</strong> — 89 questions over four
            documents, labelled by one person — and every tuning decision rests on it.
          </li>
          <li>
            <strong>Cache invalidation is TTL-only for corpus changes.</strong> Every
            retrieval and generation setting is hashed into the cache key, so config changes
            are handled; it is the corpus the key cannot see.
          </li>
          <li>
            <strong>Single-node Postgres as the vector store.</strong> Correct at this scale,
            not at a much larger one — and an IVFFlat index at this row count silently
            returned zero image results, so a sequential scan is both simpler and exact here.
          </li>
        </ul>
      </Section>
    </CaseStudyShell>
  );
}
