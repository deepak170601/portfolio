import { Chart } from '../../components/Chart';
import { Callout } from '../../components/Callout';
import { DataTable } from '../../components/DataTable';
import { Figure } from '../../components/Figure';
import { Section } from '../../components/Section';
import { MoneyFlow } from '../../components/diagrams/MoneyFlow';
import { tippingOnTap } from '../../content/projects';
import { CaseStudyShell } from '../CaseStudyShell';

export function TippingOnTapPage() {
  return (
    <CaseStudyShell project={tippingOnTap}>
      <Section label="The product" id="product" index="01">
        <div className="prose">
          <p>
            Tipping is a cash habit in a world that has largely stopped carrying cash. The
            people it costs are the ones who depend on it — barbers, valets, bartenders,
            performers. TippingOnTap gives a service professional a card reader and a
            payout account of their own, so a tip that would not have happened can.
          </p>
          <p>
            The product is a React Native mobile app backed by an ASP.NET Core API on .NET 10.
            It owns phone and email verification, Stripe Connect onboarding, event management,
            Android Tap to Pay collection, payout readiness, event earnings, and support
            requests whose delivery credentials stay on the server.
          </p>
        </div>
      </Section>

      <Section label="The lifecycle" id="lifecycle" index="02">
        <ul className="list">
          <li>
            <strong>Sign up.</strong> Phone OTP and email OTP are both verified before
            registration is allowed. Creating the user also creates their Stripe Express
            account.
          </li>
          <li>
            <strong>Onboard with Stripe.</strong> The professional completes KYC and bank
            details on a Stripe-hosted page. An <code>account.updated</code> webhook flips{' '}
            <code>charges_enabled</code> and <code>payouts_enabled</code> on their record,
            and a status endpoint re-checks live against Stripe rather than trusting the
            stored flag.
          </li>
          <li>
            <strong>Run an event.</strong> A professional creates an event with its own tip
            options and starts it — and may only have{' '}
            <strong>one active event at a time</strong>, which is what keeps a tip
            unambiguous about which shift it belongs to.
          </li>
          <li>
            <strong>Collect tips.</strong> The collection screen prepares Tap to Pay in advance.
            Reader discovery and Terminal location resolution run concurrently, the connection
            is reused between customers, and the backend captures the card-present PaymentIntent.
          </li>
          <li>
            <strong>Get paid.</strong> Ending the event closes it out. The professional sees
            their earnings in-app, reads their real Stripe balance, and triggers a payout to
            the linked bank account.
          </li>
        </ul>
      </Section>

      <Section label="How the money moves" id="money" index="03">
        <div className="prose">
          <p>
            The app uses direct charges on the professional's connected Stripe account, with
            the application fee controlled by the backend. This keeps the platform commission
            out of the mobile client while giving the merchant a direct balance and payout view.
          </p>
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <Figure caption="A direct charge on the merchant's connected account. The backend sends the configured platform fee to Stripe; processing fees remain separate and are verified from the Stripe balance transaction.">
            <MoneyFlow />
          </Figure>
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <Chart
            label="How a twenty-three dollar tip splits"
            max={2300}
            rows={[
              {
                label: 'Before Stripe processing fee',
                value: 2185,
                display: '$21.85',
                emphasis: true,
              },
              { label: 'Platform fee (5%)', value: 115, display: '$1.15' },
            ]}
            caption="Example: a $23.00 gross tip with the backend's default 5% platform commission. Stripe processing fees are separate."
          />
        </div>

        <div style={{ marginTop: 'var(--s-6)' }}>
          <DataTable
            caption="A $23.00 example, represented in the integer cents the API uses throughout."
            columns={[
              { header: 'Tip charged', numeric: true },
              { header: 'Platform fee (5%)', numeric: true },
              { header: 'Gross less platform fee', numeric: true },
            ]}
            rows={[
              {
                head: '$23.00',
                cells: ['$1.15', '$21.85'],
                highlight: true,
              },
            ]}
            note={
              <>
                Sent as <code>amount: 2300</code> and{' '}
                <code>application_fee_amount: 115</code>. Every amount in the API is an
                integer count of cents — there is no floating-point money anywhere in the
                system, which is the one decision in a payments codebase that is painful to
                revisit later. The professional's share is before Stripe's own processing
                fees, which Stripe deducts separately. The app's "Final Amount" is gross less
                platform fee, not the final merchant payout; Stripe's balance transaction is
                the source of truth for processing fees and net impact.
              </>
            }
          />
        </div>

        <Callout label="Platform fee vs Stripe fee">
          <p>
            The app calculates and returns its own platform commission: $1.15 on this $23.00
            example, leaving a reported $21.85 after the platform fee. That figure is before
            Stripe processing fees and is not a final payout.
          </p>
          <p>
            Using the current published US standard-rate illustration, Stripe processing would
            be about $0.77 ($0.621 + $0.05 + $0.10 Tap to Pay authorization), making the
            illustrative merchant net about $21.08. The app does not estimate or store that
            fee; the Stripe Dashboard balance transaction remains the source of truth.
          </p>
        </Callout>
      </Section>

      <Section label="Engineering notes" id="engineering" index="04">
        <ul className="list">
          <li>
            <strong>Two-factor sign-up by construction.</strong> Registration requires that
            both the phone and the email OTP have already been verified, so a partially
            verified account cannot exist in the first place.
          </li>
          <li>
            <strong>Rotating refresh tokens.</strong> A 2-hour JWT access token paired with
            a 30-day refresh token that is revoked and replaced on every use, so a refresh
            token cannot be replayed after it has been redeemed.
          </li>
          <li>
            <strong>Ownership and state checked in the service layer.</strong> Event
            transitions and tip recording verify both that the caller owns the event and
            that it is in a state that permits the operation, rather than trusting the
            client's id.
          </li>
          <li>
            <strong>Stripe state is re-read, not cached blindly.</strong> Capability flags
            arrive by webhook, but the status endpoint refreshes live from Stripe.
          </li>
          <li>
            <strong>Tap to Pay is prepared for the customer path.</strong> The app prewarms and
            reuses the phone reader connection, while the backend keeps one Fly machine warm
            to avoid a cold start during connection-token creation.
          </li>
          <li>
            <strong>Support credentials stay server-side.</strong> Contact Us routes through
            the backend using a server-generated CyberCloud token; recipients and daily
            credentials are deployment configuration, never values shipped in the APK.
          </li>
        </ul>
      </Section>
    </CaseStudyShell>
  );
}
