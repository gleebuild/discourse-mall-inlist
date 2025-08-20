# frozen_string_literal: true
# name: discourse-mall-inlist
# about: Mall/Admin tabs that only replace the discovery list area (3.6-ready) + Categories support
# version: 0.1.1
# authors: ChatGPT
# url: https://example.com/discourse-mall-inlist

after_initialize do
  module ::MallInlist; end

  class ::MallInlist::Engine < ::Rails::Engine
    engine_name "mall_inlist"
    isolate_namespace MallInlist
  end

  require_dependency "application_controller"
  class ::MallInlist::StoreController < ::ApplicationController
    skip_before_action :preload_json
    skip_before_action :check_xhr

    def index
      if params[:inlist].present?
        render partial: "mall_inlist/list_mall"
      else
        render layout: "no_ember"
      end
    end

    def admin
      guardian.ensure_can_admin_settings!
      if params[:inlist].present?
        render partial: "mall_inlist/list_admin"
      else
        render layout: "no_ember"
      end
    end
  end

  MallInlist::Engine.routes.draw do
    get "/" => "store#index"
    get "/admin" => "store#admin"
  end

  Discourse::Application.routes.append do
    mount ::MallInlist::Engine, at: "/mall"
  end
end
