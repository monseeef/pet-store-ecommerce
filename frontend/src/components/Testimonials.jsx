const Testimonials = () => {
  // Sample testimonials data
  const testimonials = [
    { id: 1, name: 'John Doe', comment: 'Great store! I love the variety of products.' },
    { id: 2, name: 'Jane Smith', comment: 'Amazing customer service! Highly recommended.' },
    // Add more testimonials as needed
  ];

  return (
    <section className="bg-gray-100 p-8">
      <div className="flex flex-wrap justify-center gap-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="max-w-md p-4 bg-white rounded-lg shadow-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <p className="text-gray-600 italic">
              &quot;{testimonial.comment}&quot;
            </p>
            <p className="text-gray-800 font-semibold mt-4">
              - {testimonial.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
