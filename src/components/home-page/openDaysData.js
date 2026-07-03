// The three open training days, in display order. Mickleham is first ("highest")
// because it's the soonest (this Sunday). Each links to its own landing page via a
// full-page navigation so the global Meta Pixel PageView fires on arrival.
export const OPEN_DAYS = [
    {
        slug: 'mickleham',
        name: 'Mickleham',
        region: "Melbourne's North",
        date: 'Sunday 5 July',
        time: '9am – 12pm',
        venue: 'Mickleham Indoor Sports Centre',
        badge: 'This Sunday',
        highlight: true,
    },
    {
        slug: 'williamstown',
        name: 'Williamstown',
        region: "Melbourne's West",
        date: 'Friday 10 July',
        time: '9am – 12pm',
        venue: 'The Netz',
    },
    {
        slug: 'hallam',
        name: 'Hallam',
        region: "Melbourne's South East",
        date: 'Friday 10 July',
        time: '1 – 4pm',
        venue: 'Elite Cricket Centre',
    },
];
