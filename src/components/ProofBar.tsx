const stats = [
  { value: '38', label: 'Years operating' },
  { value: '140+', label: 'Countries served' },
  { value: '99.2%', label: 'On-time clearance' },
  { value: '24/7', label: 'Route desk' },
];

export default function ProofBar() {
  return (
    <section className="proofbar" aria-label="Meridian by the numbers">
      <div className="wrap proofbar__wrap">
        {stats.map((stat) => (
          <div className="proofbar__item" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
