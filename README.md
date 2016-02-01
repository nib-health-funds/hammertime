# hammertime

![Stop! Hammer Time!](hammertime.gif)

Lambdas intended to be run as scheduled functions on non-production
AWS accounts.

stop-hammertime will stop all EC2 that are not tagged with "hammertime:off"
and are not in an ASG. It will also set the instance count of all ASGs
not tagged likewise to 0.

start-hammertime will query the tags left by stop-hammertime and return
the instances to their previous status.
