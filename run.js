#!/usr/bin/env node

'use strict';

var AWS = require('aws-sdk');

AWS.config.loadFromPath('./ec2-access.json');

var ec2 = new AWS.EC2();

console.log("About to create an instance...");

var params = {
  ImageId: 'ami-16fd7026', // Amazon Linux AMI i386 EBS	
  InstanceType: 't1.micro',
  MinCount: 1, 
  MaxCount: 1,
  SecurityGroups: ['default', 'admin-access'],
  UserData: 'SGVsbG8gdGhpcyBpcyBzb21lIHRlc3QgZGF0YSBmcm9tIEpvcmRhbg==',
  KeyName: 'jdinwiddy-default'
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);
  console.log(data);
  console.log(data.Instances);
  console.log(data.Instances[0]);

  // Add tags to the instance
  params = {Resources: [instanceId], Tags: [
    {Key: 'Name', Value: 'test instance 1'}
  ]};
  ec2.createTags(params, function(err) {
    console.log("Tagging instance", err ? "failure" : "success");
  });
});


console.log('Hello world');