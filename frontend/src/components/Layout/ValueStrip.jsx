import './ValueStrip.css';

const ValueStrip = () => {
  const items = [
    { title: "EASY RETURNS", text: "Shop with confidence & enjoy easy returns. Exchanges are free." },
    { title: "SIZE & LENGTH OPTIONS", text: "We offer dresses in size and lengths." },
    { title: "DESIGNED IN LONDON SINCE 2009", text: "Female-led independent womenswear brand, prioritising small-batch production." }
  ];

  return (
    <section className="value-strip">
      {items.map((item, index) => (
        <div key={index} className="strip-item">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </section>
  );
};

export default ValueStrip;