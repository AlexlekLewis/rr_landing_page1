import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import PartnerStack from '../power-game/PartnerStack';
import NotFound from '../NotFound';
import ShareBar from './ShareBar';
import HomeNews from './HomeNews';
import { ProgramsCta } from './NewsPage';
import { useStories } from './news';
import usePageAnalytics from '../../hooks/usePageAnalytics';

// A story's own page, /news/<slug>: the link people copy and share. Same layout as a story
// on the Power Cricket site: photo or video, label and date, headline, share buttons, the
// story, its photos, share again, then "More news".
const SECTIONS = ['story', 'more', 'programs'];

const StoryPage = () => {
    const { slug } = useParams();
    const { stories, ready } = useStories();
    const story = stories.find((s) => s.id === slug);
    usePageAnalytics(`/news/${slug}`, { sections: SECTIONS });
    useEffect(() => { window.scrollTo(0, 0); }, [slug]);
    // A story shared from Power Cricket arrives with its feed: wait for it before saying "not found".
    if (!story && !ready) return <div className="min-h-screen bg-slate-50" aria-busy="true" />;
    if (!story) return <NotFound />;

    return (
        <div className="min-h-screen bg-white text-rr-dark font-sans flex flex-col selection:bg-rr-pink selection:text-white relative">
            <Navbar variant="coaches" navLinksOverride={[]} ctaLabelOverride="EXPLORE PROGRAMS" ctaTargetOverride="programs-cta" />
            <main className="flex-1 w-full overflow-hidden">
                <article id="story" className="pt-28 md:pt-36 pb-12 bg-slate-50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Link to="/news" className="mb-5 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.16em] text-rr-charcoal/60 hover:text-rr-pink">
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> All news
                        </Link>
                        <div className="overflow-hidden rounded-3xl bg-white border border-slate-200">
                            <div className="relative aspect-video bg-black">
                                {story.youtubeId ? (
                                    <iframe src={`https://www.youtube-nocookie.com/embed/${story.youtubeId}`} title={story.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="absolute inset-0 w-full h-full border-0" />
                                ) : story.image && (
                                    <img src={story.image} alt={story.heroAlt || ''} className="absolute inset-0 w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="px-6 md:px-10 pt-7 pb-10">
                                <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-bold uppercase tracking-[0.14em] text-rr-charcoal/60">
                                    <span className="bg-rr-pink text-white font-black rounded-full px-3 py-1">{story.brand}</span>
                                    <span>{story.date}</span>
                                </p>
                                <h1 className="text-2xl md:text-4xl font-black text-rr-dark leading-tight mb-6">{story.title}</h1>
                                <div className="mb-8"><ShareBar story={story} /></div>
                                {story.body.map((p, i) => (
                                    <p key={i} className="mb-4 text-base md:text-[17px] leading-relaxed text-rr-charcoal">{p}</p>
                                ))}
                                {story.gallery.length > 0 && (
                                    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {story.gallery.map((g) => (
                                            <img key={g.src} src={g.src} alt={g.alt || ''} loading="lazy" decoding="async" className="w-full object-cover rounded-2xl" style={{ aspectRatio: story.galleryAspect || '4/3' }} />
                                        ))}
                                    </div>
                                )}
                                {story.source && (
                                    <p className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 text-sm text-rr-charcoal/80">
                                        <span className="font-black text-rr-dark">From {story.source.name}.</span> {story.source.note}
                                    </p>
                                )}
                                {story.cta && (
                                    <a href={story.cta.href} data-cta={`news-story-cta-${story.id}`}
                                        className="mt-8 inline-flex items-center gap-2 bg-rr-pink hover:bg-rr-light-pink text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-full px-6 py-3.5 transition-colors">
                                        {story.cta.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                    </a>
                                )}
                                <div className="mt-10 border-t border-slate-200 pt-6">
                                    <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-rr-charcoal/60">Share this story</p>
                                    <ShareBar story={story} />
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
                <div id="more">
                    <HomeNews eyebrow="Keep reading" title={<>More <span className="text-rr-pink">news</span></>} excludeId={story.id} />
                </div>
                <ProgramsCta />
            </main>
            <PartnerStack />
            <Footer />
        </div>
    );
};

export default StoryPage;
