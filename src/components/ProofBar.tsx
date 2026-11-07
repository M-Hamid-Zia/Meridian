const stats = [
  { value: '38', label: 'Years operating' },
  { value: '140+', label: 'Countries served' },
  { value: '99.2%', label: 'On-time delivery' },
  { value: '24/7', label: 'Route desk' },
];

export default function ProofBar() {
  return (
    <section className="proofbar" aria-label="Meridian by the numbers">
      <div className="proofbar__inner">
        {stats.map((stat, index) => (
          <div className="proofbar__item" key={stat.label} data-reveal data-reveal-delay={index * 0.06}>
            <strong data-count={stat.value}>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
