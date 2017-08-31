
angular.module('comss.dashboard').service "DjNotification", ($http, webNotification, $state)->
  @unread = 0
  @total = 0
  @cache = 
    total: 0
    unread: 0 
    notifications: []

  @notifications = []

  @handle = (notification)->
    console.log 'hanlde noti', notification
    if notification.actor_content_type.model is 'customer'
      $state.go 'index.customer.view', {id: notification.actor_object_id}

  @updateUnread = ->
    that = @
    $http.get('/api/notifications/unread-count/').then (response)->
      that.unread = response.data.count
    return

  @notifyUser = (notification)->
    that = @
    webNotification.showNotification 'Seicento Intranet', {
      body: notification._unicode
      icon: '/img/espejo.png'
      onClick: ->
        that.handle notification
        return
      # autoClose: 1000*60*10
    }, (error, hide) ->
      if error
        window.alert 'Unable to show notification: ' + error.message
      else
        console.log 'Notification Shown.'
        setTimeout (->
          console.log 'Hiding notification....'
          hide()
          #manually close the notification (you can skip this if you use the autoClose option)
          return
        ), 5000
      return

  @get = ->
    that = @
    $http.get('/api/notifications/').then (response)->
      that.notifications = response.data
      that.total = response.data.length

      for notification in that.notifications
        if notification.unread
          that.notifyUser notification
          that.markAsRead notification

      return response
    return

  @markAsRead = (notification)->
    that = @
    $http.get('/api/notifications/' + notification.id + '/read/').then (response)->
      return response
    return

  @delete = (notification)->
    that = @
    $http.get('/api/notifications/' + notification.id + '/delete/').then (response)->
      that.update()
      return response
    return

  @update = ->
    that = @
    that.get()
    that.updateUnread()
    return

  @updateCache = ->
    @cache.unread = @unread
    @cache.notifications = @notifications
    @cache.total = @total
    return

  return


angular.module('comss.dashboard').service "DashboardSettings", ($http)->
  @getTemplateUrl = (appName, templateName)->
    "templates/" + appName + "/" + templateName 

  @constants = ->
    $http.get('/api/constants/')

  return

angular.module('comss.dashboard').service "UserAPI", ($http)->
  @get = ->
    $http.get('/api/users/?page_size=1000')

  @single = (id)->
    $http.get('/api/users/' + id)

  @me = ->
    $http.get('/api/me')

  @token = (user)->
    $http.post("/api/token-auth/", user)

  @constants = ->
    $http.get('/api/constants/')
  return

angular.module('comss.dashboard').service "UserService", ($http, $rootScope, $localStorage, UserAPI)->
  @user = $localStorage.user
  @token = $localStorage.token

  @login = (user)->
    that = @
    UserAPI.token(user).then (response)->
      that.token = response.data.token
      $localStorage.token = that.token

      that.updateMe()
      response

  @logout = ->
    $localStorage.$reset()

  @updateMe = ->
    return unless @token

    UserAPI.me().then (response)->
      $localStorage.user = response.data

  @isAuthenticated = ()->
    if @token is null
      return false
    return true
  return

angular.module('comss.dashboard').service "ProductAPI", ($http)->
  @get = (page_size)->
    page_size = 0 unless page_size
    $http.get('/api/products/?page_size=' + page_size).then (response)->
      response.data

  @categories = ()->
    $http.get('/api/products/categories/').then (response)->
      response.data

  @upcoming = (page_size)->
    page_size = 50 unless page_size
    $http.get('/api/products/upcoming/?page_size=' + page_size).then (response)-> 
      response.data

  return
