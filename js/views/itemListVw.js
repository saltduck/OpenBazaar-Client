/* shows grid of items */

var _ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');
Backbone.$ = $;
var fs = require('fs'),
    itemsShortCollection = require('../collections/itemsShortCL'),
    itemShortView = require('./itemShortVw')

module.exports = Backbone.View.extend({

  initialize: function(options){
    var self = this;
    this.options = options || {};
    //the model must be passed in by the constructor
    this.itemsShort = new itemsShortCollection(this.model);
    this.listenTo(this.options.userModel, 'change', function(){
      self.render();
    });
    this.subViews = [];
    this.render();
  },

  render: function(){
    var self = this;
    //clear the list
    this.$el.empty();
    _.each(this.itemsShort.models, function(item){
      self.renderItem(item);
    },this);
  },

  renderItem: function(item){
    var itemShort = new itemShortView({
      model: item,
      userCurrencyCode:  this.options.userModel.get('currencyCode'),
      server: this.options.userModel.get('server'),
      showAvatar: this.options.showAvatar,
      avatar_hash: this.options.userModel.get('avatar_hash'),
      handle: this.options.userModel.get('handle')
    });
    this.subViews.push(itemShort);
    //$el must be passed in by the constructor
    this.$el.append(itemShort.render().el);
  },

  close: function(){
    _.each(this.subViews, function(subView) {
      if(subView.close){
       subView.close();
      }else{
        subView.remove();
      }
    });
    this.remove();
  }
});

