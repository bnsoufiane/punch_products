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
 * URL to punch accounts.
 */
const PUNCH_ACCOUNTS = 'inject:PUNCH_ACCOUNTS';

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
  ITEMS: 50
};

/**
 * Define the start of public routes which will
 * not require login permissions
 * e.g route 'admin/login' will allow all routes
 * starting with admin/login
 * @type {string[]}
 */
const PUBLIC_ROUTES = [];

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
  TESTIMONIALS: Object.freeze(TESTIMONIALS),
  INSERTS: Object.freeze(INSERTS),
  PRODUCTS: {
    PUNCH_ACCOUNTS
  }
});

// TODO(irtaza): as per verdi, editable field array should come from server
/**
 * Company fields which user can edit except _id
 * Name of these fields should correspond to fields in company schema (exact match)
 * These fields should remain in sync with EditableCompany interface
 *
 * @type {string[]}
 */
export const companyEditableFields = [
  'companyName',
  'status',
  'numberOfEmployees',
  'dateFounded',
  'websiteLink',
  'linkedInURL',
  'twitterURL',
  'facebookURL',
  'instagramURL',
  'fundingAmount',
  'fundingRounds',
  'lastRound',
  'categories',
  'foundersNames',
  'description',
  'keyPeople',
  'revenue',
  '_id' // Its id of source company whose edits are to be stored
];

// TODO(irtaza): as per verdi, editable field array should come from server
/**
 * KeyPeople fields which user can edit
 * Name of these fields should correspond to fields in company schema (exact match)
 * These fields should remain in sync with KeyPerson interface
 * @type {string[]}
 */
export const keyPeopleEditableFields = [
  'name',
  'title',
  'linkedIn',
  'twitter',
  'email',
];
