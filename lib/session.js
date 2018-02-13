/*
Copyright 2017 Super Adventure Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/nafundi/super-adventure/blob/master/NOTICE.

This file is part of Super Adventure. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of Super Adventure,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import Vue from 'vue';
import moment from 'moment';

const headers = () => Vue.prototype.$http.defaults.headers.common;

/*
A subclass of AbstractSession must:

  1. Define this._changedSinceLastPoll in its constructor.
  2. Override loggedIn().
  3. Override _updateAuthorizationHeader().
*/
class AbstractSession {
  loggedIn() {
    throw new Error('not implemented');
  }

  loggedOut() {
    return !this.loggedIn();
  }

  changedSinceLastPoll() {
    const changed = this._changedSinceLastPoll;
    this._changedSinceLastPoll = false;
    return changed;
  }

  _updateAuthorizationHeader() {
    throw new Error('not implemented');
  }

  updateGlobals() {
    Vue.prototype.$session = this;
    this._updateAuthorizationHeader();
  }
}

class LoggedOutSession extends AbstractSession {
  loggedIn() {
    return false;
  }

  _updateAuthorizationHeader() {
    delete headers().Authorization;
  }
}

class NeverLoggedInSession extends LoggedOutSession {
  constructor() {
    super();
    this._changedSinceLastPoll = false;
  }
}

class LoggedInSession extends AbstractSession {
  constructor({ token, expiresAt }, user) {
    super();
    this._token = token;
    this._expiresAt = moment.utc(expiresAt).valueOf();
    this._user = user;
    this._changedSinceLastPoll = true;
  }

  loggedIn() {
    return true;
  }

  _updateAuthorizationHeader() {
    headers().Authorization = `Bearer ${this._token}`;
  }

  get token() {
    return this._token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  get user() {
    return this._user;
  }
}

// A session that was logged in, but is now logged out.
class FormerlyLoggedInSession extends LoggedOutSession {
  constructor() {
    super();
    this._changedSinceLastPoll = true;
  }
}

// Sets or resets session-related globals to their initial states.
export function resetSession() {
  new NeverLoggedInSession().updateGlobals();
}

// Updates globals after login.
export function logIn(session, user) {
  new LoggedInSession(session, user).updateGlobals();
}

// Updates globals after logout.
export function logOut() {
  new FormerlyLoggedInSession().updateGlobals();
}