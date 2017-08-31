require 'rack/ssl-enforcer'

use Rack::SslEnforcer, :except_environments => 'development'


use Rack::Static,
  :urls => ["/images", "/js", "/css", "/vendors", "/_assets", "/templates", "/font-awesome", "/img", "/fonts"],
  :root => "public"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('public/_index.html', File::RDONLY)
  ]
}
