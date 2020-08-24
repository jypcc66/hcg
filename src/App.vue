<template>
  <div id="app">
     <router-view />
  </div>
</template>
<script>
export default {
  name: "App"
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
}
.el-menu {
  border-right: 1px solid #2b333f !important;
}
#containerBox {
  margin: 0 0 0 220px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 200px;
  background: #2b333f;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>
