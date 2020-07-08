<template>
  <v-app>
    <Navbar/>
    <v-content>
      <v-container>
        <Main/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Main from './components/Main';
import Navbar from './components/Navbar'
export default {
  name: 'App',

  components: {
    Main,
    Navbar
  },

  data: () => ({
    //
  }),
};
</script>
