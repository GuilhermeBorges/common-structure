
var searchResults = require('./components/search-results');

module.exports = {
	init: function(){
		window.searchResults = searchResults;
	}
};

var Vue = require('Vue');
var Ticket = require('../vue-components/ticket.vue');

var searchResults = {

    render: function() {
        //Vue.http.headers.common['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content');
        new Vue({
            el: '#search-results',
            components:{Ticket},
            data: function(){

                return {
                    user: {
                        username: '',
                        email: '',
                        password: '',
                    },
                    name: 'Pedra letícia',
                    price: 'R$500'
                }
            },
            methods: {
                // caseSuccessSubmit:function(response)
                // {
                //     alert('tuto certo');
                // },
                // caseErrorSubmit:function(response)
                // {
                //     this.returnMessage = response.message;
                //     alert('deu ruim');
                // },

                // submitForm: function(){
                //     this.returnMessage = '';

                //     //chamar a validacao
                //     this.$http.post('/api/user/login', this.user).then(this.caseSuccessSubmit, this.caseErrorSubmit);
                // }


            }
        });
    }
};

module.exports = searchResults;
//# sourceMappingURL=main.js.map
