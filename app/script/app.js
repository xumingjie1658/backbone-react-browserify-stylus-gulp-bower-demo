/* spa top module */

'use strict';

var page = page || {};

page.DISCOVER = "discover";
page.EXHIBITION = "exhibition";
page.EXHIBITION_DETAIL = "exhibition_detail";
page.EXHIBITION_POSITION = "exhibition_position";
page.ORDER = "order";

var DiscoverApp = React.createClass({

    getInitialState: function () {
        return {
            currentPage: 0,
            long : 0,
            lat : 0,
            eid : 0
        };
    },

    componentDidMount : function(){
        var _this = this;
        var Router = Backbone.Router.extend({
            routes : {
                'discover' : 'discover',
                'exhibition' : 'exhibition',
                'exhibition_detail/:eid' : 'exhibition_detail',
                'exhibition_position/:long/:lat' : 'exhibition_position'
            },
            discover : function(){
                console.log('discover');
                return _this.setState({currentPage : page.DISCOVER});
            },
            exhibition : function(){
                return _this.setState({currentPage : page.EXHIBITION});
            },
            exhibition_detail : function(eid){
                console.log(eid);
                return _this.setState({currentPage : page.EXHIBITION_DETAIL, eid : eid});
            },
            exhibition_position : function(long,lat){
                console.log('exhibition_position');
                console.log(long + ' ' + lat);
                return _this.setState({currentPage : page.EXHIBITION_POSITION, long : long, lat : lat});
            }
        });

        new Router();

        Backbone.history.start();

    },

    render: function () {
        var output = null;
        switch (this.state.currentPage) {
            case page.DISCOVER :
                output = "discover";
                break;
            case page.EXHIBITION :
                output = "exhibition";
                break;
            case page.EXHIBITION_DETAIL :
                output = "exhibition_detail";
                break;
            case page.EXHIBITION_POSITION :
                output = "exhibition_position";
                break;
            default:
                output = "default";
        }
        return (
            <div>
                <section>
                    {output}
                </section>
            </div>
        );
    }
});

module.exports = DiscoverApp;