class TweetController < WebsocketRails::BaseController

  def initialize_session
    controller_store[:connected_count]=0
  end

  def client_connected
    controller_store[:connected_count]+=1
    #todo: store connection count in database
  end

  def client_disconnected
    if controller_store[:connected_count]>0
      controller_store[:connected_count]-=1
    end
    #todo: store connection count in database
  end
end
