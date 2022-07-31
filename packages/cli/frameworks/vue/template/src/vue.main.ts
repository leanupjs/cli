import Vue, { Component } from 'vue';
import * as PACKAGE_JSON from 'vue/package.json';
import { CreateElement, VNode } from 'vue/types/umd';

import { run } from './app.run';
import App from './components/app/component.vue';
import { APP_HTML_ELEMENT } from './shares/constant';
import { typeIt } from './shares/utils';

const TYPED_PACKAGE_JSON = typeIt<{ version: string }>(PACKAGE_JSON);

// https://github.com/vuejs/vue-devtools
const ENVs = {
  NODE_ENV: '$$NODE_ENV$$',
};
Vue.config.devtools = ENVs.NODE_ENV === 'development';

run('Vue', TYPED_PACKAGE_JSON.version, () => {
  const htmlDivElement: HTMLDivElement | null = document.querySelector('div#vue');
  if (htmlDivElement instanceof HTMLDivElement) {
    htmlDivElement.appendChild(APP_HTML_ELEMENT);
    // tslint:disable-next-line: no-unused-expression
    new Vue({
      el: APP_HTML_ELEMENT,
      render: (h: CreateElement): VNode => h(App as Component),
    });
  }
});
