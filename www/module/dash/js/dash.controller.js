/*
 * controller负责数据对接与权限控制
 */
angular.module('dash', ["dash.service"])
  .controller('DashCtrl', function ($scope,AddNewUserService,AddNewGroupService) {
    // 构建消息UI模板
    $scope.buildTplUrl = function (type) {

      /** 业务类模板 */
      var tplUrl;
      switch (type) {
        case 'industry':
          tplUrl = 'industry';
          break;
        case 'medical':
          tplUrl = 'medical';
          break;
        case 'aircondition':
          tplUrl = 'aircondition';
          buildAircondition();
          break;
        default:
        // TODO：隐藏业务tab
      }
      return 'module/dash/business/' + tplUrl + '/' + tplUrl + '.html';
    };

    /**
     * 构建Aircondition业务
     */
    $scope.expanders = [
      {
        title: 'Click me to expand',
        text: 'Hi there folks, I am the content that was hidden but is now shown.'
      },
      {
        title: 'Click this',
        text: 'I am even better text than you have seen previously'
      },
      {
        title: 'Test',
        text: 'test'
      }];
    function buildAircondition() {

    }
    
    $scope.addNewUser = function () {
      alert('xx');
      AddNewUserService.init();
      console.log("测试添加用户...");
    };
    $scope.addNewGroup = function () {
      console.log("测试发起群聊...");
    };
    $scope.addGroupMember = function () {
      console.log("测试添加群成员...");
    };
  })
