export default ({ store, app }) => {
  app.router.afterEach((to, from) => {
    store.dispatch("error/clear");
  });
};
