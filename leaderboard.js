//This code is partially based on the meteor.com leaderboard example

//App ID: 	258683774275828
//App Secret: 	3b18e0ade6c202b4605ef84191097a25

//Currently hosted at: http://studentvoting.meteor.com/

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
	if(Session.get("already_voted")){}
	else{
	  Session.set("already_voted", true);
            Players.update(Session.get("selected_player"), {$inc: {score: 1}});
	}
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

Meteor.loginWithFacebook({
  //requestPermissions: ['manage_pages']
}, function (err) {
  if (err)
    Session.set('errorMessage', err.reason || 'Unknown error');
});

}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["James Johnson",
                   "Amy Bryce",
                   "Michael Hennessy",
                   "Fred Hollingsworth",
                   "Johnathan Pryce",
                   "Shelley Murphy"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: 0 });
    }
  });
}
