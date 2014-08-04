#!/usr/bin/env ruby

# You might want to change this
ENV["RAILS_ENV"] ||= "production"

root = File.expand_path(File.dirname(__FILE__))
root = File.dirname(root) until File.exists?(File.join(root, 'config'))
Dir.chdir(root)

require File.join(root, "config", "environment")

$running = true
Signal.trap("TERM") do
  $running = false
end

client = Twitter::Streaming::Client.new(
    consumer_key: Rails.application.secrets.tw_consumer_key,
    consumer_secret: Rails.application.secrets.tw_consumer_secret,
    access_token: Rails.application.secrets.tw_access_token,
    access_token_secret: Rails.application.secrets.tw_access_token_secret
)
# put stream block inside of a loop to restart it in case of an error
while $running
  begin
    #todo: stream only when there're active webpage visitors
    client.sample do |object|
      found=false
      if object.is_a?(Twitter::Tweet)
        unless object.geo.nil?
          found=true
          WebsocketRails[:tweets].trigger(:new, object.to_h)
        end
      end
      break unless $running
      if found
        sleep(3)
      end
    end
  rescue Exception=>e
    Rails.logger.error "Exception "+e.to_s
  rescue
    Rails.logger.error "Error"
  end
  sleep 3
end
