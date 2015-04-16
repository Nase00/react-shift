var React = require('react/addons'),
    Arrow = require('./components/arrow.jsx'),
    ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

React.initializeTouchEvents(true)

var Shift = React.createClass({
    propTypes: {
      arrowLabels: React.PropTypes.object,
      arrowLabels: React.PropTypes.shape({
        nextPage: React.PropTypes.string,
        previousPage: React.PropTypes.string
      }),
      fastLinks: React.PropTypes.object,
      transitions: React.PropTypes.bool,
      scrollable: React.PropTypes.bool
    },
    getDefaultProps: function() {
      return {
        arrowLabels: {
          nextPage: "Next page",
          previousPage: "Previous page"
        },
        fastLinks: {},
        scrollable: true
      };
    },
    getInitialState: function() {
      return {
        mounted: false,
        page: 0,
        pageCount: 0
      };
    },
    componentDidMount: function() {
      this.setState({
        mounted: true,
        pageCount: this.props.children.length - 1,
        scrollable: this.props.scrollable
      });
    },
    nextPage: function() {
      this.state.page === this.state.pageCount ? null : this.setState({page: this.state.page + 1});
    },
    previousPage: function() {
      this.state.page === 0 ? null : this.setState({page: this.state.page - 1});
    },
    setPage: function(n) {
      this.setState({page: n});
    },
    handleWheel: function(e) {
      if (this.props.scrollable) {
        if (e.deltaY > 0) {
          this.nextPage();
        } else {
          this.previousPage();
        };
      };
    },
    handleTouch: function(e) {
      console.log(e.changedTouches[0].pageX)
    },
    render: function() {
      var self = this,
          fastLinks = this.props.fastLinks,
          paginationArray = Array.apply(null, {length: this.state.pageCount + 1}).map(Number.call, Number),
          filler =
            <div className="react-shift-nav-arrow">{"\u00a0"}</div>,
          leftArrow =
            this.state.page === 0 ? filler : <Arrow label={this.props.arrowLabels.previousPage} on_click={this.previousPage} />,
          rightArrow =
           this.state.page === this.state.pageCount ? filler : <Arrow label={this.props.arrowLabels.nextPage} on_click={this.nextPage} />,
          pagination =
            <span key="react-shift-page-numbers" id="react-shift-pagination" className="react-shift-pagination">
              {paginationArray.map(function(n) {
                return n == self.state.page ? <a key={"currentPage-" + self.state.page} id={"page-" + n} className="react-shift-page-number react-shift-current-page" href="#">{n + 1}</a> : <a key={"page" + n} id={"page-" + n} className="react-shift-page-number" href="#" onClick={self.setPage.bind(null, n)}>{n + 1}</a>
              })}
            </span>

          if (this.props.fastLinks) {
            var fastLinksList =
              <div id="react-shift-fast-links">
                {Object.keys(fastLinks).map(function(i, v) {
                  return <a key={"fastLink" + i} className="react-shift-fast-link" href="#" onClick={self.setPage.bind(null, fastLinks[i])}>{Object.keys(fastLinks)[v]}</a>;
                })}
              </div>
          } else {
            var fastLinksList;
          };

      return (
        <div key="react-shift" id="react-shift-wrapper" onWheelCapture={this.handleWheel} onTouchMove={this.handleTouch}>
          <div id="react-shift-page">
            {this.props.transitions ? <ReactCSSTransitionGroup transitionName="react-shift-page">
              {this.props.children[this.state.page]}
            </ReactCSSTransitionGroup> : this.props.children[this.state.page]}
          </div>
          <nav id="react-shift-navigation">
            {fastLinksList}
            {leftArrow, pagination, rightArrow}
          </nav>
        </div>
      );
    }
  });

module.exports = Shift;