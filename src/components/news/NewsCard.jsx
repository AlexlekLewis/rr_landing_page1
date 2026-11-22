import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { storyPath } from './news';

// A story card: photo with the brand label, date, headline, one-line summary, "Read".
// `lead` makes the big featured card at the top of /news.
const NewsCard = ({ story, lead = false }) => {
    const isVideo = story.type === 'video';
    return (
        <Link to={storyPath(story.id)} data-cta={`news-card-${story.id}`}
            className={`group flex ${lead ? 'flex-col lg:flex-row' : 'flex-col'} h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-rr-pink/40 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-rr-pink/40`}>
            <div className={`relative overflow-hidden bg-slate-200 ${lead ? 'aspect-video lg:aspect-auto lg:w-[58%] lg:min-h-[360px]' : 'aspect-video'}`}>
                {story.image && (
                    <img src={story.image} alt="" loading={lead ? 'eager' : 'lazy'} decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <span className="absolute top-3 left-3 bg-rr-pink text-white text-[10px] font-black uppercase tracking-[0.16em] rounded-full px-3 py-1.5">
                    {story.brand}
                </span>
                {isVideo && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-rr-pink/90 flex items-center justify-center"><Play className="w-6 h-6 text-white ml-0.5" fill="white" /></span>
                    </span>
                )}
            </div>
            <div className={`flex flex-1 flex-col gap-2 ${lead ? 'p-6 md:p-8 lg:justify-center' : 'p-5'}`}>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-rr-charcoal/60">
                    {story.date} · {isVideo ? 'Video' : 'Feature'}
                </span>
                <span className={`font-black text-rr-dark leading-tight ${lead ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{story.title}</span>
                <span className={`text-rr-charcoal/80 leading-relaxed ${lead ? 'text-base' : 'text-sm'}`}>{story.excerpt}</span>
                <span className="mt-auto pt-2 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-rr-pink">
                    {isVideo ? 'Watch' : 'Read'} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
            </div>
        </Link>
    );
};

export default NewsCard;
