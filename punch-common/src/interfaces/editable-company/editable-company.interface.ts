/**
 * Info about key-person, it can be edited by user
 */
export interface KeyPeople {
  name?: string;
  title?: string;
  linkedIn?: string;
  email?: string;
  twitter?: string;
}

/**
 * Info about company which can be edited by user
 */
export interface EditableCompany {
  id?: string;
  companyName?: string;
  status?: string;
  numberOfEmployees?: string;
  dateFounded?: string;
  websiteLink?: string;
  linkedInURL?: string;
  twitterURL?: string;
  facebookURL?: string;
  instagramURL?: string;
  fundingAmount?: string;
  fundingRounds?: number;
  lastRound?: string;
  keyPeople?: KeyPeople[];
  revenue?: string;
  description?: string;
  categories?: string[];
  foundersNames?: string[];
}
