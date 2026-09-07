/**
 * The direct-charge flow for one tip: the charge is created on the professional's
 * connected account, while the backend controls the platform application fee.
 */
export function MoneyFlow() {
  return (
    <svg
      className="diagram diagram--animate"
      viewBox="0 0 900 330"
      role="img"
      aria-labelledby="money-flow-title money-flow-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="money-flow-title">How one tip moves through the platform</title>
      <desc id="money-flow-desc">
        A tipper taps their card on a Stripe Terminal reader. The PaymentIntent is created
        on the professional&apos;s connected account for twenty-three dollars. The backend
        controls the one dollar and fifteen cents application fee, and the remaining balance
        is shown before Stripe processing fees.
      </desc>

      <defs>
        <marker
          id="money-arrow"
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

      {/* Card */}
      <rect className="diagram__box" x="20" y="130" width="140" height="54" rx="4" />
      <text className="diagram__label" x="90" y="154" textAnchor="middle">
        Tipper’s card
      </text>
      <text className="diagram__sub" x="90" y="170" textAnchor="middle">
        $23.00
      </text>
      <path className="diagram__edge" d="M160,157 L195,157" markerEnd="url(#money-arrow)" />

      {/* Reader */}
      <rect className="diagram__box" x="195" y="130" width="150" height="54" rx="4" />
      <text className="diagram__label" x="270" y="154" textAnchor="middle">
        Terminal reader
      </text>
      <text className="diagram__sub" x="270" y="170" textAnchor="middle">
        card_present
      </text>
      <path className="diagram__edge" d="M345,157 L380,157" markerEnd="url(#money-arrow)" />

      {/* Connected account */}
      <rect
        className="diagram__box diagram__box--accent"
        x="380"
        y="130"
        width="180"
        height="54"
        rx="4"
      />
      <text className="diagram__label" x="470" y="154" textAnchor="middle">
        Connected account
      </text>
      <text className="diagram__sub" x="470" y="170" textAnchor="middle">
        direct charge
      </text>

      {/* Split */}
      <path
        className="diagram__edge"
        d="M560,145 L590,145 L590,80 L620,80"
        markerEnd="url(#money-arrow)"
      />
      <path
        className="diagram__edge"
        d="M560,170 L590,170 L590,200 L620,200"
        markerEnd="url(#money-arrow)"
      />

      <rect className="diagram__box" x="620" y="58" width="230" height="44" rx="4" />
      <text className="diagram__label" x="735" y="76" textAnchor="middle">
        Platform fee · $1.15
      </text>
      <text className="diagram__sub" x="735" y="92" textAnchor="middle">
        application_fee_amount: 115
      </text>

      <rect className="diagram__box" x="620" y="178" width="230" height="44" rx="4" />
      <text className="diagram__label" x="735" y="196" textAnchor="middle">
        Gross less fee · $21.85
      </text>
      <text className="diagram__sub" x="735" y="212" textAnchor="middle">
        Express, owned by the professional
      </text>

      {/* Payout */}
      <path className="diagram__edge" d="M735,222 L735,258" markerEnd="url(#money-arrow)" />
      <rect className="diagram__box" x="620" y="258" width="230" height="44" rx="4" />
      <text className="diagram__label" x="735" y="276" textAnchor="middle">
        Professional’s bank
      </text>
      <text className="diagram__sub" x="735" y="292" textAnchor="middle">
        payout, triggered in-app
      </text>
    </svg>
  );
}
