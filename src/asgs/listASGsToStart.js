const hasTag = require('./hasTag');
const listTargetASGs = require('./listTargetASGs');

function startableASG(asg) {
  console.log(`Looking at ${asg.AutoScalingGroupName}, stop:hammertime tag is ${hasTag(asg, 'stop:hammertime')}, hammertime:canttouchthis is ${hasTag(asg, 'hammertime:canttouchthis')}`);
  const hammerTimeTags = asg.Tags.filter(tag => /^hammertime:*/.test(tag.Key));

  const canStart = hammerTimeTags.reduce((accum, currentTag) => {
    return accum && analyseTag(currentTag.Tag);
  });

  return hasTag(asg, 'stop:hammertime') && !hasTag(asg, 'hammertime:canttouchthis') && canStart;
}

function listASGsToStart() {
  return listTargetASGs(startableASG);
}

module.exports = listASGsToStart;
