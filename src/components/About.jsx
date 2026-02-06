import React from "react";
import FeatureCard from "./FeatureCard";
import { Lock, Truck, Activity, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: UserCheck,
      title: "Verified Farmers",
      description:
        "Every seller is vetted to ensure healthy livestock and reliable transactions",
    },
    {
      icon: Truck,
      title: "Secure Logistics",
      description:
        "Professional transport management for safe and transparent livestock delivery",
    },
    {
      icon: Lock,
      title: "Escrow Payments",
      description:
        "Total transparency with secure funds management for both buyers and sellers",
    },
    {
      icon: Activity,
      title: "Vet Support",
      description:
        "Round-the-clock access to veterinary expertise and livestock health traceability",
    },
  ];

  return (
    <>
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#16a34a15_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.9] mb-6">
              Pioneering <br />
              <span className="text-green-600 font-black">
                Digital Agriculture
              </span>
            </h2>
            <p className="text-green-600 font-bold uppercase text-[10px] tracking-[0.4em]">
              Everything you need to trade livestock with total transparency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[48px] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-green-900/20">
          {/* Decorative green glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-600 rounded-full blur-[120px] opacity-10" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
              Ready To Modernize <br /> Your Trade?
            </h2>
            <p className="text-slate-400 max-w-lg text-sm md:text-base font-medium mb-10 leading-relaxed">
              Join a community of trusted farmers and buyers. Start trading
              cattle, sheep, and goats with secure logistics.
            </p>

            <Link
              to="/signup"
              className="group flex items-center gap-3 px-10 py-5 bg-green-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 transition-all shadow-xl active:scale-95">
              Get Started Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
