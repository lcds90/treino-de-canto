import { defineBoot } from '#q-app/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ app }) => {
  app.directive('test', {
    mounted(el, binding) {
      if (process.env.DEV) {
        el.setAttribute('data-test', binding.value);
      }
    },
  });
});
