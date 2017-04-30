import React from 'react';
import ReactDOM from 'react-dom';

import {hideElement} from './util';
import {searchForContentItems, deleteContentItem} from './server';

// Each major browser view user interface must be imported.
import UInavbar from './components/ui-navbar.js';
import UIsidebar from './components/ui-sidebar.js';
import Template from './components/template.js';
import UIcalendar from './components/ui-calendar.js';
import UIfileEditor from './components/ui-fileEditor.js';
import UIfileExplorer from './components/ui-fileExplorer.js';
import UImaps from './components/ui-maps.js';
import UInotes from './components/ui-notes.js';

if (document.getElementById('template') !== null) {
  ReactDOM.render(
    <Template />,
    document.getElementById('template')
  );
}
