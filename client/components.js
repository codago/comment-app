var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  loadComments: function(){
    $.ajax({
      url: "http://localhost:3000/api/comments",
      dataType: "json",
      cache: false,
      success: function(response){
        this.setState({data: response})
      }.bind(this),
      error: function(xhr, status, err){
        console.error(status, err.toString());
      }
    })
  },
  handleCommentSubmit: function(comment){
    var oldComments = this.state.data;
    comment.id = Date.now();
    var newComments = oldComments.concat([comment]);
    this.setState({data: newComments})
    // save to server
    $.ajax({
      url: "http://localhost:3000/api/comments",
      dataType: "json",
      type: "POST",
      data: comment,
      success: function(response){
        //cuek aja
      },
      error: function(xhr, status, err){
        this.setState({data: oldComments})
      }.bind(this)
    })
  },
  componentDidMount: function(){
    this.loadComments();
  },
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments App</h1>
        <CommentList data={this.state.data}/>
        <CommmentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    )
  }
})

var CommmentForm = React.createClass({
  getInitialState: function(){
    return {author: '', text: ''}
  },
  handleAuthorChange: function(e){
    this.setState({author: e.target.value})
  },
  handleTextChange: function(e){
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e){
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!text || !author){
      return;
    }
    this.props.onCommentSubmit({author: author, text: text})
    this.setState({author: '', text: ''})
  },
  render: function(){
    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="your name" value={this.state.author} onChange={this.handleAuthorChange}/>
        <input type="text" placeholder="say something..." value={this.state.text} onChange={this.handleTextChange}/>
        <input type="submit" value="Send"/>
      </form>
    )
  }
})

var Comment = React.createClass({
  render: function(){
    return(
      <div>
        <h4>{this.props.author}</h4>
        <p>{this.props.text}</p>
      </div>
    )
  }
})

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment){
      return(<Comment key={comment.id} author={comment.author} text={comment.text}/>)
    })
    return(
      <div>
      {commentNodes}
      </div>
    )
  }
})

ReactDOM.render(
  <CommentBox/>, document.getElementById('content')
)
