// app/about/page.tsx

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">About Mentari Project</h1>
      <div className="space-y-4 text-gray-700">
        <p>
          Founded in 2025, Mentari Project has been the leading partner for corporate team building, leadership training, and unforgettable outbound experiences in Bandung and the surrounding West Java area.
        </p>
        <p>
          Our mission is {`"Together We Achieve More."`} We believe that well-designed, fun, and challenging activities can unlock a {`Team's`} true potential, fostering communication, trust, and a shared sense of purpose.
        </p>
        <p>
          Our team consists of certified facilitators and safety experts dedicated to providing a safe, engaging, and impactful experience for every client.
        </p>
      </div>
    </div>
  );
}