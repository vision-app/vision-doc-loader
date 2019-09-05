import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import CodeExamplePlugin from './CodeExamplePlugin';
Vue.use(CodeExamplePlugin);

import { install } from 'vusion-utils';

// 自动注册本地组件
const requires = require.context('../components/', true, /\.vue$/);
requires.keys().forEach((key) => {
    if (key.indexOf('.vue') !== key.lastIndexOf('.vue'))
        return;
    const name = requires(key).default.name || key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
    Vue.component(name, requires(key).default);
});

import $docs from './empty';
Vue.prototype.$docs = $docs;
Vue.prototype.NODE_ENV = process.env.NODE_ENV;
if (process.env.NODE_ENV === 'development')
    window.$docs = $docs; // 方便开发时调试

import * as ProtoUI from 'proto-ui.vusion';
import 'baseCSS';
import * as Library from '@@';

install(Vue, ProtoUI);
if ($docs.install === 'option-name') {
    Object.keys(Library).forEach((key) => {
        const Component = Library[key];
        const name = typeof Component === 'function' ? Component.options.name : Component.name;
        name && Vue.component(name, Component);
    });
} else
    install(Vue, Library);

/* eslint-disable no-undef */
if (DOCS_COMPONENTS_PATH) {
    const requires2 = require.context(DOCS_COMPONENTS_PATH, true, /\.vue$/);
    requires2.keys().forEach((key) => {
        if (key.indexOf('.vue') !== key.lastIndexOf('.vue'))
            return;
        const name = requires2(key).default.name || key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
        Vue.component(name, requires2(key).default);
    });
}

if (DOCS_IMPORTS_PATH) {
    const imports = require(DOCS_IMPORTS_PATH);
    install(Vue, imports);
}

document.title = $docs.title || 'Vusion 组件库';

new Vue({
    router: new VueRouter({
        mode: $docs.mode,
        base: $docs.base,
        routes: $docs.routes,
        scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
    }),
}).$mount('#app');
