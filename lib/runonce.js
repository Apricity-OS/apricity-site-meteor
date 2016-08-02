import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

const RunOnce = new Mongo.Collection('runonce');

export function runOnce(func, name) {
  if (!RunOnce.findOne({name: name})) {
    func();
    RunOnce.insert({name: name});
  }
}
