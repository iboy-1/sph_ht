<template>
  <div class="dashboard-container">
    <Header></Header>
    <Container></Container>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/header'
import Container from './components/container'
import Footer from './components/footer'
export default {
  name: "Dashboard",
  components: {
    Header,
    Container,
    Footer
  },
};
</script>

<style lang="scss" scoped>
// .dashboard {
//   &-container {
//     margin: 30px;
//   }
//   &-text {
//     font-size: 30px;
//     line-height: 46px;
//   }
// }
</style>
