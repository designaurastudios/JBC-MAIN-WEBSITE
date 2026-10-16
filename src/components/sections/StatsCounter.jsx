import React, { useState, useEffect, useRef } from 'react';
import { FaBuilding, FaUsers, FaAward, FaCalendarAlt } from 'react-icons/fa';
import { FadeIn } from '../ui/FadeIn';

function CounterNumber({ target, suffix = '', duration = 1200, inView = false }) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    let startTime = null;
    let animationFrameId;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeOut * target);

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, target, duration]);

  return (
    <span className="tabular-nums font-extrabold tracking-tight">
      {inView ? count : 0}
      {suffix}
    </span>
  );
}

const stats = [
  {
    target: 180,
    suffix: '+',
    label: 'Projects Completed',
    description: 'Flats, bathrooms & building plumbing',
    icon: FaBuilding,
    color: 'text-brand-water'
  },
  {
    target: 150,
    suffix: '+',
    label: 'Happy Clients',
    description: 'Homeowners, CHS & civil contractors',
    icon: FaUsers,
    color: 'text-amber-500'
  },
  {
    target: 11,
    suffix: '+',
    label: 'Years Experience',
    description: 'Proven track record in Mumbai',
    icon: FaAward,
    color: 'text-emerald-500'
  },
  {
    target: 2015,
    suffix: '',
    label: 'Serving Since',
    description: 'Serving Mumbai since 2015',
    icon: FaCalendarAlt,
    color: 'text-brand-water'
  }
];

export function StatsCounter() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-10 sm:py-12 bg-white border-b border-brand-border relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-brand-offwhite/60 border border-brand-border/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-brand-steel hover:bg-white hover:shadow-card transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                      <CounterNumber target={stat.target} suffix={stat.suffix} duration={1200} inView={inView} />
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white border border-brand-border flex items-center justify-center shadow-xs">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-brand-heading uppercase tracking-wider">
                      {stat.label}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
