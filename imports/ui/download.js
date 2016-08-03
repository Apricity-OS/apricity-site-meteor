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
    Meteor.call('downloads.insert', this.name, this.edition,
                this.channel, this.version, 'direct');
    window.location.href = ("https://static.apricityos.com/iso/apricity_os-" +
                            this.version + "-" + this.channel.toLowerCase() +
                            "-" + this.edition.toLowerCase() + ".iso");
  },
  'click .torrent-button'(event, instance) {
    Meteor.call('downloads.insert', this.name, this.edition,
                this.channel, this.version, 'torrent');
    window.location.href = ("https://static.apricityos.com/iso/apricity_os-" +
                            this.version + "-" + this.channel.toLowerCase() +
                            "-" + this.edition.toLowerCase() + ".torrent");
  }
});
