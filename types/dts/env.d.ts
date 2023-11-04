import type { Sentry } from '@sentry/node';
import type { Auth } from '../auth.model';

declare module 'h3' {
  interface H3EventContext {
    $sentry?: Sentry;
    auth?: Auth;
  }
}
