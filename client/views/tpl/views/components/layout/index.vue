
<template>
  <div class='layout'>
    <Layout style='height: 100%; width: 100%;'>
      <Header style='padding: 0;height: 60px;line-height: 60px;' class='layout-header-bar'>
        header
      </Header>
      <Content class='content'>
        <slot />
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
  .layout{
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    width: 100%;
    min-width: 1160px;
    height: 100%;
  }
  .layout-header-bar{
    display: flex;
    align-items: center;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    z-index: 1000;
    .icon-menu-switch{
      font-size: 18px;
      margin-left: 20px;
      color: #2D8CF0;
      position: relative;
      cursor: pointer;
      margin-right: 40px;
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      &:hover{
        background-color: #f8f8f8;
      }
      &:after{
        content: "";
        display: block;
        position:absolute;
        top: 8px;
        right: 4px;
        width: 8px;
        height: 8px;
        border: 1px solid #fff;
        border-radius: 100%;
        background-color: #ff8901;
      }
    }
    .bread-crumbs{
      display: inline-block;
      line-height: 60px;
      flex: 1;
      i{
        margin-right: 8px;
        font-size: 18px;
        &:before{
          position: relative;
          top: 2px;
        }
      }
      .crumb{
        font-size: 12px;
        color: #333;
      }
      .op{
        margin: 0 10px;
        color: #C0CCDA;
      }
      .end{
        color: #999;
      }
    }

    .user-action{
      padding: 0 15px 0 30px;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      .action-btn{
        padding: 5px 10px;
        .iconfont{
          color: #999;
        }
        .icon-sys-message{
          font-size: 20px;
          position: relative;
          top: 1px;
        }
        .icon-main-menu{
          font-size: 24px;
        }
        .user-info{
          display: flex;
          align-items: center;
          .icon-user{
            font-size: 26px;
            color: #d8d8d8;
            margin-right: 10px;
          }
          .user-name{
            font-size: 14px;
            color: #333333;
            font-weight: 500;
            margin-right: 5px;
          }
          .arrow{
            color: #99A9BF;
          }
        }
      }
    }
  }
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .content{
    // margin: 20px;
    // background: #fff;
    min-height: 260px;
    height:calc(100% - 60px);
  }

</style>
