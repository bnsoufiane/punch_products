import {KeyValue} from './key-value.interface';
import {OpeningHours} from './opening-hours.interface';
import {Rating} from 'ng2-bootstrap/ng2-bootstrap';

export interface LocalBusiness {
  name: string;
  website: string;
  owners: [string];
  dateFounded: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  neighborhood: string;
  country: string;
  categories: [string];
  email: string;
  phone: string;
  coordinates: [string];
  partOfChain: boolean;
  facebook: string;
  twitter: string;
  yelpUrl: string;
  yelpAvatar: string;
  priceRange: string;
  priceDescription: string;
  healthInspection: string;
  hours: OpeningHours;
  reviews: Rating;
  yelpingSince: string;
  additionalInfo: [KeyValue];
  source: string;
}
