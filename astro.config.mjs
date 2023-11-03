import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import vue from "@astrojs/vue";
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [vue()]
});