import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NewsCard from './NewsCard';
import { latest } from './news';

// "News & features" strip: the three latest stories, with a link to /news. On the home page,
// and as "More news" under every story. Hidden when there are no stories to show.
const HomeNews = ({ eyebrow = 'News & features', title = <>The latest from <span className="text-rr-pink">the Academy</span></>, excludeId = null, tone = 'white' }) => {
    const stories = latest(3, excludeId);
    if (stories.length === 0) return null;
    return (
        <section className={`py-16 md:py-20 ${tone === 'grey' ? 'bg-slate-50' : 'bg-white'}`} data-home-news>
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold text-rr-pink uppercase tracking-[0.3em] mb-3">{eyebrow}</p>
                        <h2 className="text-3xl md:text-4xl font-black text-rr-dark uppercase tracking-tight">{title}</h2>
                    </div>
                    <Link to="/news" data-cta="news-all"
                        className="inline-flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-rr-dark hover:text-rr-pink transition-colors">
                        All news <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${stories.length >= 3 ? 'lg:grid-cols-3' : ''} gap-5`}>
                    {stories.map((s) => <NewsCard key={s.id} story={s} />)}
                </div>
            </div>
        </section>
    );
};

export default HomeNews;
