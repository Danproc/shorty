const UseCase = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 mb-4 bg-primary/20 rounded-2xl flex items-center justify-center text-4xl">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-base-content/70 text-sm">{description}</p>
    </div>
  );
};

// Use Cases section - Shows where and how the tools can be used
const Problem = () => {
  return (
    <section className="bg-base-200">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-extrabold text-3xl md:text-5xl tracking-tight mb-4">
            Perfect for Every Use Case
          </h2>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
            Whether you&apos;re a marketer, developer, or business owner, our tools
            help you share content more effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <UseCase
            icon="📱"
            title="Social Media"
            description="Share clean, short links on Twitter, Instagram, and LinkedIn"
          />
          <UseCase
            icon="📊"
            title="Marketing Campaigns"
            description="Track performance of your marketing links with built-in analytics"
          />
          <UseCase
            icon="🎫"
            title="Event Planning"
            description="Create QR codes for tickets, invitations, and event check-ins"
          />
          <UseCase
            icon="🏪"
            title="Business & Retail"
            description="Add QR codes to menus, products, and promotional materials"
          />
        </div>
      </div>
    </section>
  );
};

export default Problem;
