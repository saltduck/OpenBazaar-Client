var __ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery'),
    loadTemplate = require('../utils/loadTemplate'),
    countriesModel = require('../models/countriesMd'),
    chooseCurrenciesCollection = require('../collections/chooseCurrencyCl'),
    chooseCurrencyView = require('../views/chooseCurrencyVw'),
    getBTPrice = require('../utils/getBitcoinPrice');

module.exports = Backbone.View.extend({

  initialize: function(options){
    var self = this;
    this.options = options || {};
    this.countries = new countriesModel();
    //create a list of currencies from the country list, so we can maintain a single set of data
    var uniqueCurrencies = __.uniq(this.countries.get('countries'), function(item){return item.code;});
    var orderedCurrencies = uniqueCurrencies.sort(function(a,b){
      var cA = a.currency.toLowerCase(),
          cB = b.currency.toLowerCase();
      if (cA < cB){
        return -1;
      }
      if (cA > cB){
        return 1;
      }
      return 0;
    });
    orderedCurrencies.unshift({code: "BTC", currency: "Bitcoin", currencyUnits: "4"});
    this.chooseCurrencies = new chooseCurrenciesCollection(orderedCurrencies);
    this.subViews = [];
    //use default currency to return list of supported currencies
    getBTPrice("USD", function (btAve, currencyList) {
      "use strict";
      self.availableCurrenciesList = currencyList;
      self.render();
    });
    this.totalCurrencies = 0;
  },

  render: function(){
    var self = this;
    this.listContents = [];
    __.each(this.chooseCurrencies.models, function(item){
      self.renderItem(item);
    },this);

    this.$el.append('<ul class="flexRow list homeModal-settings scrollOverflowY custCol-primary custCol-text">'+ this.listContents.join('') +'</ul>');
    window.obEventBus.trigger("currencyListRendered", this.totalCurrencies);
  },

  renderItem: function(item){
    if(this.availableCurrenciesList.indexOf(item.get('code')) > -1 || item.get('code') === "BTC"){
      var itemJSON = item.toJSON();
      this.listContents.push('<li class="flexRow custCol-border-secondary">');
      this.listContents.push('<div class="rowItem js-homeModal-currencySelect padding0 paddingLeft6" data-code="'+ itemJSON.code +'" data-name="'+ itemJSON.dataName +'">');
      this.listContents.push('<input type="radio" class="fieldItem" id="currency-'+ itemJSON.dataName +'" name="'+ itemJSON.code +'"');
      if(itemJSON.selected == itemJSON.code){
        this.listContents.push('checked="checked"');
      }
      this.listContents.push('>');
      this.listContents.push('<label class="homeModal-currency radioLabel" for="currency-'+ itemJSON.dataName +'">'+ itemJSON.currency +'</label>');
      this.listContents.push('</div></li>');
    }
  },

  close: function(){
    __.each(this.subViews, function(subView) {
      if(subView.close){
        subView.close();
      }else{
        subView.unbind();
        subView.remove();
      }
    });
    this.unbind();
    this.remove();
  }
});

