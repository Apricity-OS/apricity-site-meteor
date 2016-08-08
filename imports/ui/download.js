import {Template} from 'meteor/templating';
import {getContent} from './home.js';

Template.downloadPage.helpers({
  gnomeStableDesc() {
    return getContent('gnomeStableDesc');
  },
  gnomeBetaDesc() {
    return getContent('gnomeBetaDesc');
  },
  cinnamonStableDesc() {
    return getContent('cinnamonStableDesc');
  },
  cinnamonBetaDesc() {
    return getContent('cinnamonBetaDesc');
  }
});

// Template.downloadCard.helpers({
//   downloadUrl() {
//     return "https://static.apricityos.com/iso/apricity_os-" + this.version + "-" + this.channel.toLowerCase() + "-" + this.edition.toLowerCase() + ".iso";
//   },
//   torrentUrl() {
//     return "https://static.apricityos.com/iso/apricity_os-" + this.version + "-" + this.channel.toLowerCase() + "-" + this.edition.toLowerCase() + ".torrent";
//   }
// });

Template.downloadCard.events({
  'click .download-button'(event, instance) {
    let self = this;
    let rev = this.rev ? '-v' + this.rev : '';
    Meteor.call('downloads.insert', self.name, self.edition,
                self.channel, self.version, 'direct',
                function(err, result) {
                  window.location.assign("https://static.apricityos.com/iso/apricity_os-" +
                                         self.version + "-" + self.channel.toLowerCase() + rev +
                                         "-" + self.edition.toLowerCase() + ".iso");
                });
  },
  'click .torrent-button'(event, instance) {
    let self = this;
    let rev = this.rev ? '-v' + this.rev : '';
    Meteor.call('downloads.insert', self.name, self.edition,
                self.channel, self.version, 'torrent',
                function(err, result) {
                  window.location.assign("https://static.apricityos.com/iso/apricity_os-" +
                                         self.version + "-" + self.channel.toLowerCase() + rev +
                                         "-" + self.edition.toLowerCase() + ".torrent");
                });
  }
});
