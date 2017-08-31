angular.module('comss.dashboard').service("DjNotification", function($http, webNotification, $state) {
  this.unread = 0;
  this.total = 0;
  this.cache = {
    total: 0,
    unread: 0,
    notifications: []
  };
  this.notifications = [];
  this.handle = function(notification) {
    console.log('hanlde noti', notification);
    if (notification.actor_content_type.model === 'customer') {
      return $state.go('index.customer.view', {
        id: notification.actor_object_id
      });
    }
  };
  this.updateUnread = function() {
    var that;
    that = this;
    $http.get('/api/notifications/unread-count/').then(function(response) {
      return that.unread = response.data.count;
    });
  };
  this.notifyUser = function(notification) {
    var that;
    that = this;
    return webNotification.showNotification('Seicento Intranet', {
      body: notification._unicode,
      icon: '/img/espejo.png',
      onClick: function() {
        that.handle(notification);
      }
    }, function(error, hide) {
      if (error) {
        window.alert('Unable to show notification: ' + error.message);
      } else {
        console.log('Notification Shown.');
        setTimeout((function() {
          console.log('Hiding notification....');
          hide();
        }), 5000);
      }
    });
  };
  this.get = function() {
    var that;
    that = this;
    $http.get('/api/notifications/').then(function(response) {
      var i, len, notification, ref;
      that.notifications = response.data;
      that.total = response.data.length;
      ref = that.notifications;
      for (i = 0, len = ref.length; i < len; i++) {
        notification = ref[i];
        if (notification.unread) {
          that.notifyUser(notification);
          that.markAsRead(notification);
        }
      }
      return response;
    });
  };
  this.markAsRead = function(notification) {
    var that;
    that = this;
    $http.get('/api/notifications/' + notification.id + '/read/').then(function(response) {
      return response;
    });
  };
  this["delete"] = function(notification) {
    var that;
    that = this;
    $http.get('/api/notifications/' + notification.id + '/delete/').then(function(response) {
      that.update();
      return response;
    });
  };
  this.update = function() {
    var that;
    that = this;
    that.get();
    that.updateUnread();
  };
  this.updateCache = function() {
    this.cache.unread = this.unread;
    this.cache.notifications = this.notifications;
    this.cache.total = this.total;
  };
});

angular.module('comss.dashboard').service("DashboardSettings", function($http) {
  this.getTemplateUrl = function(appName, templateName) {
    return "templates/" + appName + "/" + templateName;
  };
  this.constants = function() {
    return $http.get('/api/constants/');
  };
});

angular.module('comss.dashboard').service("UserAPI", function($http) {
  this.get = function() {
    return $http.get('/api/users/?page_size=1000');
  };
  this.single = function(id) {
    return $http.get('/api/users/' + id);
  };
  this.me = function() {
    return $http.get('/api/me');
  };
  this.token = function(user) {
    return $http.post("/api/token-auth/", user);
  };
  this.constants = function() {
    return $http.get('/api/constants/');
  };
});

angular.module('comss.dashboard').service("UserService", function($http, $rootScope, $localStorage, UserAPI) {
  this.user = $localStorage.user;
  this.token = $localStorage.token;
  this.login = function(user) {
    var that;
    that = this;
    return UserAPI.token(user).then(function(response) {
      that.token = response.data.token;
      $localStorage.token = that.token;
      that.updateMe();
      return response;
    });
  };
  this.logout = function() {
    return $localStorage.$reset();
  };
  this.updateMe = function() {
    if (!this.token) {
      return;
    }
    return UserAPI.me().then(function(response) {
      return $localStorage.user = response.data;
    });
  };
  this.isAuthenticated = function() {
    if (this.token === null) {
      return false;
    }
    return true;
  };
});

angular.module('comss.dashboard').service("ProductAPI", function($http) {
  this.get = function(page_size) {
    if (!page_size) {
      page_size = 0;
    }
    return $http.get('/api/products/?page_size=' + page_size).then(function(response) {
      return response.data;
    });
  };
  this.categories = function() {
    return $http.get('/api/products/categories/').then(function(response) {
      return response.data;
    });
  };
  this.upcoming = function(page_size) {
    if (!page_size) {
      page_size = 50;
    }
    return $http.get('/api/products/upcoming/?page_size=' + page_size).then(function(response) {
      return response.data;
    });
  };
});
