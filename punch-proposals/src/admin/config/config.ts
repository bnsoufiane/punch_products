/**
 * Keys used in local storage operations.
 * @enum {string}
 * @const
 */
const STORAGEKEYS = {
  'AUTH_TOKEN': 'user:authToken',
  'CURRENT_USER': 'user:currentUser'
};

/**
 * Endpoint events for resources.
 * @enum {string}
 */
const EVENTS = {
  USERS_LOGOUT: 'users:logout'
};


/**
 * value injected by gulp task based on dev or prod
 * kindly define DEV_API_BASE and PROD_API_BASE in /tools/config/project.config.ts
 * @type {string}
 */
const API_BASE = 'inject:API_BASE';
/**
 * Endpoint url.
 * @enum {string}
 */
const URI = {
  BASE: `${API_BASE}/api/`
};

/**
 * Error messages
 */
const ERRORS = Object.freeze({
  VIDEO_TOO_LARGE: 'Video too large, it should be less than 30mb',
  IMAGE_TOO_LARGE: 'Image too large, it should be less than 10mb'
});
/**
 * Size limits of uploaded files in MB
 */
const LIMITS = Object.freeze({
  VIDEO: 30,
  IMAGE: 10
});

/**
 * Number of items per page in pagination
 * @type {number}
 */
const PAGINATION = {
  ITEMS: 10
};

/**
 * Define the start of public routes which will
 * not require login permissions
 * e.g route 'candidate' will allow all routes
 * starting with candidate
 * @type {string[]}
 */
const PUBLIC_ROUTES = [
  'admin/login',
  'candidate',
  'proposal-live'
];
/**
 * portfolio samples
 * @type Portfolio[]
 */
const PORTFOLIO_SAMPLES = [
  {_id:1, title:'Cape Reservation Screen', image:'../admin/assets/images/proposals/portfolio/Cape-Reservation-ModalView.png',
    description:'Cape is a drone video service focused currently on ski resorts around North America. We helped build and design  ' +
    'there core customer service app to manage, carry out, ' +
    'reservations in the field. We also designed and built there core drone controler app to manage drone communication in the field.',
    link:'http://www.punch-agency.com/clients/cape/'},
  {_id:2, title:'Cape Drone Operator', image:'../admin/assets/images/proposals/portfolio/capedrone.png',
    description:'Cape is a drone video service focused currently on ski resorts around North America. We helped build and design  ' +
    'there core customer service app to manage, carry out, ' +
    'reservations in the field. We also designed and built there core drone controler app to manage drone communication in the field.',
    link:'http://www.punch-agency.com/clients/cape/'},
  {_id:3, title:'Cape Waiver Signing', image:'../admin/assets/images/proposals/portfolio/CapeWaiver.png',
    description:'Cape is a drone video service focused currently on ski resorts around North America. We helped build and design  ' +
    'there core customer service app to manage, carry out, ' +
    'reservations in the field. We also designed and built there core drone controler app to manage drone communication in the field.',
    link:'http://www.punch-agency.com/clients/cape/'},
  {_id:4, title:'Insikt', image:'../admin/assets/images/proposals/portfolio/insikt1.png',
    description:' Insikt is a white-label loan origination and investing platform that enables any brand to lend its ' +
    'customers and any accredited investor to invest in consumer loan portfolios. We helped design and build several of' +
    ' there white labeled products from the ground up.',
    link:'http://www.punch-agency.com/clients/insikt/'},
  {_id:5, title:'Insikt Lendify', image:'../admin/assets/images/proposals/portfolio/insikt2.png',
    description:' Insikt is a white-label loan origination and investing platform that enables any brand to lend its ' +
    'customers and any accredited investor to invest in consumer loan portfolios. We helped design and build several of' +
    ' there white labeled products from the ground up.',
    link:'http://www.punch-agency.com/clients/insikt/'},
  {_id:6, title:'Cinemarun iOS App', image:'../admin/assets/images/proposals/portfolio/Cinemarun-Detail-Poster-Pixels-with-Shadow.png',
    description:'Cinemarun is a internal app we built to solve our frustrations of finding great movies playing nearby quickly.' +
    ' From the app you can purchase tickets, see reviews, bookmark and track favroites, and so much more.',
    link:'http://www.punch-agency.com/services/design/'},
  {_id:7, title:'Kon Mari iOS App', image:'../admin/assets/images/proposals/portfolio/konmari.png',
    description:'New York Times bestselling author Marie Kondo has forever changed the way we tidy and in the process taught us more ' +
    'about ourselves beyond the home. Punch has worked closely with KonMari Media as they launch their digital presence.',
    link:'http://www.punch-agency.com/clients/konmari/'},
  {_id:8, title:'Vantage iOS App', image:'../admin/assets/images/proposals/portfolio/Vantage.png',
    description:'Vantage is building a consumer drone that is lightweight and safe to fly with its guarded blades. We helped them ' +
    'design and build there core iOS controller app from ground up.',
    link:'http://www.punch-agency.com/clients/vantage/'},
  {_id:9, title:'Twice tote bag', image:'../admin/assets/images/proposals/portfolio/twice-tote.jpg',
    description:'Twice was a second hand clothing company we helped across all of design.',
    link:'http://www.punch-agency.com/services/design/'},
  {_id:10, title:'Sochat Poster', image:'../admin/assets/images/proposals/portfolio/sochat-poster.jpg',
    description:'Sochat is a consumer messaging app for iOS and Android. Punch was brought on to' +
    ' redesign their branding and website. We introduced a fresh, youthful, and optimistic brand ' +
    'to capture a larger market for Sochat as it grew in the US.',
    link:'http://www.punch-agency.com/clients/sochat/'},
  {_id:11, title:'Medifriend Manager', image:'../admin/assets/images/proposals/portfolio/medifriend.png',
    description:'Medifriend is a pharmacist-driven company that operates on-site contracted pharmacies under an HRSA/OPA designated' +
    ' in-house model. We helped design and build there core consumer facing product.',
    link:'http://www.punch-agency.com/clients/medifriend/'},
  {_id:12, title:'Source.hr', image:'../admin/assets/images/proposals/portfolio/sourcehr.png',
    description:'Source.hr is a recruiting tool we helped build from the ground up for 1Page. With Source.hr you can refine, capture,' +
    ' and manage your talent pool to make recruiting as smooth and easy as possible.' +
    'that collects data on millions of candidates and aggregates down to what you are looking for easily.',
    link:'http://www.source.hr/'},
  {_id:13, title:'David Sanghera Site', image:'../admin/assets/images/proposals/portfolio/Sanghera.png',
    description:'David Sanghera is VP of Product at 1 Page and reached out to us to help him ship a custom personal ' +
    'site that he can share his findings and thoughts.',
    link:'http://www.punch-agency.com/services/design/'},
];
/**
 * Testimonials
 * @type {}[]
 */
const TESTIMONIALS = [
  {_id:1, name:'Arash Namvar, Engineer', company:'FogHorn Systems', testimonial:'Thanks dude. You’re saving my butt more ' +
  'than you could ever imagine #blessed #myhero lol.'},
  {_id:2, name:'Nathan Beckord, CEO', company:'Foundersuite', testimonial:'Punch took the time to really understand our needs — ' +
  'both on the technical side, and on the company culture side — and delivered an excellent engineer who is doing great work'},
  {_id:2, name:'John Dip, CEO', company:'LeafHoppr', testimonial:'The team at Punch has it all. They come up with great ideas ' +
  'and know how to execute them.'},
  {_id:2, name:'Justin Grant, Founder', company:'ScrubPay', testimonial:'Everyone at Punch is of superior quality and provides a ' +
  'very high level of professional services. At ScrubPay we continue to be pleased with our ongoing interactions with Punch.'},
];
/**
 * Proposal pre-made strings
 */
const PROPOSAL_PREMADE_STRINGS = {
  overview: 'Info about the project and client will go here to kick things off. \nPunch offers the following ' +
  'proposal with estimated costs, resources, timeline, team, and deliverables for Client to review. Enjoy.',
  scope: 'Punch aims to provide a thought-fully designed and technically sound product Client.',
  breakdown: 'Here you can explain and give context to the pricing and breakdown that will be displayed below.'
};
/**
 * Inserts
 */
const INSERTS = [
  {
    title:'Punch Staffing',
    paragraph:'Our staffing division can help you find the perfect developer — full time — on-site at your office. All our' +
    ' developers are first hired directly by Punch and placed on internal Punch projects before ever being placed at a client' +
    ' site. The end result is tested, quali- fied developers who can step in and help you immediately, versus blindly pushing' +
    ' resumes around like the rest of the industry.'
  },
  {
    title:'Talent Division',
    paragraph:'Our talent division can help you find the perfect developer, full time, on-site at your office. All of our developers' +
    ' are first hired directly by Punch and placed on internal Punch projects before ever being placed at a client site. The end result' +
    ' is tested, qualified developers who can step in and help you immediately versus blindly pushing resumes around like the rest of ' +
    'the industry.'
  },
  {
    title:'Punch Demand',
    paragraph:'You’ve built a beautiful product and you have a standout team. But how do you get the word out to potential customers?' +
    ' Punch can partner with you to plan, run, iterate, and perfect a marketing and sales service for your company. all on a performance' +
    ' marketing basis. Our sales and marketing teams can work independently from your core office and business to deliver fiscal sense.'
  },
  {
    title:'Engineering: Rapid Response',
    paragraph:'Finding the perfect development partner to build your internal team cannot be rushed and is mission critical' +
    ' to the long term success of your company. The reality is your product cannot wait while you are trying to find the perfect' +
    ' fit. The Punch Rapid Response team can come to the rescue with our San Francisco based, former Google, Engineers and be live' +
    ' working on your project within 7 days to move your project forward while our talent division is helping you nd the perfect fit.'
  },
  {
    title:'Engineering: Non-Core',
    paragraph:'Are you distracted by projects that are not within your current Dev Stack? Do you need API work, Streaming, Android or' +
    ' real User Experience Design? Punch specializes in filling the holes within your current team on non-core work to allow your team' +
    ' to focus on making a great product.'
  },
];
/**
 * Freezes the object.
 * @const {Object}
 */
export const CONFIG = Object.freeze({
  STORAGE_KEYS: Object.freeze(STORAGEKEYS),
  EVENTS: Object.freeze(EVENTS),
  URI: Object.freeze(URI),
  PAGINATION: Object.freeze(PAGINATION),
  LIMITS: Object.freeze(LIMITS),
  ERRORS: Object.freeze(ERRORS),
  PUBLIC_ROUTES: Object.freeze(PUBLIC_ROUTES),
  PORTFOLIO_SAMPLES: Object.freeze(PORTFOLIO_SAMPLES),
  PROPOSAL_PREMADE_STRINGS: Object.freeze(PROPOSAL_PREMADE_STRINGS),
  TESTIMONIALS: Object.freeze(TESTIMONIALS),
  INSERTS: Object.freeze(INSERTS)
});
